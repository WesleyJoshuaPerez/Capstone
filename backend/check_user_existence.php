<?php
header('Content-Type: application/json');
require 'connectdb.php'; 

$input = json_decode(file_get_contents("php://input"), true);

$contact_number = $input['contact_number'] ?? '';
$email_address  = $input['email_address'] ?? '';

if (!$contact_number && !$email_address) {
    echo json_encode(["status" => "error", "message" => "No data provided"]);
    exit;
}

// Check approved_user table (approved applicants)
$stmt1 = $conn->prepare("SELECT * FROM approved_user WHERE contact_number = ? OR email_address = ? LIMIT 1");
$stmt1->bind_param("ss", $contact_number, $email_address);
$stmt1->execute();
$result1 = $stmt1->get_result();

// Check registration_acc table (pending or denied applications)
$stmt2 = $conn->prepare("SELECT * FROM registration_acc WHERE contact_number = ? OR email_address = ? LIMIT 1");
$stmt2->bind_param("ss", $contact_number, $email_address);
$stmt2->execute();
$result2 = $stmt2->get_result();

// If the user exists in the approved_user table, prevent them from applying again
if ($result1->num_rows > 0) {
    echo json_encode(["status" => "exists", "message" => "User is already approved"]);
} elseif ($result2->num_rows > 0) {
    // If the user exists in the registration_acc table, check the status
    $row = $result2->fetch_assoc();
    if ($row['status'] === 'approved') {
        // User is already approved, cannot reapply
        echo json_encode(["status" => "exists", "message" => "User is already approved"]);
    } elseif ($row['status'] === 'pending') {
        // User has a pending application, cannot reapply
        echo json_encode(["status" => "exists", "message" => "Application is still pending"]);
    } else {
        // If the status is "denied", allow the user to reapply
        echo json_encode(["status" => "can_reapply"]);
    }
} else {
    echo json_encode(["status" => "not_found"]);
}

$stmt1->close();
$stmt2->close();
$conn->close();
?>
