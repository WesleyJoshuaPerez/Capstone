<?php
include 'connectdb.php';

header("Content-Type: application/json");

// Check if user_id is passed in the request
if (!isset($_GET['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User ID is missing"]);
    exit;
}

$user_id = $_GET['user_id'];

// Prepare SQL query to fetch client coordinates and other details
$sql = "SELECT fullname, address_latitude, address_longitude FROM approved_user WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if client data exists
if ($result->num_rows > 0) {
    // Fetch client details
    $client = $result->fetch_assoc();
    echo json_encode([
        'status' => 'success',
        'client_name' => $client['fullname'],
        'latitude' => $client['address_latitude'],
        'longitude' => $client['address_longitude']
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Client not found']);
}

$stmt->close();
$conn->close();
