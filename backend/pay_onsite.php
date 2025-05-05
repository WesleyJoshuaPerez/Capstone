<?php
session_start();
include('connectdb.php');
header('Content-Type: application/json');

// Set default timezone
date_default_timezone_set('Asia/Manila');

// Validate session to ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

// Get the raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Validate JSON input
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
    exit;
}

// Validate required fields
if (!isset($data['subscriberId']) || !isset($data['currentBill'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

// Sanitize input
$subscriberId = filter_var($data['subscriberId'], FILTER_SANITIZE_STRING);
$currentBill = filter_var($data['currentBill'], FILTER_VALIDATE_FLOAT);

if ($currentBill === false || $currentBill < 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid current bill amount.']);
    exit;
}

$today = date('Y-m-d');

try {
    // Start transaction
    $conn->begin_transaction();

    // Fetch subscriber details from the approved_user table
    $stmt = $conn->prepare("SELECT firstname, last_name, subscription_plan, currentBill FROM approved_user WHERE user_id = ?");
    $stmt->bind_param("s", $subscriberId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        throw new Exception("Subscriber not found.");
    }
    $subscriber = $result->fetch_assoc();
    $fullname = $subscriber['first_name'] . ' ' . $subscriber['last_name'];
    $subscriptionPlan = $subscriber['subscription_plan'];
    $currentBillFromDB = $subscriber['currentBill'];

    // Validate if the current bill matches the record in the database
    if ($currentBill != $currentBillFromDB) {
        throw new Exception("Current bill amount does not match the database record.");
    }

    // Insert payment into payments table
    $stmt = $conn->prepare("
        INSERT INTO payments (
            user_id, 
            fullname, 
            subscription_plan, 
            mode_of_payment, 
            paid_amount, 
            payment_date, 
            reference_number, 
            proof_of_payment, 
            status
        ) VALUES (?, ?, ?, 'Onsite', ?, ?, 'N/A', 'Onsite Payment', 'Paid')
    ");
    $stmt->bind_param("sssds", $subscriberId, $fullname, $subscriptionPlan, $currentBill, $today);
    if (!$stmt->execute()) {
        throw new Exception("Failed to insert payment.");
    }

    // Update the approved_user table
    $stmt = $conn->prepare("
        UPDATE approved_user
           SET currentBill = 0,
               payment_status = 'Paid',
               last_payment_date = ?
         WHERE user_id = ?
    ");
    $stmt->bind_param("ss", $today, $subscriberId);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update subscriber.");
    }

    // Commit transaction
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Payment successful.']);
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>