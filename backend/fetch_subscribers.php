<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';

// Set response header
header("Content-Type: application/json");

// Validate database connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Query for fetching approved users
$sql = "SELECT *  FROM approved_user";
$result = $conn->query($sql);

// Check for query execution errors
if (!$result) {
    echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
    exit;
}

$subscribers = [];

// Fetch and process results
while ($row = $result->fetch_assoc()) {
    // Handle fullname splitting properly
    $nameParts = explode(' ', trim($row['fullname']), 2);
    $firstName = $nameParts[0] ?? '';
    $lastName = $nameParts[1] ?? '';

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
    ];
}

// Return JSON response
echo json_encode(["success" => true, "data" => $subscribers], JSON_UNESCAPED_UNICODE);

// Close database connection
$conn->close();
?>
