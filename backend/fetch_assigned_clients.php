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

// Retrieve technician name
$stmt = $conn->prepare("SELECT name FROM lynx_technicians WHERE technician_id = ?");
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
    // Count total assigned requests
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS total_clients 
        FROM maintenance_requests 
        WHERE technician_name = ? 
          AND status NOT IN ('Completed', 'Viewed')
    ");
    $stmt->bind_param("s", $technician_name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    echo json_encode(['success' => true, 'total_clients' => $row['total_clients']]);
    exit;
}

// Fetch maintenance requests + latest progress report (if any)
$query = "
    SELECT 
        mr.maintenance_id,
        mr.full_name,
        mr.issue_type,
        mr.status,
        pr.progress_update,
        pr.work_done,
        pr.time_spent_in_hour,
        pr.submitted_by,
        pr.submitted_at
    FROM maintenance_requests mr
    LEFT JOIN progress_reports pr 
        ON mr.full_name = pr.client_name 
        AND mr.issue_type = pr.issue_type
        AND pr.submitted_at = (
            SELECT MAX(pr2.submitted_at)
            FROM progress_reports pr2
            WHERE pr2.client_name = mr.full_name 
              AND pr2.issue_type = mr.issue_type
        )
    WHERE mr.technician_name = ?
      AND mr.status NOT IN ('Completed', 'Viewed')
    ORDER BY mr.maintenance_id DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $technician_name);
$stmt->execute();
$result = $stmt->get_result();

$clients = [];
while ($row = $result->fetch_assoc()) {
    $clients[] = $row;
}

echo json_encode(['success' => true, 'clients' => $clients]);
?>
