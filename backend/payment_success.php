<?php
session_start();
include('connectdb.php');
date_default_timezone_set('Asia/Manila');
//This use for paypal payment

// 1) Grab the Order ID PayPal sent back
$orderId = $_GET['token'] ?? null;
if (!$orderId) {
    die('Payment token missing.');
}

// ISP billing - DO NOT advance due date on payment
// Payment only clears current bill, due date stays the same until after due date passes
function processISPPayment($conn, $user_id) {
    // Simply clear the bill and mark as paid - DO NOT change due date
    $today = date('Y-m-d H:i:s');
    
    $stmt = mysqli_prepare($conn, "
        UPDATE approved_user
        SET currentBill = 0,
            payment_status = 'paid',
            last_payment_date = ?,
            account_status = 'active',
            reminder_sent = 0
        WHERE user_id = ?
    ");
    mysqli_stmt_bind_param($stmt, "ss", $today, $user_id);
    
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Failed to update user account");
    }
    mysqli_stmt_close($stmt);
    
    // Return the current due date  
    $stmt = mysqli_prepare($conn, "SELECT due_date FROM approved_user WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, "s", $user_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $current_due_date);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);
    
    return $current_due_date;
}

// 2) Get a fresh access-token (same as in handle_payment.php)
$clientId = 'AXTLiTg8G_QhoP_G98HIpnZUOY0UdF_yB48lEv3nGbs19D9-BQ-boEEIruysg3F0ciDFNtKHj17fya2M';
$clientSecret = 'EFfTuq_rU-m4PsOK_UN5efFt7RJRhEd5YwcrKNp2YTtuzUHEJAHdF1HAqGvipkZ4KXycDFgAlqh02dr4';

$ch = curl_init("https://api-m.sandbox.paypal.com/v1/oauth2/token");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_USERPWD        => "$clientId:$clientSecret",
  CURLOPT_POST           => true,
  CURLOPT_POSTFIELDS     => "grant_type=client_credentials",
  CURLOPT_HTTPHEADER     => [
    "Accept: application/json",
    "Accept-Language: en_US"
  ]
]);
$authResp = curl_exec($ch);
curl_close($ch);
$authData    = json_decode($authResp, true);
$accessToken = $authData['access_token'] ?? die('Auth failed');

// 3) Capture the order
$ch = curl_init("https://api-m.sandbox.paypal.com/v2/checkout/orders/$orderId/capture");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST           => true,
  CURLOPT_HTTPHEADER     => [
    "Content-Type: application/json",
    "Authorization: Bearer $accessToken"
  ]
]);
$captureResp = curl_exec($ch);
curl_close($ch);
$captureData = json_decode($captureResp, true);

// 4) Check if it actually completed
if (isset($captureData['status']) && $captureData['status'] === 'COMPLETED') {
    try {
        // Start transaction for data integrity
        mysqli_begin_transaction($conn);

        // 5) Fetch user details
        $user_id = $_SESSION['user_id'] ?? null;
        if (!$user_id) {
            throw new Exception("Unauthorized - User not logged in");
        }

        $stmt = mysqli_prepare($conn, "SELECT fullname, subscription_plan, currentBill, installation_date, due_date FROM approved_user WHERE user_id = ?");
        mysqli_stmt_bind_param($stmt, "s", $user_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $fullname, $subscription_plan, $currentBill, $installation_date, $current_due_date);
        
        if (!mysqli_stmt_fetch($stmt)) {
            mysqli_stmt_close($stmt);
            throw new Exception("User not found");
        }
        mysqli_stmt_close($stmt);

        // 6) Insert payment details into the payments table
        $today = date('Y-m-d H:i:s');
        $paid_amount = $captureData['purchase_units'][0]['payments']['captures'][0]['amount']['value'] ?? '0.00';
        $reference_number = $captureData['id'] ?? 'N/A';

        // Extract only necessary proof_of_payment details
        $proof_of_payment = json_encode([
            'id' => $captureData['id'] ?? null,
            'status' => $captureData['status'] ?? null,
            'amount' => $paid_amount,
            'payer_id' => $captureData['payer']['payer_id'] ?? null,
            'capture_id' => $captureData['purchase_units'][0]['payments']['captures'][0]['id'] ?? null
        ]);

        $stmt = mysqli_prepare($conn, "
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
          ) VALUES (?, ?, ?, 'PayPal', ?, ?, ?, ?, 'Paid')
        ");
        mysqli_stmt_bind_param($stmt, "sssssss", $user_id, $fullname, $subscription_plan, $paid_amount, $today, $reference_number, $proof_of_payment);
        
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Failed to insert payment record");
        }
        mysqli_stmt_close($stmt);

        // 7) Process ISP payment correctly (don't advance due date)
        $nextDueDate = processISPPayment($conn, $user_id);

        // Commit the transaction
        mysqli_commit($conn);

        // Log successful payment for debugging
        error_log("PayPal payment successful for user_id: $user_id, amount: $paid_amount, due_date_unchanged: $nextDueDate");

        // 8) Redirect home with success flag and due date info
        $redirectUrl = "https://lynxfiberinternet.com/user_dashboard.html?paid=true&next_due=" . urlencode($nextDueDate) . "&amount=" . urlencode($paid_amount);
        header("Location: $redirectUrl");
        exit;

    } catch (Exception $e) {
        // Rollback transaction on error
        mysqli_rollback($conn);
        
        // Log the error
        error_log("PayPal payment processing failed: " . $e->getMessage());
        error_log("PayPal capture data: " . print_r($captureData, true));
        
        // Redirect with error
        header("Location: https://lynxfiberinternet.com/user_dashboard.html?status=error&message=" . urlencode($e->getMessage()));
        exit;
    }
}

// If we get here, PayPal capture failed
error_log("PayPal capture failed or incomplete: " . print_r($captureData, true));

// Check for specific PayPal errors
$errorMessage = "Payment processing failed";
if (isset($captureData['details'][0]['description'])) {
    $errorMessage = $captureData['details'][0]['description'];
} elseif (isset($captureData['message'])) {
    $errorMessage = $captureData['message'];
}

header("Location: https://lynxfiberinternet.com/user_dashboard.html?status=failed&message=" . urlencode($errorMessage));
exit;
?>