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

// Query 2: Change‐plan applications
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

// Merge results into one array
$resMaint = $conn->query($sqlMaint);
if ($resMaint) {
    while($row = $resMaint->fetch_assoc()) {
        $notifications[] = $row;
    }
}

$resPlan = $conn->query($sqlPlan);
if ($resPlan) {
    while($row = $resPlan->fetch_assoc()) {
        $notifications[] = $row;
    }
}

echo json_encode([
    'status' => 'success',
    'data' => $notifications
]);

$conn->close();
