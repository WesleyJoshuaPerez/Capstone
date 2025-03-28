<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connectdb.php';

// Cast to int to avoid bind_param type mismatches
$userId          = isset($_POST['userId_request']) ? (int) $_POST['userId_request'] : 0;
$fullName        = $_POST['fullName_request']      ?? '';
$contactNumber   = $_POST['contactNumber']         ?? '';
$homeAddress     = $_POST['homeAddress']           ?? '';
$issueType       = $_POST['issueType']             ?? '';
$issueDescription= $_POST['issueDescription']      ?? '';
$contactTime     = $_POST['contactTime']           ?? '';

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
        // If the user didn’t pick anything valid, you can handle it here
        // For now, just leave it as-is or set an error message
        break;
}

// Handle optional file upload
$evidence = '';
if (!empty($_FILES['uploadEvidence']['name']) && $_FILES['uploadEvidence']['error'] === UPLOAD_ERR_OK) {
    $targetDir  = "../uploads/issue_evidence/";
    $fileName   = basename($_FILES["uploadEvidence"]["name"]);
    $evidence   = time() . "_" . $fileName;
    $targetFile = $targetDir . $evidence;

    // Make sure the directory exists and is writable
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true); // Attempt to create if missing
    }

    if (!move_uploaded_file($_FILES["uploadEvidence"]["tmp_name"], $targetFile)) {
        echo json_encode(["status" => "error", "message" => "Failed to upload evidence."]);
        exit;
    }
}

// Check how many requests the user has already submitted
$checkStmt = $conn->prepare("SELECT COUNT(*) as count FROM maintenance_requests WHERE user_id = ?");
$checkStmt->bind_param("i", $userId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$row = $checkResult->fetch_assoc();

if ($row['count'] >= 3) {
    echo json_encode([
        "status" => "exists",
        "message" => "You have reached the limit of 3 maintenance requests. Please wait for admin approval or resolution of your previous requests."
    ]);
    exit;
}

// Insert new request
$stmt = $conn->prepare("
    INSERT INTO maintenance_requests
    (user_id, full_name, contact_number, address, issue_type, issue_description, contact_time, evidence_filename, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
");

$stmt->bind_param(
    "isssssss",
    $userId,
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
