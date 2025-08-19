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

// ISP billing - DO NOT advance due date on payment
function processISPPayment($conn, $subscriberId) {
    // Simply clear the bill and mark as paid NOT change due date
    $today = date('Y-m-d H:i:s');
    
    $stmt = $conn->prepare("
        UPDATE approved_user
        SET currentBill = 0,
            payment_status = 'Paid',
            last_payment_date = ?, 
            account_status = 'active',
            reminder_sent = 0
        WHERE user_id = ?
    ");
    $stmt->bind_param("ss", $today, $subscriberId);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update subscriber.");
    }
    
    // Return the current due date 
    $stmt = $conn->prepare("SELECT due_date FROM approved_user WHERE user_id = ?");
    $stmt->bind_param("s", $subscriberId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    return $row['due_date'];
}

try {
    $conn->begin_transaction();

    // Get current due_date from database
    $stmt = $conn->prepare("SELECT fullname, subscription_plan, currentBill, installation_date, due_date FROM approved_user WHERE user_id = ?");
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
    $installationDate = $subscriber['installation_date'];
    $currentDueDate = $subscriber['due_date'];

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

    // Process ISP payment correctly 
    $nextDueDate = processISPPayment($conn, $subscriberId);

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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 15px;
            color: #333;
            background-color: #fff;
            line-height: 1.2;
            font-size: 14px;
        }
        
        .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            border: 2px solid #007bff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 15px;
            text-align: center;
            position: relative;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 15px;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
        }
        
        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 3px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .tagline {
            font-size: 14px;
            margin: 0;
            opacity: 0.9;
            font-style: italic;
        }
        
        .receipt-badge {
            background: #28a745;
            color: white;
            padding: 6px 15px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 12px;
            margin-top: 8px;
            display: inline-block;
        }
        
        .content {
            padding: 20px;
            background: #fff;
            position: relative;
        }
        
        .receipt-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .reference-section {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 0 5px 5px 0;
        }
        
        .reference-number {
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
            font-family: 'Courier New', monospace;
        }
        
        .details-grid {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }
        
        .detail-row {
            display: table-row;
        }
        
        .detail-label {
            display: table-cell;
            padding: 8px 0;
            font-weight: 600;
            color: #495057;
            width: 40%;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        
        .detail-value {
            display: table-cell;
            padding: 8px 0 8px 15px;
            color: #212529;
            font-weight: 500;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        
        .amount-highlight {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            margin: 15px 0;
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
        }
        
        .amount-text {
            font-size: 22px;
            font-weight: bold;
            margin: 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        
        .amount-label {
            font-size: 12px;
            opacity: 0.9;
            margin-top: 3px;
        }
        
        .status-badge {
            background: #28a745;
            color: white;
            padding: 6px 12px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 12px;
            display: inline-block;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 15px;
            text-align: center;
            border-top: 1px solid #dee2e6;
            margin-top: 15px;
        }
        
        .footer p {
            margin: 3px 0;
            color: #6c757d;
            font-size: 13px;
        }
        
        .thank-you {
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 8px;
        }
        
        .contact-info {
            font-size: 11px;
            color: #6c757d;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #dee2e6;
        }
        
        .verification-section {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 12px;
            border-radius: 6px;
            max-width: 280px;
            margin: 15px auto;
            text-align: center;
        }
        
        .verification-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        
        .verification-subtitle {
            font-size: 11px;
            opacity: 0.9;
        }
        
        .verification-id {
            font-size: 10px;
            margin-top: 5px;
            font-family: Courier New, monospace;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 60px;
            color: rgba(0, 123, 255, 0.03);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
        }

        @media print {
            body { margin: 0; padding: 10px; }
            .receipt-container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class='receipt-container'>
        <div class='header'>
            <h1 class='company-name'>LYNX FIBER INTERNET</h1>
            <p class='tagline'>Stay Connected, Stay Fast!</p>
            <div class='receipt-badge'>PAYMENT CONFIRMED</div>
        </div>
        
        <div class='content'>
            <div class='watermark'>PAID</div>
            
            <h2 class='receipt-title'>Official Receipt</h2>
            
            <div class='reference-section'>
                <div style='font-size: 12px; color: #6c757d; margin-bottom: 3px;'>Reference Number</div>
                <div class='reference-number'>{$referenceNumber}</div>
            </div>
            
            <div class='details-grid'>
                <div class='detail-row'>
                    <div class='detail-label'>Customer Name:</div>
                    <div class='detail-value'>{$fullname}</div>
                </div>
                <div class='detail-row'>
                    <div class='detail-label'>Account ID:</div>
                    <div class='detail-value'>{$subscriberId}</div>
                </div>
                <div class='detail-row'>
                    <div class='detail-label'>Subscription Plan:</div>
                    <div class='detail-value'>{$subscriptionPlan}</div>
                </div>
                <div class='detail-row'>
                    <div class='detail-label'>Payment Method:</div>
                    <div class='detail-value'>Cash Payment (Onsite)</div>
                </div>
                <div class='detail-row'>
                    <div class='detail-label'>Transaction Date:</div>
                    <div class='detail-value'>" . date('F j, Y - g:i A', strtotime($today)) . "</div>
                </div>
                <div class='detail-row'>
                    <div class='detail-label'>Payment Status:</div>
                    <div class='detail-value'><span class='status-badge'>PAID</span></div>
                </div>
                <div class='detail-row'>
                    <div class='detail-label'>Service Period Covered:</div>
                    <div class='detail-value'>Until " . date('F j, Y', strtotime($nextDueDate)) . "</div>
                </div>
            </div>
            
            <div class='amount-highlight'>
                <div class='amount-text'>PHP " . number_format($currentBill, 2) . "</div>
                <div class='amount-label'>Total Amount Paid</div>
            </div>
            
            <div class='verification-section'>
                <div class='verification-title'>✓ PAYMENT VERIFIED</div>
                <div class='verification-subtitle'>Transaction processed successfully</div>
                <div class='verification-id'>ID: {$referenceNumber}</div>
            </div>
        </div>
        
        <div class='footer'>
            <p class='thank-you'>Thank you for your payment!</p>
            <p>Your internet service will continue without interruption.</p>
            <p style='font-weight: 600; color: #007bff;'>
                Service valid until: " . date('F j, Y', strtotime($nextDueDate)) . "
            </p>
            
            <div class='contact-info'>
                <p><strong>LYNX Fiber Internet</strong></p>
                <p>For inquiries and support, please contact our customer service.</p>
                <p>Website: https://lynxfiberinternet.com/</p>
                <p style='margin-top: 8px; font-style: italic;'>
                    This is an official computer-generated receipt. Please keep this for your records.
                </p>
            </div>
        </div>
    </div>
</body>
</html>";

    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    // Save the file
    $filename = "receipt_{$referenceNumber}.pdf";
    $receiptsDir = __DIR__ . "/../receipts"; // location of the receipts in the system
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
        'pdf_url' => $publicUrl,
        'next_due_date' => $nextDueDate,
        'current_bill_period' => date('F j, Y', strtotime($nextDueDate)) // Shows service valid until
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>