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

// Check if user exists before updating
$checkUserStmt = $conn->prepare("SELECT contact_number, email_address FROM approved_user WHERE user_id = ?");
$checkUserStmt->bind_param("i", $user_id);
$checkUserStmt->execute();
$userResult = $checkUserStmt->get_result();

if ($userResult->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit;
}

$currentData = $userResult->fetch_assoc();
$checkUserStmt->close();

// Check if new contact number or email already exists for another user
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

// Check if any values actually changed
$sameContact = isset($data['contact_number']) && $data['contact_number'] === $currentData['contact_number'];
$sameEmail = isset($data['email_address']) && $data['email_address'] === $currentData['email_address'];

$contactSent = isset($data['contact_number']);
$emailSent = isset($data['email_address']);

if (
    ($contactSent && $sameContact) &&
    ($emailSent && $sameEmail)
) {
    echo json_encode(["status" => "info", "message" => "No changes were made."]);
    exit;
}

// Prepare SQL query based on received fields
$fields = [];
$params = [];
$types = "";

if ($contactSent && !$sameContact) {
    $fields[] = "contact_number = ?";
    $params[] = $data['contact_number'];
    $types .= "s";
}

if ($emailSent && !$sameEmail) {
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
    echo json_encode(["status" => "success", "message" => "Profile updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed"]);
}

$stmt->close();
$conn->close();
?>
