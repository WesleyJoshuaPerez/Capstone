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
$user_id = str_pad($user_id, 10, '0', STR_PAD_LEFT);

// Capitalize the first letter of the new plan
$new_plan = ucwords(strtolower(trim($new_plan)));

// Price map based on selected plan
$planPrices = [
    "Bronze" => 1199,
    "Silver" => 1499,
    "Gold" => 1799
];

// Ensure the new plan is valid
if (!array_key_exists($new_plan, $planPrices)) {
    echo json_encode(["status" => "error", "message" => "Invalid subscription plan."]);
    exit;
}

// ✅ Validate current bill
$billCheckStmt = $conn->prepare("SELECT currentBill FROM approved_user WHERE user_id = ?");
$billCheckStmt->bind_param("s", $user_id);
$billCheckStmt->execute();
$billResult = $billCheckStmt->get_result();

if ($billResult->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit;
}

$currentBill = (float) $billResult->fetch_assoc()['currentBill'];
$billCheckStmt->close();

if ($currentBill > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "You must settle your current bill (₱$currentBill) before changing your subscription plan."
    ]);
    exit;
}

// Get the price for the selected plan
$price = $planPrices[$new_plan];

// Insert the new plan change request
$stmt = $conn->prepare("
    INSERT INTO change_plan_application (user_id, full_name, current_plan, new_plan, price)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("ssssd", $user_id, $full_name, $current_plan, $new_plan, $price);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Plan change submitted for admin approval."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to save to database."]);
}

$stmt->close();
$conn->close();
?>
