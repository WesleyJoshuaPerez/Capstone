<?php
require __DIR__ . '/vendor/autoload.php';
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

include('connectdb.php'); 
date_default_timezone_set("Asia/Manila");

// Inputs
$nap_box_id = $_POST['nap_box_id'] ?? null;
$scheduled_message = $_POST['scheduled_message'] ?? "";

if (!$nap_box_id) {
    echo "NapBox ID is required.\n";
    exit;
}

// Get subscribers under this NapBox with Active accounts
$sql = "SELECT fullname, contact_number 
        FROM approved_user 
        WHERE nap_box_id = '$nap_box_id' 
        AND account_status = 'Active'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $fullname = $row['fullname'];
        $rawNumber = $row['contact_number'];

        // Clean number
        $digits = preg_replace('/\D/', '', $rawNumber);
        $number = (substr($digits, 0, 1) === '0') ? '63' . substr($digits, 1) : $digits;

        // Semaphore API Key
        $api_key = $_ENV['SEMAPHORE_API_TOKEN'];

        // Personalized SMS message
        $message = "Hello, $fullname! This is to inform you that we will have an internet interruption on $scheduled_message. Thank you!";

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

        echo "Sent interruption SMS to $fullname ($number) for NapBox $nap_box_id\n";
    }
} else {
    echo "No active subscribers under NapBox $nap_box_id.\n";
}

$conn->close();
