<?php
session_start();
include('connectdb.php');

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

// 3) Setup PayPal credentials
$clientId = 'AXTLiTg8G_QhoP_G98HIpnZUOY0UdF_yB48lEv3nGbs19D9-BQ-boEEIruysg3F0ciDFNtKHj17fya2M';
$clientSecret = 'EFfTuq_rU-m4PsOK_UN5efFt7RJRhEd5YwcrKNp2YTtuzUHEJAHdF1HAqGvipkZ4KXycDFgAlqh02dr4';

// 4) Get Access Token
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERPWD => "$clientId:$clientSecret",
    CURLOPT_POSTFIELDS => "grant_type=client_credentials",
    CURLOPT_HTTPHEADER => ["Accept: application/json", "Accept-Language: en_US"],
    CURLOPT_POST => true
]);
$response = curl_exec($ch);
if (!$response) {
    echo json_encode(['status'=>'error','message'=>'Unable to fetch PayPal access token']);
    exit;
}
$data = json_decode($response, true);
$accessToken = $data['access_token'];
curl_close($ch);

// 5) Create PayPal Order
$orderData = [
    'intent' => 'CAPTURE',
    'purchase_units' => [[
        'amount' => [
            'currency_code' => 'PHP',
            'value' => number_format($currentBill, 2, '.', '')
        ],
        'description' => "User #{$user_id} subscription"
    ]],
    'application_context' => [
        'brand_name' => 'LYNX Fiber',
        'return_url' => 'http://localhost/Github/Capstone/backend/payment_success.php',
        'cancel_url' => 'http://localhost/Github/Capstone/user_dashboard.html',
        'user_action' => 'PAY_NOW'
    ]
];

$ch = curl_init("https://api-m.sandbox.paypal.com/v2/checkout/orders");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer $accessToken"
    ],
    CURLOPT_POSTFIELDS => json_encode($orderData)
]);
$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

$approvalUrl = null;
foreach ($data['links'] as $link) {
    if ($link['rel'] === 'approve') {
        $approvalUrl = $link['href'];
        break;
    }
}

if ($approvalUrl) {
    echo json_encode(['status'=>'success', 'checkout_url'=>$approvalUrl]);
} else {
    echo json_encode(['status'=>'error', 'message'=>'No pending bill found.', 'response'=>$data]);
}
?>
