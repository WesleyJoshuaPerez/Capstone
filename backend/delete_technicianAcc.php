<?php
header('Content-Type: application/json');
require 'connectdb.php'; // Ensure you're connecting to the database

// Get the technician ID from the POST request
$input = json_decode(file_get_contents("php://input"), true);
$technician_id = $input['technician_id'] ?? '';

if (!$technician_id) {
    echo json_encode(["success" => false, "message" => "No technician ID provided"]);
    exit;
}

// SQL to delete technician account from the database
$stmt = $conn->prepare("DELETE FROM lynx_technicians WHERE technician_id = ?");
$stmt->bind_param("i", $technician_id);
$deleteSuccess = $stmt->execute();
$stmt->close();
$conn->close();

if ($deleteSuccess) {
    echo json_encode(["success" => true, "message" => "Technician deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete technician"]);
}
?>
