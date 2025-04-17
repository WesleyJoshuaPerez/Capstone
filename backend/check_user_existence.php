<?php
header('Content-Type: application/json');
require 'connectdb.php'; // Your database connection

// Read JSON input from fetch
$input = json_decode(file_get_contents("php://input"), true);

$contact_number = $input['contact_number'] ?? '';
$email_address  = $input['email_address'] ?? '';

if (!$contact_number && !$email_address) {
    echo json_encode(["status" => "error", "message" => "No data provided"]);
    exit;
}

// Check approved_user table
$stmt1 = $conn->prepare("SELECT * FROM approved_user WHERE contact_number = ? OR email_address = ? LIMIT 1");
$stmt1->bind_param("ss", $contact_number, $email_address);
$stmt1->execute();
$result1 = $stmt1->get_result();

// Check registration_acc table
$stmt2 = $conn->prepare("SELECT * FROM registration_acc WHERE contact_number = ? OR email_address = ? LIMIT 1");
$stmt2->bind_param("ss", $contact_number, $email_address);
$stmt2->execute();
$result2 = $stmt2->get_result();

if ($result1->num_rows > 0 || $result2->num_rows > 0) {
    echo json_encode(["status" => "exists"]);
} else {
    echo json_encode(["status" => "not_found"]);
}

$stmt1->close();
$stmt2->close();
$conn->close();
?>
