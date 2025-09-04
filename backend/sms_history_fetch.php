<?php
require __DIR__ . '/vendor/autoload.php';

try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
} catch (Throwable $e) {
    echo "Failed to load .env: " . $e->getMessage();
    exit;
}

$api_key = $_ENV['SEMAPHORE_API_TOKEN'] ?? '';

if (!$api_key) {
    echo "No API key found in .env";
    exit;
}

// Set a high limit (API max is usually 1000, check Semaphore docs for actual max)
$limit = 1000;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://semaphore.co/api/v4/messages?apikey=" . urlencode($api_key) . "&limit=$limit&sort=created_at&order=desc");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($ch);
curl_close($ch);

$messages = json_decode($response, true);

$table = "
<div class='sms-container'>
    <div class='sms-table-wrapper'>
        <table class='sms-table'>
            <thead>
                <tr>
                    <th>Recipient</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Sent At</th>
                </tr>
            </thead>
            <tbody>";

if (is_array($messages) && count($messages) > 0) {
    foreach ($messages as $msg) {
        $number = $msg['recipient'] ?? "N/A";
        $message = $msg['message'] ?? "N/A";
        $status = $msg['status'] ?? "N/A";
        $created = $msg['created_at'] ?? "N/A";
        
        if ($created !== "N/A" && strtotime($created)) {
            $created = date('M j, Y H:i', strtotime($created));
        }
        
        $statusClass = '';
        switch (strtolower($status)) {
            case 'delivered':
            case 'sent':
                $statusClass = 'status-delivered';
                break;
            case 'pending':
            case 'queued':
                $statusClass = 'status-pending';
                break;
            case 'failed':
            case 'error':
                $statusClass = 'status-failed';
                break;
        }

        $table .= "
            <tr>
                <td data-label='Recipient'>" . htmlspecialchars($number) . "</td>
                <td data-label='Message' class='message-cell'>" . htmlspecialchars($message) . "</td>
                <td data-label='Status' class='status-cell $statusClass'>" . htmlspecialchars($status) . "</td>
                <td data-label='Sent At'>" . htmlspecialchars($created) . "</td>
            </tr>";
    }
} else {
    $table .= "
        <tr>
            <td colspan='5' class='no-data'>
                No SMS history found.<br><br>
                <details>
                    <summary>View Raw API Response</summary>
                    <pre style='text-align:left; margin-top:10px; padding:10px; background:#f8f9fa; border-radius:4px; overflow:auto;'>" . htmlspecialchars($response) . "</pre>
                </details>
            </td>
        </tr>";
}

$table .= "
            </tbody>
        </table>
    </div>
</div>";

echo $table;
?>