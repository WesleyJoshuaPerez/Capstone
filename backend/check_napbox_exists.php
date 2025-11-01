<?php
require 'connectdb.php'; // Database connection

$data = json_decode(file_get_contents("php://input"), true);
$barangay = strtoupper(trim($data['barangay'])); // Normalize for case-insensitive check

$stmt = $conn->prepare("SELECT COUNT(*) FROM nap_box_availability WHERE UPPER(nap_box_brgy) = ?");
$stmt->bind_param("s", $barangay);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

echo json_encode(['exists' => $count > 0]);
