<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['technicianName'], $data['requestId'])) {
    $technicianName = $data['technicianName'];
    $requestId = intval($data['requestId']);

    // Debugging output
    error_log("Assigning Technician: $technicianName to Request ID: $requestId");

    // Ensure maintenance request exists before updating
    $checkQuery = "SELECT * FROM maintenance_requests WHERE maintenance_id = ?";
    $stmtCheck = $conn->prepare($checkQuery);
    $stmtCheck->bind_param("i", $requestId);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();
    $stmtCheck->close();

    if ($resultCheck->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Invalid request ID."]);
        exit;
    }

    // Update maintenance request
    $updateQuery = "UPDATE maintenance_requests SET technician_name = ?, status = 'Assigned' WHERE maintenance_id = ?";
    $stmtUpdate = $conn->prepare($updateQuery);
    if ($stmtUpdate === false) {
        echo json_encode(["success" => false, "error" => "Failed to prepare update: " . $conn->error]);
        exit;
    }

    $stmtUpdate->bind_param("si", $technicianName, $requestId);
    if ($stmtUpdate->execute()) {
        if ($stmtUpdate->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Request assigned successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => "No rows updated. Check request ID."]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Failed to execute update: " . $stmtUpdate->error]);
    }
    $stmtUpdate->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request parameters."]);
}

$conn->close();
?>
