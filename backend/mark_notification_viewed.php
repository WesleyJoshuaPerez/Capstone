<?php
require 'connectdb.php';

$data = json_decode(file_get_contents('php://input'), true);
$requestId = (int) $data['request_id'];
$type = $data['type'];

if (!$requestId || !$type) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
  exit;
}

$tableMap = [
  'maintenance' => 'maintenance_requests',
  'change_plan' => 'change_plan_application',
  'payment' => 'payments'
];

$idColumnMap = [
  'maintenance' => 'maintenance_id',
  'change_plan' => 'change_plan_id',
  'payment' => 'payment_id'
];

if (!isset($tableMap[$type])) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'Invalid type']);
  exit;
}

$table = $tableMap[$type];
$idColumn = $idColumnMap[$type];

$stmt = $conn->prepare("UPDATE $table SET status = 'Viewed' WHERE $idColumn = ?");
$stmt->bind_param("i", $requestId);

if ($stmt->execute()) {
  echo json_encode(['status' => 'success']);
} else {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Update failed']);
}

$stmt->close();
$conn->close();
