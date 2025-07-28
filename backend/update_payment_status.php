<?php
// Include database connection
include('connectdb.php'); // Ensure this connects $conn (MySQLi)

// Set JSON response header
header('Content-Type: application/json');

// Get the raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Verify required fields
if (!isset($data['payment_id']) || !isset($data['status'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields.']);
    exit;
}

$paymentId = $data['payment_id'];
$status = strtolower($data['status']); // Convert status to lowercase for consistency
$reason = isset($data['reason']) ? trim($data['reason']) : null; // Optional reason

try {
    // Start transaction
    $conn->begin_transaction();

    // Handle "Approved" status
    if ($status === 'approved') {
        // Update the payments table
        $stmt = $conn->prepare("UPDATE payments SET status = 'Paid' WHERE payment_id = ?");
        $stmt->bind_param("i", $paymentId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to update payment status to Paid.");
        }

        // Fetch the user_id associated with the payment
        $stmt = $conn->prepare("SELECT user_id FROM payments WHERE payment_id = ?");
        $stmt->bind_param("i", $paymentId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            throw new Exception("Payment not found.");
        }
        $row = $result->fetch_assoc();
        $userId = $row['user_id'];

        // Update the approved_user table
        $stmt = $conn->prepare("
          UPDATE approved_user
             SET currentBill = 0,
                 payment_status = 'Paid',
                 last_payment_date = ?,
                 account_status = 'active'
           WHERE user_id = ?
        ");
        $currentDate = date('Y-m-d H:i:s'); // Current timestamp
        $stmt->bind_param("ss", $currentDate, $userId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to update approved_user table.");
        }
    }

    // Handle "Denied" status
    elseif ($status === 'denied') {
        $stmt = $conn->prepare("UPDATE payments SET status = 'Denied', admin_remarks = ? WHERE payment_id = ?");
        $stmt->bind_param("si", $reason, $paymentId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to update payment status to Denied.");
        }
    }

    // Invalid Status
    else {
        throw new Exception("Invalid status provided.");
    }

    // Commit transaction
    $conn->commit();

    // Return success response
    echo json_encode(['status' => 'success', 'message' => 'Payment status updated successfully.']);

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>