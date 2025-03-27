<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';

// Set response header
header("Content-Type: application/json");

// Get JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['technicianName'], $data['requestId'])) {
    $technicianName = $data['technicianName'];
    $requestId = intval($data['requestId']);

    // Update the maintenance request to assign it to the technician by name
    $updateQuery = "UPDATE maintenance_requests SET technician_name = ?, status = 'assigned' WHERE id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    if (!$updateStmt) {
        echo json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]);
        exit;
    }
    $updateStmt->bind_param("si", $technicianName, $requestId);

    if ($updateStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Maintenance request assigned successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to assign maintenance request: " . $updateStmt->error]);
    }

    $updateStmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request parameters."]);
}

$conn->close();
?>