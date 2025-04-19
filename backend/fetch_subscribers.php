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
 
// Define a list of known suffixes that should be part of the last name
$suffixes = ['JR', 'SR', 'III', 'IV'];

// Fetch and process results
while ($row = $result->fetch_assoc()) {
    // Split the fullname into parts
    $nameParts = preg_split('/\s+/', trim($row['fullname']));
    
    if (count($nameParts) > 1) {
        // Check if the last word is a known suffix
        $lastWord = strtoupper(end($nameParts)); // Convert to uppercase for comparison
        if (in_array($lastWord, $suffixes)) {
            // Combine the last two words as the last name
            $lastName = array_pop($nameParts); // Remove the suffix
            $lastName = array_pop($nameParts) . ' ' . $lastName; // Combine with the second-to-last word
        } else {
            // The last word is the last name
            $lastName = array_pop($nameParts);
        }
        // Combine the remaining words as the first name
        $firstName = implode(' ', $nameParts);
    } else {
        // If there's only one part, treat it as the first name with no last name
        $firstName = $nameParts[0] ?? '';
        $lastName = '';
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
    ];
}

// Return JSON response
echo json_encode(["success" => true, "data" => $subscribers], JSON_UNESCAPED_UNICODE);

// Close database connection
$conn->close();
?>
