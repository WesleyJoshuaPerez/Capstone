<?php
session_start();
header("Content-Type: application/json");
require 'connectdb.php'; // Assuming 'connectdb.php' contains your DB connection setup

// Check if technician is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Technician not logged in."]);
    exit;
}

// Get technician ID and new password from the AJAX POST request
$technicianId = $_POST['technician_id'];
$newPassword = trim($_POST['new_password']);

// Validate the new password
if (empty($newPassword)) {
    echo json_encode(["status" => "error", "message" => "New password is required."]);
    exit;
}

// Hash the new password using MD5 (Note: MD5 is not recommended for security reasons)
$hashedNewPassword = md5($newPassword);

// Prepare SQL statement to update password for the technician
$sql = "UPDATE lynx_technicians SET password = ? WHERE technician_id = ?";
$stmt = $conn->prepare($sql);

// Bind parameters to prevent SQL injection
$stmt->bind_param("si", $hashedNewPassword, $technicianId);

// Execute the query and check if the password was updated successfully
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update password."]);
}

// Close the prepared statement and database connection
$stmt->close();
$conn->close();
?>
