<?php
// Clean output buffer to prevent any whitespace/errors before JSON
if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

require 'connectdb.php';

// Set headers
header('Content-Type: application/json; charset=utf-8');

// Error handling - disable display, enable logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

try {
    // Get user_id as string to preserve leading zeros
    $userId = isset($_GET['user_id']) ? trim($_GET['user_id']) : '';
    
    if (empty($userId)) {
        throw new Exception('Invalid user ID');
    }
    
    $notifications = [];
    
    // Query 1: Maintenance requests with progress reports
    $sqlMaint = "SELECT 
        maintenance_id AS request_id,
        user_id,
        full_name,
        status,
        issue_type,
        issue_description,
        contact_time,
        evidence_filename,
        submitted_at,
        technician_name
      FROM maintenance_requests
      WHERE user_id = ? AND status != 'Viewed'";
    
    $stmtMaint = $conn->prepare($sqlMaint);
    if (!$stmtMaint) {
        throw new Exception('Prepare failed for maintenance: ' . $conn->error);
    }
    
    // Bind as string to handle leading zeros
    $stmtMaint->bind_param("s", $userId);
    $stmtMaint->execute();
    $resMaint = $stmtMaint->get_result();
    
    while($row = $resMaint->fetch_assoc()) {
        $row['type'] = 'maintenance';
        $row['progress_reports'] = [];
        
        // Get client info for matching progress reports
        $clientName = $row['full_name'];
        $issueType = $row['issue_type'];
        $issueDescription = $row['issue_description'];
        
        // Fetch progress reports matching this maintenance request
        // Match by client_name, issue_type, and issue_description
        $sqlProgress = "SELECT 
            progress_id,
            client_name,
            contact_number,
            issue_type,
            issue_description,
            progress_update,
            work_done,
            time_spent_in_hour,
            submitted_by,
            submitted_at
          FROM progress_reports
          WHERE client_name = ? 
            AND issue_type = ? 
            AND issue_description = ?
          ORDER BY submitted_at DESC";
        
        $stmtProgress = $conn->prepare($sqlProgress);
        if ($stmtProgress) {
            $stmtProgress->bind_param("sss", $clientName, $issueType, $issueDescription);
            $stmtProgress->execute();
            $resProgress = $stmtProgress->get_result();
            
            while($progressRow = $resProgress->fetch_assoc()) {
                $row['progress_reports'][] = $progressRow;
            }
            $stmtProgress->close();
        }
        
        $notifications[] = $row;
    }
    $stmtMaint->close();
    
    // Query 2: Change plan requests
    $sqlPlan = "SELECT 
        change_plan_id AS request_id,
        user_id,
        full_name,
        status,
        current_plan,
        new_plan,
        price,
        changed_at
      FROM change_plan_application
      WHERE user_id = ? AND status != 'Viewed'";
    
    $stmtPlan = $conn->prepare($sqlPlan);
    if (!$stmtPlan) {
        throw new Exception('Prepare failed for change plan: ' . $conn->error);
    }
    
    $stmtPlan->bind_param("s", $userId);
    $stmtPlan->execute();
    $resPlan = $stmtPlan->get_result();
    
    while($row = $resPlan->fetch_assoc()) {
        $row['type'] = 'change_plan';
        $notifications[] = $row;
    }
    $stmtPlan->close();
    
    // Query 3: Payments
    $sqlPayments = "SELECT 
        payment_id AS request_id,
        user_id,
        fullname AS full_name,
        subscription_plan,
        mode_of_payment,
        added_misc,
        paid_amount,
        payment_date,
        reference_number,
        proof_of_payment,
        status,
        admin_remarks
      FROM payments
      WHERE user_id = ? AND status != 'Viewed'";
    
    $stmtPayments = $conn->prepare($sqlPayments);
    if (!$stmtPayments) {
        throw new Exception('Prepare failed for payments: ' . $conn->error);
    }
    
    $stmtPayments->bind_param("s", $userId);
    $stmtPayments->execute();
    $resPayments = $stmtPayments->get_result();
    
    while($row = $resPayments->fetch_assoc()) {
        $row['type'] = 'payment';
        $notifications[] = $row;
    }
    $stmtPayments->close();
    
    $conn->close();
    
    // Clear any buffered output
    ob_end_clean();
    
    // Output JSON
    echo json_encode([
        'status' => 'success',
        'data' => $notifications
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    // Clear any buffered output
    ob_end_clean();
    
    // Return error as JSON
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
exit;
?>