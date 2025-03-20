<?php
session_start();
header('Content-Type: application/json'); // Ensure JSON output

require 'connectdb.php'; // Adjust path if necessary

// Debug: Check if session exists
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Debug: Check if database connection is working
if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Fetch user data including birth_date and email_address
$stmt = $conn->prepare("
    SELECT user_id, fullname, subscription_plan, currentBill, 
           contact_number, address, birth_date, email_address, registration_date
    FROM approved_user WHERE user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode([
        "status" => "success",
        "user_id" => $user['user_id'],
        "fullname" => $user['fullname'],
        "subscription_plan" => $user['subscription_plan'],
        "currentBill" => $user['currentBill'],
        "contact_number" => $user['contact_number'],
        "address" => $user['address'],
        "birth_date" => $user['birth_date'],  
        "email_address" => $user['email_address'],
        "registration_date" => $user['registration_date']
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "User not found in the database."
    ]);
}

// Close connections
$stmt->close();
$conn->close();
?>
