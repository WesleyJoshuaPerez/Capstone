<?php
session_start();
include('connectdb.php');  // your MySQLi $conn

// 1) Authenticate user
$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['status'=>'error','message'=>'User not logged in']);
    exit;
}

// 2) Get the amount from DB
$stmt = mysqli_prepare($conn, "SELECT currentBill FROM approved_user WHERE user_id=?");
mysqli_stmt_bind_param($stmt, "s", $user_id);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $currentBill);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

if ($currentBill === null) {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'Billing info not found']);
    exit;
}

$amountInCents = intval($currentBill * 100);

// 3) Build the Checkout Session payload
$payload = [
  'data' => [
    'attributes' => [
      'line_items' => [
        [
          'name'        => 'LYNX Fiber Payment',
          'description' => "User #{$user_id} subscription",
          'amount'      => $amountInCents,
          'currency'    => 'PHP',
          'quantity'    => 1
        ]
      ],
      'mode'                  => 'payment',
      'payment_method_types'  => ['gcash'],
      'success_url'           => 'http://localhost/Github/Capstone/backend/payment_success.php?status=success',
      'cancel_url'            => 'http://localhost/Github/Capstone/user_dashboard.html?status=failed'
    ]
  ]
];

 
$ch = curl_init("https://api.paymongo.com/v1/checkout_sessions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_USERPWD        => "$secretKey:",
    CURLOPT_HTTPHEADER     => ["Content-Type: application/json","Accept: application/json"],
    CURLOPT_POSTFIELDS     => json_encode($payload),
]);
$response = curl_exec($ch);
$error    = curl_error($ch);
curl_close($ch);

header('Content-Type: application/json');
if ($error) {
    echo json_encode(['status'=>'error','message'=>"cURL error: $error"]);
    exit;
}

$resp        = json_decode($response, true);
$checkoutUrl = $resp['data']['attributes']['checkout_url'] ?? null;

if ($checkoutUrl) {
    echo json_encode(['status'=>'success','checkout_url'=>$checkoutUrl]);
} else {
    echo json_encode([
        'status'   => 'error',
        'message'  => 'Failed to create checkout session',
        'response' => $resp
    ]);
}
?>
