<?php
session_start();
include('connectdb.php');

// 1) Grab the Order ID PayPal sent back
$orderId = $_GET['token'] ?? null;
if (!$orderId) {
    die('Payment token missing.');
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
    // 5) Fetch user details
    $user_id = $_SESSION['user_id'] ?? null;
    if (!$user_id) {
        die("Unauthorized");
    }

    $stmt = mysqli_prepare($conn, "SELECT fullname, subscription_plan, currentBill FROM approved_user WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, "s", $user_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $fullname, $subscription_plan, $currentBill);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    // 6) Insert payment details into the payments table
    $today = date('Y-m-d');
    $paid_amount = $captureData['purchase_units'][0]['payments']['captures'][0]['amount']['value'] ?? '0.00';
    $reference_number = $captureData['id'] ?? 'N/A';

    // Extract only necessary proof_of_payment details
    $proof_of_payment = json_encode([
        'id' => $captureData['id'] ?? null,
        'status' => $captureData['status'] ?? null,
        'amount' => $paid_amount
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
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // 7) Update the approved_user table
    $stmt = mysqli_prepare($conn, "
      UPDATE approved_user
         SET currentBill = 0,
             payment_status = 'paid',
             last_payment_date = ?
       WHERE user_id = ?
    ");
    mysqli_stmt_bind_param($stmt, "si", $today, $user_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // 8) Redirect home with a flag
 header("Location: https://lynxfiberinternet.com/user_dashboard.html?paid=true");
    exit;
}

// If we get here, something went wrong
error_log("PayPal capture failed: " . print_r($captureData, true));
header("Location: https://lynxfiberinternet.com/user_dashboard.html?status=failed");
exit;