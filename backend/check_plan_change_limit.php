<?php
// check the limit of changing subscription plan
require 'connectdb.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

$checkStmt = $conn->prepare("
    SELECT changed_at FROM change_plan_application
    WHERE user_id = ? 
    ORDER BY changed_at DESC 
    LIMIT 1
");
$checkStmt->bind_param("i", $user_id);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows > 0) {
    $lastChange = new DateTime($result->fetch_assoc()['changed_at']);
    $now = new DateTime();
    $interval = $lastChange->diff($now);
    $monthsPassed = ($interval->y * 12) + $interval->m;

    if ($monthsPassed < 5) {
        $nextAllowed = $lastChange->modify('+5 months')->format('F d, Y');
        echo json_encode([
            "status" => "locked",
            "next_allowed_date" => $nextAllowed
        ]);
        exit;
    }
}

echo json_encode(["status" => "allowed"]);
