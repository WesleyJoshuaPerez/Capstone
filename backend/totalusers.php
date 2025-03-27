<?php
require 'connectdb.php'; // Ensure this is your actual DB connection file

$response = [
    "applicants" => 0,
    "subscribers" => 0,
    "technicians" => 0.
];

// Count the total number of approved applicants
$applicantsQuery = $conn->query("SELECT COUNT(*) as total FROM approved_user");
$response["subscribers"] = $applicantsQuery->fetch_assoc()["total"];

// Count only the number of pending applicants
$subscribersQuery = $conn->query("SELECT COUNT(*) as total FROM registration_acc WHERE status = 'pending'");
$response["applicants"] = $subscribersQuery->fetch_assoc()["total"];

// Count only the number of pending change plan request
$subscribersQuery = $conn->query("SELECT COUNT(*) as total FROM change_plan_application WHERE status = 'pending'");
$response["changeplan"] = $subscribersQuery->fetch_assoc()["total"];

//Count the total number of technicians
$techniciansQuery = $conn->query("SELECT COUNT(*) as total FROM lynx_technicians");
$response["technicians"] = $techniciansQuery->fetch_assoc()["total"];

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
