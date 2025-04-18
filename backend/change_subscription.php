<?php
// Insertion of data to change_subscription_application table
require 'connectdb.php';

header('Content-Type: application/json');

// Get submitted data
$user_id = $_POST['userId'] ?? null;
$full_name = $_POST['fullName'] ?? null;
$current_plan = $_POST['currentSubscription'] ?? null;
$new_plan = $_POST['selectSubscription'] ?? null;

// Ensure that all fields are filled
if (!$user_id || !$full_name || !$current_plan || !$new_plan) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

// Format user_id to be 10 digits with leading zeros
$user_id = str_pad($user_id, 10, '0', STR_PAD_LEFT);  // Ensure user_id is 10 digits

// Capitalize the first letter of the new plan
$new_plan = ucwords(strtolower(trim($new_plan))); 

// Price map based on selected plan
$planPrices = [
    "Bronze" => 1199,
    "Silver" => 1499,
    "Gold" => 1799
];

// Ensure the new plan is a valid option
if (!array_key_exists($new_plan, $planPrices)) {
    echo json_encode(["status" => "error", "message" => "Invalid subscription plan."]);
    exit;
}

// Get the price for the selected new plan
$price = $planPrices[$new_plan];

// Insert the new plan change request into the database
$stmt = $conn->prepare("
    INSERT INTO change_plan_application (user_id, full_name, current_plan, new_plan, price)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param("ssssd", $user_id, $full_name, $current_plan, $new_plan, $price);

// Execute and check if the query was successful
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Plan change submitted for admin approval."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to save to database."]);
}

$stmt->close();
$conn->close();
?>
