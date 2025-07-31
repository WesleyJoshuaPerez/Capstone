<?php
// disconnect_subscriber.php

header("Content-Type: application/json");
require 'connectdb.php';

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

// Get the raw POST data
$input = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($input['subscriberId'])) {
    echo json_encode(["success" => false, "message" => "Subscriber ID is required."]);
    exit;
}

$subscriberId = intval($input['subscriberId']);

// Optional: Logically "terminate" account status and doesnt remove data on the database table
$stmt = $conn->prepare("UPDATE approved_user SET account_status = 'disconnected' WHERE user_id = ?");
$stmt->bind_param("i", $subscriberId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
