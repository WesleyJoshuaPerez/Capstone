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

    // Begin a transaction
    $conn->begin_transaction();

    try {
        // Insert into completion_report
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
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param(
            "ssssssssss",
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

        // Debugging: Check if bind_param is correct and if execute is successful
        if (!$stmt->execute()) {
            throw new Exception("Execution failed: " . $stmt->error);
        }
        $stmt->close();

        // Now update maintenance_requests table
        $update_sql = "UPDATE maintenance_requests 
                       SET status = 'Completed' 
                       WHERE full_name = ? 
                         AND contact_number = ? 
                         AND issue_type = ? 
                         AND issue_description = ? 
                         AND status != 'Completed'";

        $update_stmt = $conn->prepare($update_sql);
        if (!$update_stmt) {
            throw new Exception("Update prepare failed: " . $conn->error);
        }

        $update_stmt->bind_param("ssss", $client_name, $contact_number, $issue_type, $issue_description);

        if (!$update_stmt->execute()) {
            throw new Exception("Update execution failed: " . $update_stmt->error);
        }

        if ($update_stmt->affected_rows > 0) {
            $conn->commit();
            echo json_encode(["status" => "success", "message" => "Completion form saved and maintenance request updated."]);
        } else {
            // No matching maintenance request found
            $conn->rollback();
            echo json_encode(["status" => "error", "message" => "Completion form saved, but no matching maintenance request found to update."]);
        }

        $update_stmt->close();
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }

    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
