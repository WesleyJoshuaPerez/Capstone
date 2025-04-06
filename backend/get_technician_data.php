<?php
session_start();
header('Content-Type: application/json');

require 'connectdb.php';

// Check if technician is logged in; assume technician id is stored in session as 'user_id'
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Technician not logged in"]);
    exit;
}

$tech_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT technician_id, name FROM lynx_technicians WHERE technician_id = ?");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $tech_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $tech = $result->fetch_assoc();

    // Store technician ID and name in session for future use
    $_SESSION['tech_id'] = $tech['technician_id'];
    $_SESSION['techName'] = $tech['name'];

    echo json_encode([
        "status" => "success",
        "technician_id" => $tech['technician_id'],
        "name" => $tech['name']
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Technician not found in the database."
    ]);
}

$stmt->close();
$conn->close();
?>
