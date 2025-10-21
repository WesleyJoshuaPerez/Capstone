<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/vendor/autoload.php'; // for .env
include 'connectdb.php';
header("Content-Type: application/json");

// Load .env safely
try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
} catch (Throwable $e) {
    echo json_encode(["success" => false, "error" => "Failed to load .env: " . $e->getMessage()]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['technicianName'], $data['requestId'])) {
    $technicianName = $data['technicianName'];
    $requestId = intval($data['requestId']);

    // Step 1: Validate maintenance request
    $checkQuery = "SELECT * FROM maintenance_requests WHERE maintenance_id = ?";
    $stmtCheck = $conn->prepare($checkQuery);
    $stmtCheck->bind_param("i", $requestId);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();
    $stmtCheck->close();

    if ($resultCheck->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Invalid request ID."]);
        exit;
    }

    // Step 2: Update technician assignment
    $updateQuery = "UPDATE maintenance_requests SET technician_name = ?, status = 'Assigned' WHERE maintenance_id = ?";
    $stmtUpdate = $conn->prepare($updateQuery);
    if ($stmtUpdate === false) {
        echo json_encode(["success" => false, "error" => "Failed to prepare update: " . $conn->error]);
        exit;
    }

    $stmtUpdate->bind_param("si", $technicianName, $requestId);
    if (!$stmtUpdate->execute()) {
        echo json_encode(["success" => false, "error" => "Failed to execute update: " . $stmtUpdate->error]);
        exit;
    }
    $stmtUpdate->close();

    // Step 3: Fetch client info for SMS
    $clientQuery = "SELECT full_name, contact_number, issue_type FROM maintenance_requests WHERE maintenance_id = ?";
    $stmtClient = $conn->prepare($clientQuery);
    $stmtClient->bind_param("i", $requestId);
    $stmtClient->execute();
    $clientResult = $stmtClient->get_result();
    $stmtClient->close();

    $clientData = $clientResult->fetch_assoc();
    $issueType = $clientData['issue_type'];
    $clientName = $clientData['full_name'];
    $clientNumberRaw = $clientData['contact_number'];

    $maintenanceId = $requestId;

    // Clean client number
    $clientNumberDigits = preg_replace('/\D/', '', $clientNumberRaw);
    $clientNumber = (substr($clientNumberDigits, 0, 1) === '0') ? '63' . substr($clientNumberDigits, 1) : $clientNumberDigits;

    // Step 4: Fetch technician contact
    $techQuery = "SELECT contact FROM lynx_technicians WHERE name = ? LIMIT 1";
    $stmtTech = $conn->prepare($techQuery);
    $stmtTech->bind_param("s", $technicianName);
    $stmtTech->execute();
    $techResult = $stmtTech->get_result();
    $stmtTech->close();

    $techContact = "N/A";
    if ($techResult && $techResult->num_rows > 0) {
        $techData = $techResult->fetch_assoc();
        $techContact = $techData['contact'];
    }

    // Step 5: Compose SMS
    $api_key = $_ENV['SEMAPHORE_API_TOKEN'];
    $message = "Hello $clientName, your maintenance request ID: $requestId regarding $issueType has been approved.\n\n" .
           "Assigned Technician:\n" .
           "Name: $technicianName\n" .
           "Contact: $techContact\n\n" .
           "Please standby for a call from the assigned technician to arrange the site visit. Thank you for your cooperation.";


    // Step 6: Send SMS via Semaphore
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://semaphore.co/api/v4/messages");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'apikey' => $api_key,
        'number' => $clientNumber,
        'message' => $message,
        'sendername' => 'LYNX'
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $output = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200) {
        echo json_encode([
            "success" => true,
            "message" => "Technician assigned and SMS sent successfully.",
            "smsResponse" => $output
        ]);
    } else {
        echo json_encode([
            "success" => true, // still successful assign
            "warning" => "Technician assigned, but failed to send SMS.",
            "smsResponse" => $output
        ]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request parameters."]);
}

$conn->close();
?>
