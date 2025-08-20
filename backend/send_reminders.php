<?php
// send_reminders.php
// Sends SMS ONCE 5 days before due date
// Shows subscriber's name and due date

date_default_timezone_set("Asia/Manila"); // Set PH timezone

// Database connection
$servername = "localhost";
$username   = "root"; 
$password   = "";
$dbname     = "lynx"; 

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("DB Connection failed: " . $conn->connect_error);
}

// Get target date (5 days ahead)
$today = date('Y-m-d');
$targetDate = date('Y-m-d', strtotime($today . " +5 days"));

// Get subscribers whose due_date is 5 days away
$sql = "SELECT user_id, fullname, contact_number, due_date 
        FROM approved_user 
        WHERE due_date = '$targetDate'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $number   = $row['contact_number'];
        $fullname = $row['fullname'];
        $due_date = date("m/d/Y", strtotime($row['due_date']));

        // Your Semaphore API Key
        $api_key = "API_KEY"; // hide in env later

        // SMS message
        $message = "Hello $fullname, this is a reminder that your billing due date is on $due_date. Please settle your balance before the said date to avoid service interruption. \n- LYNX Fiber Internet";

        // Send SMS via Semaphore
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://semaphore.co/api/v4/messages");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array(
            'apikey' => $api_key,
            'number' => $number,
            'message' => $message,
            'sendername' => 'LYNX'
        )));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($ch);
        curl_close($ch);

        echo "Sent SMS to $fullname ($number) for due date $due_date\n";
    }
} else {
    echo "ℹ️ No reminders to send today.\n";
}

$conn->close();
