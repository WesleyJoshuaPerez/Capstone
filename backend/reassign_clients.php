<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['clientIds'], $data['toTechnicianId'])) {
    echo json_encode(["success" => false, "error" => "Missing parameters."]);
    exit;
}

$clientIds = $data['clientIds'];
$toTechnicianId = intval($data['toTechnicianId']);

if (!is_array($clientIds) || count($clientIds) === 0) {
    echo json_encode(["success" => false, "error" => "No client IDs provided."]);
    exit;
}

// Fetch technician name
$stmt = $conn->prepare("SELECT name FROM lynx_technicians WHERE technician_id = ?");
$stmt->bind_param("i", $toTechnicianId);
$stmt->execute();
$stmt->bind_result($technicianName);

if (!$stmt->fetch()) {
    echo json_encode(["success" => false, "error" => "Technician not found."]);
    $stmt->close();
    exit;
}
$stmt->close();

error_log("🔧 Technician to assign: $technicianName (ID: $toTechnicianId)");

// Update clients
$updateStmt = $conn->prepare("UPDATE maintenance_requests SET technician_name = ?, status = 'Assigned' WHERE maintenance_id = ?");
foreach ($clientIds as $clientId) {
    $clientId = intval($clientId);
    error_log("➡️ Updating maintenance_id: $clientId");

    $updateStmt->bind_param("si", $technicianName, $clientId);
    $success = $updateStmt->execute();

    if (!$success) {
        echo json_encode(["success" => false, "error" => "Update failed for client ID $clientId: " . $updateStmt->error]);
        $updateStmt->close();
        $conn->close();
        exit;
    }
}

$updateStmt->close();
$conn->close();

echo json_encode(["success" => true, "message" => "Clients reassigned successfully."]);
?>
