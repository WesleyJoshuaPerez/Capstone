<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connectdb.php';

// Start the session
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

// Fetch the user_id from the session
$userId = $_SESSION['user_id'];  // No need to use $_POST for userId anymore, it's from the session

// Format the userId to be 10 digits long with leading zeros
$userId = str_pad($userId, 10, '0', STR_PAD_LEFT);

// Fetch other form data
$fullName         = trim($_POST['fullName_request'] ?? '');
$contactNumber    = trim($_POST['contactNumber'] ?? '');
$homeAddress      = trim($_POST['homeAddress'] ?? '');
$issueType        = trim($_POST['issueType'] ?? '');
$issueDescription = trim($_POST['issueDescription'] ?? '');
$contactTime      = trim($_POST['contactTime'] ?? '');

// Convert short contactTime to full label before insertion
switch ($contactTime) {
    case 'morning':
        $contactTime = 'Morning (8AM - 12PM)';
        break;
    case 'afternoon':
        $contactTime = 'Afternoon (12PM - 4PM)';
        break;
    case 'evening':
        $contactTime = 'Evening (4PM - 8PM)';
        break;
    default:
        break;
}

// Handle optional file upload
$evidence = '';
if (!empty($_FILES['uploadEvidence']['name']) && $_FILES['uploadEvidence']['error'] === UPLOAD_ERR_OK) {
    $targetDir = "../frontend/assets/images/uploads/issue_evidence/";  
    $fileName   = basename($_FILES["uploadEvidence"]["name"]);
    $evidence   = $fileName; 
    $targetFile = $targetDir . $evidence;

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    if (!move_uploaded_file($_FILES["uploadEvidence"]["tmp_name"], $targetFile)) {
        echo json_encode(["status" => "error", "message" => "Failed to upload evidence."]);
        exit;
    }
}

$dupCheckStmt = $conn->prepare("SELECT COUNT(*) as count 
    FROM maintenance_requests 
    WHERE user_id = ? AND issue_type = ? AND status NOT IN ('Completed', 'Denied', 'Viewed')");

if (!$dupCheckStmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}
$dupCheckStmt->bind_param("is", $userId, $issueType); // Use userId here
$dupCheckStmt->execute();
$dupResult = $dupCheckStmt->get_result();
$dupRow = $dupResult->fetch_assoc();
$dupCheckStmt->close();

if ((int)$dupRow['count'] > 0) {
    echo json_encode([ 
        "status" => "exists", 
        "message" => "You already have an active maintenance request for this issue type. Please wait until it is complete before submitting another request."
    ]);
    exit;
}

// --- Overall Request Limit Check (exclude Denied and Completed) ---
$checkStmt = $conn->prepare("SELECT COUNT(*) as count FROM maintenance_requests WHERE user_id = ? AND status NOT IN ('Denied', 'Completed', 'Viewed')");
$checkStmt->bind_param("i", $userId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$row = $checkResult->fetch_assoc();
$checkStmt->close();

if ((int)$row['count'] >= 3) {
    echo json_encode([ 
        "status" => "exists", 
        "message" => "You have reached the limit of 3 active maintenance requests. Please wait for admin approval or resolution of your previous requests."
    ]);
    exit;
}

// Insert new maintenance request (existing functionality preserved)
$stmt = $conn->prepare("
    INSERT INTO maintenance_requests
    (user_id, full_name, contact_number, address, issue_type, issue_description, contact_time, evidence_filename, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
");

$stmt->bind_param(
    "ssssssss",
    $userId,  // Use the user ID from the session (with leading zeros)
    $fullName,
    $contactNumber,
    $homeAddress,
    $issueType,
    $issueDescription,
    $contactTime,
    $evidence
);

if (!$stmt->execute()) {
    error_log("Maintenance Insert Error: " . $stmt->error);
    echo json_encode(["status" => "error", "message" => "Failed to submit request."]);
} else {
    echo json_encode(["status" => "success", "message" => "Maintenance request submitted successfully."]);
}

$stmt->close();
$conn->close();
?>
