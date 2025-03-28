<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';

// Set response header
header("Content-Type: application/json");

// Get JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'], $data['status'])) {
    $id = intval($data['id']);
    $status = $data['status'];

    // Update the maintenance request status
    $query = "UPDATE maintenance_requests SET status = ? WHERE maintenance_id = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]);
        exit;
    }
    $stmt->bind_param("si", $status, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Maintenance request updated successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to update maintenance request: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request parameters."]);
}

$conn->close();
?>