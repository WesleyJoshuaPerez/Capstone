<?php
require __DIR__ . '/vendor/autoload.php'; // for .env file
// Try to load .env safely
try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
} catch (Throwable $e) {
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "error" => "Failed to load .env: " . $e->getMessage()
    ]);
    exit;
}

// send_reminders.php
// Sends SMS ONCE 5 days before due date
// Shows subscriber's name and due date
include('connectdb.php'); //for database connection
date_default_timezone_set("Asia/Manila"); // Set PH timezone



// Get target date (5 days ahead)
$today = date('Y-m-d');
$targetDate = date('Y-m-d', strtotime($today . " +5 days"));

// Get subscribers whose due_date is 5 days away
// Update SQL to include currentBill
$sql = "SELECT user_id, fullname, contact_number, due_date, currentBill
        FROM approved_user 
        WHERE due_date = '$targetDate'";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rawNumber = $row['contact_number'];

        // Clean number
        $digits = preg_replace('/\D/', '', $rawNumber);
        $number = (substr($digits, 0, 1) === '0') ? '63' . substr($digits, 1) : $digits;

        $fullname = $row['fullname'];
        $due_date_obj = new DateTime($row['due_date']);
        $due_date_words = $due_date_obj->format('l, F j, Y'); // Friday, August 22, 2025
        $amount = number_format($row['currentBill'], 2); // format as currency

        // Semaphore API Key
        $api_key = $_ENV['SEMAPHORE_API_TOKEN'];

        // SMS message with amount
        $message = "Hello, $fullname! This is a reminder that your billing due date is on $due_date_words with an amount of PHP $amount. Please settle your balance before the said date to avoid service interruption. Thank you!";

        // Send SMS via Semaphore
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://semaphore.co/api/v4/messages");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'apikey' => $api_key,
            'number' => $number,
            'message' => $message,
            'sendername' => 'LYNX'
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($ch);
        curl_close($ch);

        echo "Sent SMS to $fullname ($number) for due date $due_date, Amount: PHP $amount\n";
    }
} else {
    echo "No reminders to send today.\n";
}


$conn->close();
