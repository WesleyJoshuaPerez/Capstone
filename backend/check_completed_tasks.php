<?php
session_start();
require 'connectdb.php';

// Check if technician is logged in
if (!isset($_SESSION['techName'])) {
    echo json_encode(["status" => "error", "message" => "You are not logged in."]);
    exit;
}

$techName = trim($_SESSION['techName']);
$techName = $conn->real_escape_string($techName);

// Query to fetch tasks with "Completed" status for the logged-in technician
$sql = "
    SELECT user_id, full_name, contact_number, issue_type, issue_description, status
    FROM maintenance_requests
    WHERE technician_name = ? AND status = 'Completed'
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $techName);
$stmt->execute();
$result = $stmt->get_result();

$completedTasks = [];
while ($row = $result->fetch_assoc()) {
    // Store the task details for completed tasks
    $completedTasks[] = [
        'user_id' => $row['user_id'],
        'full_name' => $row['full_name'],
        'issue_type' => $row['issue_type'],
        'issue_description' => $row['issue_description'],
        'status' => $row['status']
    ];
}

// Send back the completed tasks data as JSON
echo json_encode($completedTasks);

$stmt->close();
$conn->close();
?>
