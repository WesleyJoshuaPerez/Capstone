<?php
session_start();
require 'connectdb.php';

$response = [
    "applicants" => 0,
    "subscribers" => 0,
    "technicians" => 0,
    "maintenancerequest" => 0,
    "changeplan" => 0,
    "assignedtasks" => 0,
    "totalBoxslots" =>0
];

// Count the total number of approved applicants
$applicantsQuery = $conn->query("SELECT COUNT(*) as total FROM approved_user");
$response["subscribers"] = $applicantsQuery->fetch_assoc()["total"];

// Count only the number of pending applicants
$pendingApplicantsQuery = $conn->query("SELECT COUNT(*) as total FROM registration_acc WHERE status = 'pending'");
$response["applicants"] = $pendingApplicantsQuery->fetch_assoc()["total"];

// Count only the number of pending change plan requests
$changePlanQuery = $conn->query("SELECT COUNT(*) as total FROM change_plan_application WHERE status = 'pending'");
$response["changeplan"] = $changePlanQuery->fetch_assoc()["total"];

// Count the total number of technicians
$techniciansQuery = $conn->query("SELECT COUNT(*) as total FROM lynx_technicians");
$response["technicians"] = $techniciansQuery->fetch_assoc()["total"];

// Count the total number of maintenance requests (pending, ongoing, or assigned)
$maintenanceQuery = $conn->query("SELECT COUNT(*) as total FROM maintenance_requests WHERE status IN ('pending', 'ongoing', 'assigned')");
$response["maintenancerequest"] = $maintenanceQuery->fetch_assoc()["total"];

// Additionally count assigned tasks for the logged-in technician
if (isset($_SESSION['techName'])) {
    $techName = trim($_SESSION['techName']);
    $techName = $conn->real_escape_string($techName);
    $assignedTasksQuery = $conn->prepare("
        SELECT COUNT(*) as total 
        FROM maintenance_requests 
        WHERE TRIM(technician_name) = ? AND status = 'assigned'
    ");
    $assignedTasksQuery->bind_param("s", $techName);
    $assignedTasksQuery->execute();
    $result = $assignedTasksQuery->get_result()->fetch_assoc();
    $response["assignedtasks"] = $result["total"];
} else {
    $response["assignedtasks"] = 0;
}
 
$napBoxQuery = $conn->query("SELECT COUNT(*) as total FROM nap_box_availability");
$response["totalBoxslots"] = $napBoxQuery->fetch_assoc()["total"] ?? 0;

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
