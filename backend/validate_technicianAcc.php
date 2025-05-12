<?php
header('Content-Type: application/json');
require 'connectdb.php'; // Ensure you're connecting to the database

// Get technician data from POST request
$input = json_decode(file_get_contents("php://input"), true);
$name = $input['name'] ?? '';
$username = $input['username'] ?? '';
$contact_number = $input['contact'] ?? '';  // Ensure the key for contact is 'contact' in your input data

// Check if any of the values (name, username, or contact) already exist
$stmt = $conn->prepare("SELECT * FROM lynx_technicians WHERE name = ? OR username = ? OR contact = ?");
$stmt->bind_param("sss", $name, $username, $contact_number);
$stmt->execute();
$result = $stmt->get_result();

// If any technician with the same name, username, or contact exists, return error message
if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false, 
        "message" => "Technician with this name, username, or contact already exists."
    ]);
    $stmt->close();
    $conn->close();
    exit;
}

// If no duplicate, proceed with adding the technician
$stmt = $conn->prepare("INSERT INTO lynx_technicians (name, username, contact) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $username, $contact_number);
$insertSuccess = $stmt->execute();
$stmt->close();
$conn->close();

if ($insertSuccess) {
    echo json_encode([
        "success" => true, 
        "message" => "Technician added successfully."
    ]);
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Failed to add technician."
    ]);
}
?>
