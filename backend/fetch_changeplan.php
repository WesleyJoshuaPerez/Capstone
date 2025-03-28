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

// Query for fetching pending change plan applications
$sql = "SELECT * FROM change_plan_application WHERE status = 'Pending'";
$result = $conn->query($sql);

// Check for query execution errors
if (!$result) {
    echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
    exit;
}

$changeplan = [];

// Fetch and process results
while ($row = $result->fetch_assoc()) {
    $changeplan[] = [
        "changeplan_id" => $row["change_plan_id"], //for change id name
        "user_id" => $row["user_id"],
        "full_name" => $row["full_name"],
        "current_plan" => $row["current_plan"],
        "new_plan" => $row["new_plan"],
        "price" => $row["price"],
        "changed_at" => $row["changed_at"],   
    ];
}

// Return JSON response
echo json_encode(["success" => true, "data" => $changeplan], JSON_UNESCAPED_UNICODE);

// Close database connection
$conn->close();
?>