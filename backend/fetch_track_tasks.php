<?php
session_start();
header('Content-Type: application/json');
require 'connectdb.php';

// Enable error reporting for debugging purposes
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SESSION['techName'])) {
    echo json_encode(["status" => "error", "message" => "Technician not logged in."]);
    exit;
}

$techName = $_SESSION['techName'];

$sql = "
  (SELECT
    'progress' AS report_type,
    pr.progress_id AS report_id,
    pr.client_name,
    pr.issue_type,
    pr.submitted_at,
    pr.submitted_by,
    pr.progress_update,
    pr.work_done,
    pr.time_spent_in_hour,
    NULL AS work_description,
    NULL AS parts_used,
    NULL AS issues_encountered,
    NULL AS technician_comments,
    COALESCE(mr.status, 'No Status') AS maintenance_status  -- Use full_name to join with maintenance_requests
  FROM progress_reports pr
  LEFT JOIN maintenance_requests mr ON pr.client_name = mr.full_name  -- Join using full_name
  WHERE pr.submitted_by = ?)

  UNION

  (SELECT
    'completion' AS report_type,
    cf.completion_id AS report_id,
    cf.client_name,
    cf.issue_type,
    cf.submitted_at,
    cf.submitted_by,
    NULL AS progress_update,
    NULL AS work_done,
    NULL AS time_spent_in_hour,
    cf.work_description,
    cf.parts_used,
    cf.issues_encountered,
    cf.technician_comments,
    COALESCE(mr.status, 'No Status') AS maintenance_status  -- Use full_name to join with maintenance_requests
  FROM completion_report cf
  LEFT JOIN maintenance_requests mr ON cf.client_name = mr.full_name  -- Join using full_name
  WHERE cf.submitted_by = ?)
  ORDER BY submitted_at DESC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("ss", $techName, $techName);
$stmt->execute();
$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["status" => "success", "data" => $rows]);
?>
