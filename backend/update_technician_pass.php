<?php
session_start();
header("Content-Type: application/json");
require 'connectdb.php';

// Check if technician is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Technician not logged in."]);
    exit;
}

// Read JSON input (currentPassword, newPassword)
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid input data."]);
    exit;
}

$currentPassword = trim($data['currentPassword']);
$newPassword     = trim($data['newPassword']);

// Basic validation
if (empty($currentPassword) || empty($newPassword)) {
    echo json_encode(["status" => "error", "message" => "Both current and new passwords are required."]);
    exit;
}

$user_id = $_SESSION['user_id'];

// 1. Fetch the current password from lynx_technicians
$sql = "SELECT password FROM lynx_technicians WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Technician not found in the database."]);
    exit;
}
$row = $result->fetch_assoc();
$stmt->close();

// 2. Compare the current password with what's in DB (plain text in this example)
if ($row['password'] !== $currentPassword) {
    echo json_encode(["status" => "error", "message" => "Current password is incorrect."]);
    exit;
}

// 3. Update the password in lynx_technicians
$updateSql = "UPDATE lynx_technicians SET password = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
if (!$updateStmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}
$updateStmt->bind_param("si", $newPassword, $user_id);

if ($updateStmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update password: " . $updateStmt->error]);
}

$updateStmt->close();
$conn->close();

error_log("Session user_id: " . $_SESSION['user_id']);

?>
