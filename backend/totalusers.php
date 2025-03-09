<?php
require 'connectdb.php'; // Ensure this is your actual DB connection file

$response = [
    "applicants" => 0,
    "subscribers" => 0
];

// Count the total number of approved applicants
$applicantsQuery = $conn->query("SELECT COUNT(*) as total FROM approved_user");
$response["applicants"] = $applicantsQuery->fetch_assoc()["total"];

// Count the total number of subscribers
$subscribersQuery = $conn->query("SELECT COUNT(*) as total FROM registration_acc");
$response["subscribers"] = $subscribersQuery->fetch_assoc()["total"];

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
