<?php
session_start();
header("Content-Type: application/json");
require 'connectdb.php';

// Check if technician is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Technician not logged in."]);
    error_log("Error: Technician not logged in.");
    exit;
}

// Read JSON input (currentPassword, newPassword)
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid input data."]);
    error_log("Error: Invalid input data.");
    exit;
}

$currentPassword = trim($data['currentPassword']);
$newPassword     = trim($data['newPassword']);

// Debugging: Log received input
error_log("Received currentPassword: " . $currentPassword);
error_log("Received newPassword: " . $newPassword);

$user_id = $_SESSION['user_id'];

// Debugging: Log session user_id
error_log("Session user_id: " . $user_id);

// Fetch the current password from lynx_technicians
$sql = "SELECT password FROM lynx_technicians WHERE technician_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Technician not found in the database."]);
    error_log("Error: Technician with ID $user_id not found.");
    exit;
}
$row = $result->fetch_assoc();
$stmt->close();

// Debugging: Log fetched password
error_log("Fetched password from database: " . $row['password']);

// Compare the current password with what's in DB
if ($row['password'] !== $currentPassword) {
    echo json_encode(["status" => "error", "message" => "Current password is incorrect."]);
    error_log("Error: Current password is incorrect.");
    exit;
}

// Update the password in lynx_technicians
$updateSql = "UPDATE lynx_technicians SET password = ? WHERE technician_id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("si", $newPassword, $user_id);

if ($updateStmt->execute()) {
    error_log("Password updated successfully for technician ID $user_id.");

    // Re-fetch the updated password to ensure it is saved
    $verifyUpdatedPassword = $conn->prepare("SELECT password FROM lynx_technicians WHERE technician_id = ?");
    $verifyUpdatedPassword->bind_param("i", $user_id);
    $verifyUpdatedPassword->execute();
    $verificationResult = $verifyUpdatedPassword->get_result();
    if ($verificationRow = $verificationResult->fetch_assoc()) {
        error_log("Verified updated password in database: " . $verificationRow['password']);
    }

    echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update password: " . $updateStmt->error]);
    error_log("Error: Failed to update password - " . $updateStmt->error);
}

$updateStmt->close();
$conn->close();
?>