<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';
header("Content-Type: application/json");

// Check database connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Fetch technicians
$sql = "SELECT * FROM lynx_technicians";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
    exit;
}

$technicians = [];

while ($row = $result->fetch_assoc()) {
    $technicians[] = [
        "id" => $row["technician_id"],
        "name" => $row["name"],
        "role" => $row["role"],
        "contact" => $row["contact"],
        "status" => $row["status"],
        "profile_image" => $row["profile_image"]
    ];
}

// Return JSON response
echo json_encode(["success" => true, "data" => $technicians], JSON_UNESCAPED_UNICODE);
$conn->close();
?>
