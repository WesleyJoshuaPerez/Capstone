<?php

require_once 'vendor/autoload.php'; // Dompdf autoloader
include('connectdb.php');
use Dompdf\Dompdf;
use Dompdf\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/phpmailer/src/Exception.php';
require_once __DIR__ . '/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/phpmailer/src/SMTP.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);
date_default_timezone_set('Asia/Manila'); 
header("Content-Type: application/json");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// mail & SMS credentials here 
$config = [
    'mail_host' => 'smtp.gmail.com',
    'mail_username' => 'noreplylynxfiberinternet@gmail.com',
    'mail_password' => 'xoel vjfs smnc ckjy',
    'mail_from' => 'noreplylynxfiberinternet@gmail.com',
    'mail_from_name' => 'LYNX Fiber Internet',
    'semaphore_api_key' => 'YOUR_SEMAPHORE_API_KEY',
    'semaphore_sender'  => 'LYNX'
];

// Make sure bills folder exists
$billsDir = __DIR__ . '/bills';
if (!file_exists($billsDir)) {
    mkdir($billsDir, 0775, true);
}

// Plan prices
$planPrices = [
    'bronze' => 1199,
    'silver' => 1499,
    'gold'   => 1799
];

//Check if new columns exist in the database
function checkColumnExists($conn, $table, $column) {
    $query = "SHOW COLUMNS FROM `$table` LIKE '$column'";
    $result = $conn->query($query);
    return $result && $result->num_rows > 0;
}

// Check for required columns
$hasReminderSent = checkColumnExists($conn, 'approved_user', 'reminder_sent');
$hasDueDate = checkColumnExists($conn, 'approved_user', 'due_date');

// Add missing columns if they don't exist
if (!$hasReminderSent) {
    $conn->query("ALTER TABLE approved_user ADD COLUMN reminder_sent TINYINT(1) DEFAULT 0");
}

if (!$hasDueDate) {
    $conn->query("ALTER TABLE approved_user ADD COLUMN due_date DATE NULL");
    $hasDueDate = true;
}

/**
 * sendBillingNotification function  
 */
