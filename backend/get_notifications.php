<?php
require 'connectdb.php';
header('Content-Type: application/json');

$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;

$notifications = [];

// Query 1: Maintenance requests
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
    technician_name,
    'maintenance' AS type
  FROM maintenance_requests
  WHERE user_id = $userId";

$resMaint = $conn->query($sqlMaint);
if ($resMaint) {
    while($row = $resMaint->fetch_assoc()) {
        $notifications[] = $row;
    }
}

// Query 2: Change plan requests
$sqlPlan = "SELECT 
    change_plan_id AS request_id,
    user_id,
    full_name,
    status,
    current_plan,
    new_plan,
    price,
    changed_at,
    'change_plan' AS type
  FROM change_plan_application
  WHERE user_id = $userId";

$resPlan = $conn->query($sqlPlan);
if ($resPlan) {
    while($row = $resPlan->fetch_assoc()) {
        $notifications[] = $row;
    }
}

// Query 3: Payments as separate records
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
    admin_remarks,
    'payment' AS type
  FROM payments
  WHERE user_id = $userId";

$resPayments = $conn->query($sqlPayments);
if ($resPayments) {
    while($row = $resPayments->fetch_assoc()) {
        $notifications[] = $row;
    }
}

echo json_encode([
    'status' => 'success',
    'data' => $notifications
]);

$conn->close();
