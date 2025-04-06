<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php'; 

header('Content-Type: application/json');

if (!isset($_GET['technician_id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing technician_id']);
    exit;
}

$technician_id = intval($_GET['technician_id']);
$countOnly = isset($_GET['count']) && $_GET['count'] === 'true';

// Retrieve technician name from lynx_technicians table
$stmt = $conn->prepare("SELECT name FROM lynx_technicians WHERE technician_id = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("i", $technician_id);
$stmt->execute();
$result = $stmt->get_result();
$technician = $result->fetch_assoc();

if (!$technician) {
    echo json_encode(['success' => false, 'error' => 'Technician not found']);
    exit;
}

$technician_name = $technician['name'];

if ($countOnly) {
    // Count total maintenance requests for this technician
    $stmt = $conn->prepare("SELECT COUNT(*) AS total_clients FROM maintenance_requests WHERE technician_name = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'Failed to prepare count statement: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("s", $technician_name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    echo json_encode(['success' => true, 'total_clients' => $row['total_clients']]);
    exit;
}

// Fetch detailed list of maintenance requests for this technician
$stmt = $conn->prepare("SELECT maintenance_id, full_name, issue_type, status FROM maintenance_requests WHERE technician_name = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare detail statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("s", $technician_name);
$stmt->execute();
$result = $stmt->get_result();

$clients = [];
while ($row = $result->fetch_assoc()) {
    $clients[] = $row;
}

echo json_encode(['success' => true, 'clients' => $clients]);
?>
