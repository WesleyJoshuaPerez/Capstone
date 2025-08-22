<?php
require_once 'connectdb.php';
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

$nap_box_id = (int)$_GET['nap_box_id'];

$sql = "SELECT nap_box_status FROM nap_box_availability WHERE nap_box_id = $nap_box_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $new_status = ($row['nap_box_status'] === 'Enabled') ? 'Disabled' : 'Enabled';

    // Update the status
    $updateSql = "UPDATE nap_box_availability SET nap_box_status = '$new_status' WHERE nap_box_id = $nap_box_id";
    if ($conn->query($updateSql) === TRUE) {

        // Fetch subscribers under this NapBox with active accounts
        $subscribersSql = "SELECT fullname, contact_number 
                           FROM approved_user 
                           WHERE nap_box_id = $nap_box_id 
                           AND account_status = 'Active'";
        $subscribersResult = $conn->query($subscribersSql);

        if ($subscribersResult->num_rows > 0) {
            while ($subscriber = $subscribersResult->fetch_assoc()) {
                $fullname = $subscriber['fullname'];
                $rawNumber = $subscriber['contact_number'];

                $digits = preg_replace('/\D/', '', $rawNumber);
                if (substr($digits, 0, 1) === '0') {
                    $number = '63' . substr($digits, 1);
                } else {
                    $number = $digits;
                }

                $api_key = $_ENV['SEMAPHORE_API_TOKEN']; 

                // Different messages depending on status
                if ($new_status === 'Disabled') {
                    $message = "Hello, $fullname! We would like to inform you that we are currently experiencing an unscheduled internet interruption. Rest assured, we are working to resolve it quickly. Thank you!";
                } else { 
                    $message = "Hello, $fullname! Good news! Your internet service has been restored. Thank you for your patience!";
                }

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
            }
        }

        echo json_encode(['success' => true, 'new_status' => $new_status]);
    } else {
        echo json_encode(['success' => false, 'message' => $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'NapBox not found.']);
}

$conn->close();
