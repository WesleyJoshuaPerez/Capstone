<?php
session_start();
require 'connectdb.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and sanitize data from POST 
    $client_name       = trim($_POST['client_name']);
    $contact_number    = trim($_POST['contact_number']);
    $issue_type        = trim($_POST['issue_type']);
    $issue_description = trim($_POST['issue_description']);
    $progress_update   = trim($_POST['progress_update']);
    $work_done         = trim($_POST['work_done']);

    $time_spent        = (float) $_POST['time_spent'];

    // Get the technician's name from the session
    $submitted_by = isset($_SESSION['techName']) ? trim($_SESSION['techName']) : 'Unknown';

    $sql = "INSERT INTO progress_reports (
                client_name,
                contact_number,
                issue_type,
                issue_description,
                progress_update,
                work_done,
                time_spent_in_hour,
                submitted_by,
                submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("ssssssds", 
        $client_name,
        $contact_number,
        $issue_type,
        $issue_description,
        $progress_update,
        $work_done,
        $time_spent,
        $submitted_by
    );

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Progress report saved."]);
    } else {
        error_log("Execution failed: " . $stmt->error);
        echo json_encode(["status" => "error", "message" => "Execution failed: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
    