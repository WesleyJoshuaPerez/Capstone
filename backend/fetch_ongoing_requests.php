<?php
include 'connectdb.php';

// Set response header
header("Content-Type: application/json");

// Validate database connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Query for fetching ongoing maintenance requests
$sql = "SELECT * FROM maintenance_requests WHERE status = 'ongoing'";
$result = $conn->query($sql);

// Check for query execution errors
if (!$result) {
    echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
    exit;
}

$requests = [];

// Fetch and process results
while ($row = $result->fetch_assoc()) {
    $requests[] = [
        "id" => $row["maintenance_id"],
        "full_name" => $row["full_name"],
        "issue_type" => $row["issue_type"],
        "issue_description" => $row["issue_description"],
        "contact_number" => $row["contact_number"],
        "address" => $row["address"],
        "contact_time" => $row["contact_time"],
    ];
}

// Return JSON response
echo json_encode(["success" => true, "data" => $requests], JSON_UNESCAPED_UNICODE);

// Close database connection
$conn->close();
?>