<?php
session_start();
include('connectdb.php');

 
ini_set('log_errors', 1);
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
date_default_timezone_set('Asia/Manila');

 
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

// Read and decode JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
    exit;
}

if (!isset($data['subscriberId']) || !isset($data['currentBill'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

$subscriberId = filter_var($data['subscriberId'], FILTER_SANITIZE_STRING);
$currentBill = filter_var($data['currentBill'], FILTER_VALIDATE_FLOAT);

if ($currentBill === false || $currentBill < 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid current bill amount.']);
    exit;
}

$today = date('Y-m-d H:i:s');

// Function to generate a unique reference number
function generateUniqueReference($conn) {
    $count = 0;
    do {
        $reference = 'REF' . strtoupper(uniqid());
        $stmt = $conn->prepare("SELECT COUNT(*) FROM payments WHERE reference_number = ?");
        $stmt->bind_param("s", $reference);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
    } while ($count > 0);
    return $reference;
}

try {
    $conn->begin_transaction();

    // Get subscriber info
    $stmt = $conn->prepare("SELECT fullname, subscription_plan, currentBill FROM approved_user WHERE user_id = ?");
    $stmt->bind_param("s", $subscriberId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Subscriber not found.");
    }

    $subscriber = $result->fetch_assoc();
    $fullname = $subscriber['fullname'];
    $subscriptionPlan = $subscriber['subscription_plan'];
    $currentBillFromDB = $subscriber['currentBill'];

    if ($currentBill != $currentBillFromDB) {
        throw new Exception("Current bill does not match database.");
    }

    $referenceNumber = generateUniqueReference($conn);

    // Insert payment
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
        ) VALUES (?, ?, ?, 'Onsite', ?, ?, ?, 'Onsite Payment', 'Paid')
    ");
    // Correct bind_param: sssdds
    $stmt->bind_param("sssdss", $subscriberId, $fullname, $subscriptionPlan, $currentBill, $today, $referenceNumber);

    if (!$stmt->execute()) {
        throw new Exception("Failed to insert payment.");
    }

    // Update subscriber
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

    $conn->commit();

    //Return valid JSON success
    echo json_encode([
        'success' => true,
        'message' => 'Payment successful.',
        'reference_number' => $referenceNumber
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
