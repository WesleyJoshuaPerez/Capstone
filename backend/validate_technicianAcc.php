<?php
header('Content-Type: application/json');
require 'connectdb.php'; // Make sure this connects properly to your DB

// Get technician data from POST request
$input = json_decode(file_get_contents("php://input"), true);
$name = $input['name'] ?? '';
$username = $input['username'] ?? '';
$contact_number = $input['contact'] ?? '';

// Prepare SQL to check for existing technician
$stmt = $conn->prepare("SELECT * FROM lynx_technicians WHERE name = ? OR username = ? OR contact = ?");
$stmt->bind_param("sss", $name, $username, $contact_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Duplicate found
    echo json_encode([
        "success" => false,
        "message" => "Technician with this name, username, or contact already exists."
    ]);
} else {
    // No duplicates — technician is unique
    echo json_encode([
        "success" => true,
        "message" => "Technician is unique."
    ]);
}

$stmt->close();
$conn->close();
?>
