<?php
session_start();
require 'connectdb.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data from POST 
    $client_name         = $_POST['client_name'];
    $contact_number      = $_POST['contact_number'];
    $issue_type          = $_POST['issue_type'];
    $issue_description   = $_POST['issue_description'];
    $completion_datetime = $_POST['completion_datetime'];
    $work_description    = $_POST['work_description'];
    $parts_used          = $_POST['parts_used'];
    $issues_encountered  = $_POST['issues_encountered'];
    $technician_comments = $_POST['technician_comments'];

    // Get the technician's name from the session as submitted_by
    $submitted_by = isset($_SESSION['techName']) ? $_SESSION['techName'] : 'Unknown';

    $sql = "INSERT INTO completion_report (
                client_name,
                contact_number,
                issue_type,
                issue_description,
                completion_datetime,
                work_description,
                parts_used,
                issues_encountered,
                technician_comments,
                submitted_by,
                submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("ssssssssss",
        $client_name,
        $contact_number,
        $issue_type,
        $issue_description,
        $completion_datetime,
        $work_description,
        $parts_used,
        $issues_encountered,
        $technician_comments,
        $submitted_by
    );

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Completion form saved."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Execution failed: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
