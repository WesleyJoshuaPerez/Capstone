<?php
session_start();
header('Content-Type: application/json');
require 'connectdb.php';

// Set consistent timezone
date_default_timezone_set('Asia/Manila');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Add the new columns to the SELECT query
$stmt = $conn->prepare("
    SELECT user_id, fullname, subscription_plan, currentBill, 
           contact_number, address, birth_date, email_address, 
           installation_date, registration_date, payment_status, 
           last_payment_date, account_status, reminder_sent, due_date
    FROM approved_user WHERE user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $plan = strtolower($user['subscription_plan']);
    $installDate = $user['installation_date'];
    $today = date('Y-m-d');
    $isPaid = ($user['payment_status'] === 'paid');
    
    $planPrices = [
        'bronze' => 1199,
        'silver' => 1499,
        'gold'   => 1799
    ];
    $originalPrice = $planPrices[$plan] ?? 0;
    
    //Use consistent due date logic with billing system
    $nextDueDate = $user['due_date'];
    
    // If no due_date is set in database, calculate from installation date
    if (empty($nextDueDate) || $nextDueDate === '0000-00-00') {
        // Use DateTime for proper month calculation (handles month-end dates correctly)
        $installDateTime = new DateTime($installDate);
        $installDateTime->add(new DateInterval('P1M')); // Add 1 month properly
        $nextDueDate = $installDateTime->format('Y-m-d');
    }
    
    
    
    echo json_encode([
        "status" => "success",
        "user_id" => str_pad($user['user_id'], 10, '0', STR_PAD_LEFT),
        "fullname" => $user['fullname'],
        "subscription_plan" => $user['subscription_plan'],
        "currentBill" => floatval($user['currentBill']),
        "contact_number" => $user['contact_number'],
        "address" => $user['address'],
        "birth_date" => $user['birth_date'],
        "email_address" => $user['email_address'],
        "installation_date" => $user['installation_date'],
        "registration_date" => $user['registration_date'],
        "payment_status" => $user['payment_status'],
        "isPaid" => $isPaid,
        "next_due_date" => $nextDueDate,
        "account_status" => $user['account_status'],
        "reminder_sent" => $user['reminder_sent'],
        "due_date" => $user['due_date']
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