function sendBillingNotification($fullName, $accountNo, $amountDue, $dueDate, $email, $contactNumber, $config, $billsDir) {
    $messageText = "LYNX Fiber Internet - Statement of Account\n\n" .
        "Dear {$fullName},\n\n" .
        "Your monthly bill is now ready for payment:\n\n" .
        "Account Details:\n" .
        "• Account No: {$accountNo}\n" .
        "• Amount Due: PHP {$amountDue}\n" .
        "• Due Date: {$dueDate}\n\n" .
        "Payment Options:\n" .
        "• Visit our office for cash payment\n" .
       "• Pay online via our website using GCash or PayPal:\n" .
         "https://lynxfiberinternet.com/\n" .
        "Important: Please settle your balance on or before the due date to avoid service interruption.\n\n" .
        "A detailed PDF bill has been attached to this email for your records.\n\n" .
        "If you've already made payment, please disregard this notice.\n\n" .
        "Thank you for choosing LYNX Fiber Internet!\n" .
        "Stay Connected, Stay Fast!";

    // PDF Generation
    try {
        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $dompdf = new Dompdf($options);
        
        $html = "
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            font-size: 14px; 
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name {
            color: #0066cc;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        .tagline {
            color: #666;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .bill-title {
            color: #0066cc;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .info-section {
            margin: 20px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .label {
            font-weight: bold;
            color: #0066cc;
            width: 40%;
        }
        .value {
            color: #333;
            width: 60%;
            text-align: right;
        }
        .amount-due {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .amount-text {
            font-size: 18px;
            font-weight: bold;
            color: #856404;
        }
        .payment-info {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .payment-title {
            font-weight: bold;
            color: #0c5460;
            margin-bottom: 10px;
        }
        .payment-methods {
            color: #0c5460;
            line-height: 1.6;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .warning {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            padding: 10px;
            margin: 20px 0;
            color: #721c24;
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class='header'>
        <h1 class='company-name'>LYNX FIBER INTERNET</h1>
        <p class='tagline'>Stay Connected, Stay Fast!</p>
    </div>
    
    <div class='bill-title'>STATEMENT OF ACCOUNT</div>
    
    <div class='info-section'>
        <div class='info-row'>
            <span class='label'>Customer Name:</span>
            <span class='value'>{$fullName}</span>
        </div>
        <div class='info-row'>
            <span class='label'>Account Number:</span>
            <span class='value'>{$accountNo}</span>
        </div>
        <div class='info-row'>
            <span class='label'>Billing Date:</span>
            <span class='value'>" . date('F d, Y') . "</span>
        </div>
        <div class='info-row'>
            <span class='label'>Service Period:</span>
            <span class='value'>" . date('F Y') . "</span>
        </div>
    </div>
    
    <div class='amount-due'>
        <div class='amount-text'>Total Amount Due: PHP {$amountDue}</div>
        <div style='margin-top: 5px; font-size: 14px;'>Due Date: {$dueDate}</div>
    </div>
    
    <div class='payment-info'>
        <div class='payment-title'>Payment Methods Available:</div>
        <div class='payment-methods'>
            • Visit our office for cash payment<br>
            • Pay online via our website using GCash or PayPal: 
            <a href='https://lynxfiberinternet.com/' target='_blank'>
            https://lynxfiberinternet.com/
            </a>
        </div>
    </div>
    
    <div class='warning'>
        Please settle your balance on or before the due date to avoid service interruption
    </div>
    
    <div class='footer'>
        <p><strong>LYNX Fiber Internet</strong></p>
        <p>For inquiries, please contact our customer service.</p>
        <p>Thank you for choosing LYNX Fiber Internet!</p>
        <p style='margin-top: 15px; font-style: italic;'>
            This is a system-generated statement. Please keep this for your records.
        </p>
    </div>
</body>
</html>";

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $safeAccount = preg_replace('/[^A-Za-z0-9_\-]/', '_', $accountNo);
        $pdfFilename = "Bill_{$safeAccount}_" . time() . ".pdf";
        $pdfPath = rtrim($billsDir, '/\\') . DIRECTORY_SEPARATOR . $pdfFilename;
        file_put_contents($pdfPath, $dompdf->output());
    } catch (Exception $e) {
        error_log("PDF generation failed for account {$accountNo}: " . $e->getMessage());
        return false;
    }

    // Email sending
    $mailSuccess = false;
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $config['mail_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['mail_username'];
        $mail->Password = $config['mail_password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom($config['mail_from'], $config['mail_from_name']);
        $mail->addAddress($email, $fullName);

        $mail->isHTML(false);
        $mail->Subject = "LYNX Fiber Internet - Your Monthly Bill Statement";
        $mail->Body = $messageText;

        $mail->addAttachment($pdfPath, "LYNX_Bill_{$accountNo}.pdf");

        $mail->send();
        $mailSuccess = true;
    } catch (Exception $e) {
        error_log("Email sending failed for {$fullName} ({$email}): " . $mail->ErrorInfo ?? $e->getMessage());
        $mailSuccess = false;
    }

    // Remove generated PDF 
    if (file_exists($pdfPath)) {
        @unlink($pdfPath);
    }

    return $mailSuccess;
}

// Main processing
$sql = "SELECT * FROM approved_user";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
    exit;
}

$subscribers = [];
$suffixes = ['JR', 'SR', 'III', 'IV'];

while ($row = $result->fetch_assoc()) {
    // Name processing
    $nameParts = preg_split('/\s+/', trim($row['fullname']));

    if (count($nameParts) > 1) {
        $lastWord = strtoupper(end($nameParts));
        if (in_array($lastWord, $suffixes)) {
            $lastName = array_pop($nameParts);
            $lastName = array_pop($nameParts) . ' ' . $lastName;
        } else {
            $lastName = array_pop($nameParts);
        }
        $firstName = implode(' ', $nameParts);
    } else {
        $firstName = $nameParts[0] ?? '';
        $lastName = '';
    }

    $originalPrice = $planPrices[strtolower($row['subscription_plan'])] ?? 0;
    $today = date('Y-m-d');
    
    // Use database due_date as the authoritative source
    $currentDueDate = $row['due_date'];
    
   // Initialize due_date only after installation date
   if (empty($currentDueDate) || $currentDueDate === '0000-00-00') {
    $installDate = new DateTime($row['installation_date']);
    $todayDate = new DateTime($today);

    // Only set the first due_date once installation is done or today >= installation_date
    if ($todayDate >= $installDate) {
        // Set due date 1 month after installation
        $installDate->add(new DateInterval('P1M'));
        $currentDueDate = $installDate->format('Y-m-d');

        // Update database
        $updateDueDateSQL = "UPDATE approved_user SET due_date = ?, currentBill = ?, payment_status = 'unpaid', reminder_sent = 0 WHERE user_id = ?";
        $stmt = $conn->prepare($updateDueDateSQL);
        $stmt->bind_param("sdi", $currentDueDate, $originalPrice, $row['user_id']);
        $stmt->execute();
        $stmt->close();

        error_log("First billing created for user_id {$row['user_id']} — due: {$currentDueDate}");
    } else {
        // Installation not yet done — skip billing setup
        error_log("Skipping billing setup for user_id {$row['user_id']} (installation date not reached)");
        continue; // Skip this user for now
    }
}

    $lastPayment = $row['last_payment_date'] ?? null;
    $paymentStatus = $row['payment_status'];
    $currentBill = $row['currentBill'];

    // Check if we've passed the current due date (bill generation trigger)
    $isPastDueDate = strtotime($today) > strtotime($currentDueDate);
    
    // Only generate new bill if we've passed the due date AND no outstanding balance
    if ($isPastDueDate && $currentBill == 0) {
        // Time to generate a new bill and move to next billing cycle   
      $currentDueDateObj = new DateTime($currentDueDate);
      $todayObj = new DateTime($today);
     
     // Calculate how many months the payment is late
     $interval = $currentDueDateObj->diff($todayObj);
     $monthsLate = ($interval->y * 12) + $interval->m;
    
     if ($monthsLate >= 2) {
        // For payments that are 2+ months late, set due date to next month from today
        $nextDueDateObj = new DateTime($today);
        $nextDueDateObj->add(new DateInterval('P1M'));
        $nextDueDate = $nextDueDateObj->format('Y-m-d');
        error_log("Late payment detected for user_id {$row['user_id']} - {$monthsLate} months late. Setting due date to: {$nextDueDate}");
     } else {
        // Normal case: advance by 1 month from current due date
        $nextDate = new DateTime($currentDueDate);
        $nextDate->add(new DateInterval('P1M'));
        $nextDueDate = $nextDate->format('Y-m-d');
    }
    
        
        // Generate new bill and update due date
        $updateSQL = "UPDATE approved_user SET 
            currentBill = ?, 
            payment_status = 'unpaid', 
            reminder_sent = 0, 
            due_date = ? 
            WHERE user_id = ?";
        $stmt = $conn->prepare($updateSQL);
        $stmt->bind_param("dsi", $originalPrice, $nextDueDate, $row['user_id']);
        
        if ($stmt->execute()) {
            // Update our local variables with the new values
            $row['currentBill'] = $originalPrice;
            $row['payment_status'] = 'unpaid';
            $row['reminder_sent'] = 0;
            $currentDueDate = $nextDueDate;
            
            error_log("New bill generated for user_id {$row['user_id']}: PHP {$originalPrice}, due: {$nextDueDate}");
        } else {
            error_log("Failed to generate new bill for user_id {$row['user_id']}: " . $stmt->error);
        }
        $stmt->close();
    }

    // Send reminder only if there's an outstanding bill and we haven't sent a reminder yet
    $hasOutstandingBill = ($row['currentBill'] > 0 && $row['payment_status'] === 'unpaid');
    $reminderNotSent = (intval($row['reminder_sent'] ?? 0) === 0);
    if ($hasOutstandingBill && $reminderNotSent) {
        // Only send SOA after installation date
        if (strtotime($today) < strtotime($row['installation_date'])) {
        error_log("Skipping SOA for user_id {$row['user_id']} — installation not yet done ({$row['installation_date']})");
    } else {
        $dueDateFormatted = date('m/d/Y', strtotime($currentDueDate));
        $amountDue = number_format($row['currentBill'], 2);
        $fullName = trim($firstName . ' ' . $lastName);
        $accountNo = $row['user_id'];
        $email = $row['email_address'];
        $contactNumber = $row['contact_number'];

        $sentOk = sendBillingNotification($fullName, $accountNo, $amountDue, $dueDateFormatted, $email, $contactNumber, $config, $billsDir);

        if ($sentOk) {
            $markStmt = $conn->prepare("UPDATE approved_user SET reminder_sent = 1 WHERE user_id = ?");
            $markStmt->bind_param("i", $row['user_id']);
            $markStmt->execute();
            $markStmt->close();
            
            error_log("Billing reminder sent for user_id {$row['user_id']}");
        } else {
            error_log("Notification sending failed for user_id {$row['user_id']}");
        }
    }
}
    // Build subscriber array
    $subscriber = [
        "id" => $row["user_id"],
        "username" => $row["username"],
        "subscription_plan" => $row["subscription_plan"],
        "currentBill" => $row["currentBill"],
        "status" => $row["account_status"],
        "first_name" => $firstName,
        "last_name" => $lastName,
        "contact_number" => $row["contact_number"],
        "address" => $row["address"],
        "birth_date" => $row["birth_date"],
        "email_address" => $row["email_address"],
        "id_type" => $row["id_type"],
        "id_number" => $row["id_number"],
        "home_ownership_type" => $row["home_ownership_type"],
        "installation_date" => $row["installation_date"],
        "registration_date" => $row["registration_date"],
        "id_photo" => $row["id_photo"],
        "proof_of_residency" => $row["proof_of_residency"],
        "next_due_date" => $currentDueDate,
        "due_date" => $currentDueDate
    ];

    $subscribers[] = $subscriber;
}

echo json_encode(["success" => true, "data" => $subscribers], JSON_UNESCAPED_UNICODE);
$conn->close();
?>