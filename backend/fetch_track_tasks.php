<?php
session_start();

// Always send JSON header
header('Content-Type: application/json');

// Prevent PHP from printing warnings/errors to output (they break JSON)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

require 'connectdb.php';

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
    COALESCE(mr.status, 'No Status') AS maintenance_status
  FROM progress_reports pr
  LEFT JOIN maintenance_requests mr 
    ON pr.client_name = mr.full_name AND pr.issue_type = mr.issue_type
  WHERE pr.submitted_by = ? 
    AND COALESCE(mr.status, 'No Status') NOT IN ('Completed', 'Denied', 'Ongoing', 'Pending', 'Viewed'))

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
    COALESCE(mr.status, 'No Status') AS maintenance_status
  FROM completion_report cf
  LEFT JOIN maintenance_requests mr 
    ON cf.client_name = mr.full_name AND cf.issue_type = mr.issue_type
  WHERE cf.submitted_by = ?
    AND COALESCE(mr.status, 'No Status') NOT IN ('Denied', 'Ongoing', 'Pending', 'Viewed'))

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

$response = empty($rows)
    ? ["status" => "success", "message" => "No track tasks available"]
    : ["status" => "success", "data" => $rows];

// Output the response as JSON
echo json_encode($response);
exit;
?>
