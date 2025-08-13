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

// This code use for GCash payment
$paymentId = $data['payment_id'];
$status = strtolower($data['status']); // Convert status to lowercase for consistency
$reason = isset($data['reason']) ? trim($data['reason']) : null; // Optional reason

// Function to calculate next due date based on installation date
function calculateNextDueDate($installationDate) {
    $today = date('Y-m-d');
    $monthsSinceInstall = floor((strtotime($today) - strtotime($installationDate)) / (30 * 24 * 60 * 60));
    $nextDueDate = date('Y-m-d', strtotime("+1 month +$monthsSinceInstall month", strtotime($installationDate)));
    return $nextDueDate;
}

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

        // Fetch the user_id and installation_date associated with the payment
        $stmt = $conn->prepare("
            SELECT p.user_id, u.installation_date 
            FROM payments p 
            JOIN approved_user u ON p.user_id = u.user_id 
            WHERE p.payment_id = ?
        ");
        $stmt->bind_param("i", $paymentId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("Payment not found or user not found.");
        }

        $row = $result->fetch_assoc();
        $userId = $row['user_id'];
        $installationDate = $row['installation_date'];

        // Calculate next due date
        $nextDueDate = calculateNextDueDate($installationDate);
        $currentDate = date('Y-m-d H:i:s'); // Current timestamp

        // Update the approved_user table with due_date and reminder_sent reset
        $stmt = $conn->prepare("
            UPDATE approved_user
            SET currentBill = 0,
                payment_status = 'Paid',
                last_payment_date = ?,
                account_status = 'active',
                due_date = ?,
                reminder_sent = 0
            WHERE user_id = ?
        ");
        $stmt->bind_param("sss", $currentDate, $nextDueDate, $userId);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to update approved_user table.");
        }

        // Success response with next due date info
        $response = [
            'status' => 'success', 
            'message' => 'Payment approved and status updated successfully.',
            'next_due_date' => $nextDueDate,
            'user_id' => $userId
        ];
    }
    // Handle "Denied" status
    elseif ($status === 'denied') {
        $stmt = $conn->prepare("UPDATE payments SET status = 'Denied', admin_remarks = ? WHERE payment_id = ?");
        $stmt->bind_param("si", $reason, $paymentId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to update payment status to Denied.");
        }

        $response = [
            'status' => 'success',
            'message' => 'Payment denied and status updated successfully.',
            'reason' => $reason
        ];
    }
    // Invalid Status
    else {
        throw new Exception("Invalid status provided. Use 'approved' or 'denied'.");
    }

    // Commit transaction
    $conn->commit();
    
    // Return success response
    echo json_encode($response);

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    // Close connection if needed
    if (isset($stmt)) {
        $stmt->close();
    }
}
?>