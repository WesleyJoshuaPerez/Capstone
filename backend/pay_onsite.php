<?php
session_start();
require_once 'vendor/autoload.php'; // Dompdf autoloader
include('connectdb.php');

use Dompdf\Dompdf;
use Dompdf\Options;

ini_set('log_errors', 1);
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
date_default_timezone_set('Asia/Manila');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

// Read and decode JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
    exit;
}

if (!isset($data['subscriberId']) || !isset($data['currentBill'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

$subscriberId = filter_var($data['subscriberId'], FILTER_SANITIZE_STRING);
$currentBill = filter_var($data['currentBill'], FILTER_VALIDATE_FLOAT);

if ($currentBill === false || $currentBill < 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid current bill amount.']);
    exit;
}

$today = date('Y-m-d H:i:s');

// Function to generate a unique reference number
function generateUniqueReference($conn) {
    $count = 0;
    do {
        $reference = 'REF' . strtoupper(uniqid());
        $stmt = $conn->prepare("SELECT COUNT(*) FROM payments WHERE reference_number = ?");
        $stmt->bind_param("s", $reference);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
    } while ($count > 0);
    return $reference;
}

try {
    $conn->begin_transaction();

    // Get subscriber info
    $stmt = $conn->prepare("SELECT fullname, subscription_plan, currentBill FROM approved_user WHERE user_id = ?");
    $stmt->bind_param("s", $subscriberId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Subscriber not found.");
    }

    $subscriber = $result->fetch_assoc();
    $fullname = $subscriber['fullname'];
    $subscriptionPlan = $subscriber['subscription_plan'];
    $currentBillFromDB = $subscriber['currentBill'];

    if ($currentBill != $currentBillFromDB) {
        throw new Exception("Current bill does not match database.");
    }

    $referenceNumber = generateUniqueReference($conn);

    // Insert payment
    $stmt = $conn->prepare("
        INSERT INTO payments (
            user_id, 
            fullname, 
            subscription_plan, 
            mode_of_payment, 
            paid_amount, 
            payment_date, 
            reference_number, 
            proof_of_payment, 
            status
        ) VALUES (?, ?, ?, 'Onsite', ?, ?, ?, 'Onsite Payment', 'Paid')
    ");
    $stmt->bind_param("sssdss", $subscriberId, $fullname, $subscriptionPlan, $currentBill, $today, $referenceNumber);

    if (!$stmt->execute()) {
        throw new Exception("Failed to insert payment.");
    }

    // Update subscriber
    $stmt = $conn->prepare("
        UPDATE approved_user
        SET currentBill = 0,
            payment_status = 'Paid',
            last_payment_date = ?, 
            account_status = 'active'
        WHERE user_id = ?
    ");
    $stmt->bind_param("ss", $today, $subscriberId);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update subscriber.");
    }

    // Generate PDF Receipt
    $dompdf = new Dompdf();
  $html = "
  <!DOCTYPE html>
  <html lang='en'>
  <head>
  <meta charset='UTF-8'>
  <title>LYNX Fiber Internet Receipt</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #333;
    }
    header {
      display: flex;
      align-items: center;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    header img {
      height: 60px;
      margin-right: 20px;
    }
    header .company-info h1 {
      margin: 0;
      font-size: 24px;
      color: #007bff;
    }
    header .company-info p {
      margin: 2px 0 0;
      font-size: 14px;
      color: #666;
    }
    .receipt-details {
      margin-top: 20px;
    }
    .receipt-details p {
      margin: 10px 0;
    }
    .receipt-details strong {
      color: #007bff;
    }
   </style>
   </head>
  <body>
  <header>
    <div class='company-info'>
      <h1>LYNX Fiber Internet</h1>
      <p>Your Trusted ISP</p>
    </div>
  </header>

  <h2 style='text-align:center;'>Payment Receipt</h2>

  <div class='receipt-details'>
    <p><strong>Reference Number:</strong> {$referenceNumber}</p>
    <p><strong>Name:</strong> {$fullname}</p>
    <p><strong>Subscription Plan:</strong> {$subscriptionPlan}</p>
    <p><strong>Amount Paid:</strong> PHP {$currentBill}</p>
    <p><strong>Payment Method:</strong> Onsite</p>
    <p><strong>Date:</strong> {$today}</p>
  </div>
  </body>
</html>
";


    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    // Save the file
    $filename = "receipt_{$referenceNumber}.pdf";
    $receiptsDir = __DIR__ . "/../receipts"; // adjust path as needed
    if (!is_dir($receiptsDir)) {
        mkdir($receiptsDir, 0755, true);
    }
    $filePath = $receiptsDir . '/' . $filename;
    $pdfOutput = $dompdf->output();
    file_put_contents($filePath, $pdfOutput);

    $publicUrl = "receipts/" . $filename; // for frontend download

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Payment successful.',
        'reference_number' => $referenceNumber,
        'pdf_url' => $publicUrl
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
