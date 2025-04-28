<?php
// Changing password from user dashboard
session_start();
header("Content-Type: application/json");
require "connectdb.php"; // Ensure the database connection

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if user is logged in
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit;
}

$user_id = $_SESSION["user_id"];
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No input received."]);
    exit;
}

$currentPassword = $data["currentPassword"] ?? "";
$newPassword = $data["newPassword"] ?? "";

// Fetch the current hashed password from the database
$stmt = $conn->prepare("SELECT password FROM approved_user WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit;
}

$user = $result->fetch_assoc();

// Compare the MD5 hash of the current password with the stored password
if (md5($currentPassword) !== $user["password"]) {
    echo json_encode(["status" => "error", "message" => "Current password is incorrect."]);
    exit;
}

// Hash the new password before saving it
$hashedNewPassword = md5($newPassword);

$updateStmt = $conn->prepare("UPDATE approved_user SET password = ? WHERE user_id = ?");
$updateStmt->bind_param("si", $hashedNewPassword, $user_id);

if ($updateStmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update password."]);
}

$stmt->close();
$updateStmt->close();
$conn->close();
?>
