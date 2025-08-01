<?php
session_start();
header('Content-Type: application/json');
require 'connectdb.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT user_id, fullname, subscription_plan, currentBill, 
           contact_number, address, birth_date, email_address, 
           installation_date, registration_date, payment_status, last_payment_date, account_status
    FROM approved_user WHERE user_id = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    $plan = strtolower($user['subscription_plan']);
    $currentBill = floatval($user['currentBill']);
    $installDate = $user['installation_date'];
    $today = date('Y-m-d');
    $paymentStatus = $user['payment_status'];
    $lastPayment = $user['last_payment_date'];
    $isPaid = ($user['payment_status'] === 'paid');

    $planPrices = [
        'bronze' => 1199,
        'silver' => 1499,
        'gold'   => 1799
    ];
    $originalPrice = $planPrices[$plan] ?? 0;

    // Calculate how many months since install
    $monthsSinceInstall = floor((strtotime($today) - strtotime($installDate)) / (30 * 24 * 60 * 60));
    $nextDueDate = date('Y-m-d', strtotime("+$monthsSinceInstall month", strtotime($installDate)));

    // If the user has paid for the current cycle, advance due date to next cycle
    if ($lastPayment && strtotime($lastPayment) >= strtotime($nextDueDate)) {
        $nextDueDate = date('Y-m-d', strtotime("+1 month", strtotime($nextDueDate)));
    }

    // Billing trigger: only if today >= due date and not paid for this cycle
    if (strtotime($today) >= strtotime($nextDueDate)) {
        if (!$lastPayment || strtotime($lastPayment) < strtotime($nextDueDate)) {
            if ($currentBill == 0 && $paymentStatus == 'unpaid') {
                $update = $conn->prepare("UPDATE approved_user SET currentBill = ?, payment_status = 'unpaid' WHERE user_id = ?");
                $update->bind_param("di", $originalPrice, $user_id);
                $update->execute();
                $update->close();

                $user['currentBill'] = $originalPrice;
                $user['payment_status'] = 'unpaid';
            }

            if ($paymentStatus == 'paid') {
                $updateStatus = $conn->prepare("UPDATE approved_user SET payment_status = 'unpaid' WHERE user_id = ?");
                $updateStatus->bind_param("i", $user_id);
                $updateStatus->execute();
                $updateStatus->close();

                $user['payment_status'] = 'unpaid';
            }
        }
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
        "account_status" => $user['account_status']
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