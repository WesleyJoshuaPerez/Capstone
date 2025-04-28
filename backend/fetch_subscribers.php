<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';

header("Content-Type: application/json");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$planPrices = [
    'bronze' => 1199,
    'silver' => 1499,
    'gold'   => 1799
];

// Query to get all approved users
$sql = "SELECT * FROM approved_user";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
    exit;
}

$subscribers = [];
$suffixes = ['JR', 'SR', 'III', 'IV'];

while ($row = $result->fetch_assoc()) {
    $nameParts = preg_split('/\s+/', trim($row['fullname']));

    // Extract first and last name
    if (count($nameParts) > 1) {
        $lastWord = strtoupper(end($nameParts));
        if (in_array($lastWord, $suffixes)) {
            $lastName = array_pop($nameParts);
            $lastName = array_pop($nameParts) . ' ' . $lastName;
        } else {
            $lastName = array_pop($nameParts);
        }
        $firstName = implode(' ', $nameParts);
    } else {
        $firstName = $nameParts[0] ?? '';
        $lastName = '';
    }

    $originalPrice = $planPrices[$row['subscription_plan']] ?? 0;

    // Installation date
    $installDate = $row['installation_date'];
    $currentDate = new DateTime(); // Current date for comparison

    // Calculate the original due date: 1 month after installation
    $installDateTime = new DateTime($installDate);
    $installDateTime->modify('+1 month');
    $nextDueDate = $installDateTime;

    // Roll over due date until it is in the future
    while ($nextDueDate < $currentDate) {
        $nextDueDate->modify('+1 month');
    }

    // Format the due date for display
    $formattedNextDueDate = $nextDueDate->format('Y-m-d');

    $subscribers[] = [
        "id" => $row["user_id"],
        "username" => $row["username"],
        "subscription_plan" => $row["subscription_plan"],
        "currentBill" => $row["currentBill"],
        "first_name" => $firstName,
        "last_name" => $lastName,
        "contact_number" => $row["contact_number"],
        "address" => $row["address"],
        "birth_date" => $row["birth_date"],
        "email_address" => $row["email_address"],
        "id_type" => $row["id_type"],
        "id_number" => $row["id_number"],
        "home_ownership_type" => $row["home_ownership_type"],
        "installation_date" => $row["installation_date"],
        "registration_date" => $row["registration_date"],
        "id_photo" => $row["id_photo"],
        "proof_of_residency" => $row["proof_of_residency"],
        "next_due_date" => $formattedNextDueDate // Adjusted dynamically
    ];
}

echo json_encode(["success" => true, "data" => $subscribers], JSON_UNESCAPED_UNICODE);

$conn->close();
?>