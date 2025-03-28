<?php
require 'connectdb.php'; // Ensure this is your actual DB connection file

$response = [
    "applicants" => 0,
    "subscribers" => 0,
    "technicians" => 0,
    "maintenancerequest" => 0,
    "changeplan" => 0 // Add missing key
];

// Count the total number of approved applicants
$applicantsQuery = $conn->query("SELECT COUNT(*) as total FROM approved_user");
$response["subscribers"] = $applicantsQuery->fetch_assoc()["total"]; // Fixed key name

// Count only the number of pending applicants
$pendingApplicantsQuery = $conn->query("SELECT COUNT(*) as total FROM registration_acc WHERE status = 'pending'");
$response["applicants"] = $pendingApplicantsQuery->fetch_assoc()["total"]; // Corrected variable

// Count only the number of pending change plan requests
$changePlanQuery = $conn->query("SELECT COUNT(*) as total FROM change_plan_application WHERE status = 'pending'");
$response["changeplan"] = $changePlanQuery->fetch_assoc()["total"]; // Corrected variable

// Count the total number of technicians
$techniciansQuery = $conn->query("SELECT COUNT(*) as total FROM lynx_technicians");
$response["technicians"] = $techniciansQuery->fetch_assoc()["total"];

// Count the total number of maintenance requests
$maintenanceQuery = $conn->query("SELECT COUNT(*) as total FROM maintenance_requests WHERE status = 'pending' OR status = 'ongoing' OR status = 'assigned'");
$response["maintenancerequest"] = $maintenanceQuery->fetch_assoc()["total"];

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
