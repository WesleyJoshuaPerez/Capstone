<?php
// getting of data from approved_user table for user dashboard
session_start();
header('Content-Type: application/json'); 

require 'connectdb.php';

// Check if session exists
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Check database connection
if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Fetch user data
$stmt = $conn->prepare("
    SELECT user_id, fullname, subscription_plan, currentBill, 
           contact_number, address, birth_date, email_address, installation_date, registration_date
    FROM approved_user WHERE user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// If user exists, return data including subscription info
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Return all user details including subscription info
    echo json_encode([
        "status" => "success",
        "user_id" => $user['user_id'],
        "fullname" => $user['fullname'],
        "subscription_plan" => $user['subscription_plan'],
        "currentBill" => floatval($user['currentBill']), // ensure number type
        "contact_number" => $user['contact_number'],
        "address" => $user['address'],
        "birth_date" => $user['birth_date'],  
        "email_address" => $user['email_address'],
        "installation_date" => $user['installation_date'],
        "registration_date" => $user['registration_date']
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "User not found in the database."
    ]);
}

$stmt->close();
$conn->close();
?>
