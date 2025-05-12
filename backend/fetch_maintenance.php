<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';

header("Content-Type: application/json");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Exclude maintenance requests with status 'Completed' or 'Denied'
$sql = "SELECT * FROM maintenance_requests WHERE status NOT IN ('Completed', 'Denied')";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
    exit;
}

$maintenance_request = [];

// Fetch and process results
while ($row = $result->fetch_assoc()) {
    $maintenance_request[] = [
        "maintenance_id" => $row["maintenance_id"], 
        "user_id" => $row["user_id"],
        "full_name" => $row["full_name"],
        "contact_number" => $row["contact_number"],
        "address" => $row["address"],
        "issue_type" => $row["issue_type"],
        "issue_description" => $row["issue_description"],
        "contact_time" => $row["contact_time"],
        "evidence_filename" => $row["evidence_filename"],
        "submitted_at" => $row["submitted_at"],
        "status" => $row["status"],
        "technician_name" => $row["technician_name"]
    ];
}

echo json_encode(["success" => true, "data" => $maintenance_request], JSON_UNESCAPED_UNICODE);

$conn->close();
?>
