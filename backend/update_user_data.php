<?php
// update the contact number and email address from user dashboard
session_start();
header('Content-Type: application/json');
require 'connectdb.php'; // Ensure correct path

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"), true);

// Check for missing fields
if (!isset($data['contact_number']) && !isset($data['email_address'])) {
    echo json_encode(["status" => "error", "message" => "No data to update"]);
    exit;
}

// **Check if user exists before updating**
$checkUserStmt = $conn->prepare("SELECT user_id FROM approved_user WHERE user_id = ?");
$checkUserStmt->bind_param("i", $user_id);
$checkUserStmt->execute();
$userExists = $checkUserStmt->get_result()->num_rows > 0;
$checkUserStmt->close();

if (!$userExists) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit;
}

// **New: Check if the new contact number or email address already exists for another user**
if (isset($data['contact_number'])) {
    $checkContactStmt = $conn->prepare("SELECT user_id FROM approved_user WHERE contact_number = ? AND user_id != ?");
    $checkContactStmt->bind_param("si", $data['contact_number'], $user_id);
    $checkContactStmt->execute();
    if ($checkContactStmt->get_result()->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Contact number already in use by another user."]);
        exit;
    }
    $checkContactStmt->close();
}

if (isset($data['email_address'])) {
    $checkEmailStmt = $conn->prepare("SELECT user_id FROM approved_user WHERE email_address = ? AND user_id != ?");
    $checkEmailStmt->bind_param("si", $data['email_address'], $user_id);
    $checkEmailStmt->execute();
    if ($checkEmailStmt->get_result()->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email address already in use by another user."]);
        exit;
    }
    $checkEmailStmt->close();
}

// Prepare SQL query based on received fields
$fields = [];
$params = [];
$types = "";

if (isset($data['contact_number'])) {
    $fields[] = "contact_number = ?";
    $params[] = $data['contact_number'];
    $types .= "s";
}

if (isset($data['email_address'])) {
    $fields[] = "email_address = ?";
    $params[] = $data['email_address'];
    $types .= "s";
}

$params[] = $user_id;
$types .= "i";

$query = "UPDATE approved_user SET " . implode(", ", $fields) . " WHERE user_id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    exit;
}

$stmt->bind_param($types, ...$params);
$success = $stmt->execute();

if ($success) {
    echo json_encode(["status" => "success", "message" => "Profile updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed"]);
}

$stmt->close();
$conn->close();
