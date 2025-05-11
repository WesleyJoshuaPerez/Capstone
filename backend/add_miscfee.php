<?php
session_start();
include('connectdb.php');
header('Content-Type: application/json');
date_default_timezone_set('Asia/Manila');

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

// Decode JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
    exit;
}

// Validate input
if (!isset($data['subscriberId']) || !isset($data['fee'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

$subscriberId = filter_var($data['subscriberId'], FILTER_SANITIZE_STRING);
$fee = filter_var($data['fee'], FILTER_VALIDATE_FLOAT);

// Validate fee
if ($fee === false || $fee < 10 || $fee > 1000) {
    echo json_encode(['success' => false, 'message' => 'Fee must be between ₱10 and ₱1,000.']);
    exit;
}

try {
    // Start transaction
    $conn->begin_transaction();

    // Get current currentBill
    $stmt = $conn->prepare("SELECT currentBill FROM approved_user WHERE user_id = ?");
    $stmt->bind_param("s", $subscriberId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Subscriber not found.");
    }

    $row = $result->fetch_assoc();
    $updatedBill = $row['currentBill'] + $fee;

    // Update the currentBill
    $stmt = $conn->prepare("UPDATE approved_user SET currentBill = ? WHERE user_id = ?");
    $stmt->bind_param("ds", $updatedBill, $subscriberId);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update current bill.");
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Miscellaneous fee added to current bill.']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
