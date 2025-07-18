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

// Query to get all approved users, including last_payment_date
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

    $originalPrice = $planPrices[strtolower($row['subscription_plan'])] ?? 0;

    $today = date('Y-m-d');
    $installDate = $row['installation_date'];

    // Count full months since install
    $monthsSinceInstall = floor((strtotime($today) - strtotime($installDate)) / (30 * 24 * 60 * 60));
    $nextDueDate = date('Y-m-d', strtotime("+$monthsSinceInstall month", strtotime($installDate)));

    // Get last payment date
    $lastPayment = $row['last_payment_date'] ?? null;
    $paymentStatus = $row['payment_status'];
    $currentBill = $row['currentBill'];

    // Advance next_due_date if user paid after/on the current due date
    if ($lastPayment && strtotime($lastPayment) >= strtotime($nextDueDate)) {
        $nextDueDate = date('Y-m-d', strtotime("+1 month", strtotime($nextDueDate)));
    }

    // Determine if bill is due: must not have paid for this cycle
    $isDue = strtotime($today) >= strtotime($nextDueDate);
    $needsBill = (!$lastPayment || strtotime($lastPayment) < strtotime($nextDueDate));

    // Update currentBill and payment_status if due and not already billed for this cycle
    if ($isDue && $needsBill) {
        if ($currentBill == 0 && $paymentStatus == 'unpaid') {
            $row['currentBill'] = $originalPrice;

            // Update payment_status in DB
            $updateSQL = "UPDATE approved_user SET currentBill = ?, payment_status = 'unpaid' WHERE user_id = ?";
            $stmt = $conn->prepare($updateSQL);
            $stmt->bind_param("ii", $row['currentBill'], $row['user_id']);
            $stmt->execute();
            $stmt->close();
        }

        if ($paymentStatus == 'paid') {
            $updateStatus = $conn->prepare("UPDATE approved_user SET payment_status = 'unpaid' WHERE user_id = ?");
            $updateStatus->bind_param("i", $row['user_id']);
            $updateStatus->execute();
            $updateStatus->close();

            $row['payment_status'] = 'unpaid';
        }
    }

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
        "next_due_date" => $nextDueDate
    ];
}

echo json_encode(["success" => true, "data" => $subscribers], JSON_UNESCAPED_UNICODE);
$conn->close();
?>