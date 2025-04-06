<?php
include 'connectdb.php'; // Ensure database connection

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['technician_id']) || !isset($data['status'])) {
    echo json_encode(["success" => false, "error" => "Missing parameters"]);
    exit;
}

$technicianId = intval($data['technician_id']);
$status = $data['status'];

$stmt = $conn->prepare("UPDATE lynx_technicians SET status = ? WHERE technician_id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "error" => $conn->error]);
    exit;
}
$stmt->bind_param("si", $status, $technicianId);
if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}
?>
