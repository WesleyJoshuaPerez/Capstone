<?php
// insertion of data to change_subscription_application table
require 'connectdb.php';

header('Content-Type: application/json');

// Get submitted data
$user_id = $_POST['userId'];
$full_name = $_POST['fullName'];
$current_plan = $_POST['currentSubscription'];
$new_plan = $_POST['selectSubscription'];

// Price map based on selected plan
$planPrices = [
    "bronze" => 1199,
    "silver" => 1499,
    "gold" => 1799
];

$price = $planPrices[$new_plan] ?? 0;

// Insert the new plan change request into the database
$stmt = $conn->prepare("
    INSERT INTO change_plan_application (user_id, full_name, current_plan, new_plan, price)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("isssd", $user_id, $full_name, $current_plan, $new_plan, $price);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Plan change submitted for admin approval."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to save to database."]);
}

$stmt->close();
$conn->close();
