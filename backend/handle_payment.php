<?php
session_start();
header("Content-Type: application/json");
include('connectdb.php');

// 1) Authenticate user
$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

// 2) Fetch user's current bill from database
$stmt = $conn->prepare("SELECT currentBill FROM approved_user WHERE user_id = ?");
$stmt->bind_param("s", $user_id);
$stmt->execute();
$stmt->bind_result($currentBill);
$stmt->fetch();
$stmt->close();

if ($currentBill === null) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Billing info not found']);
    exit;
}

// 3) PayPal credentials (Sandbox mode)
$clientId = 'AXTLiTg8G_QhoP_G98HIpnZUOY0UdF_yB48lEv3nGbs19D9-BQ-boEEIruysg3F0ciDFNtKHj17fya2M';
$clientSecret = 'EFfTuq_rU-m4PsOK_UN5efFt7RJRhEd5YwcrKNp2YTtuzUHEJAHdF1HAqGvipkZ4KXycDFgAlqh02dr4';

// 4) Get access token
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERPWD => "$clientId:$clientSecret",
    CURLOPT_POSTFIELDS => "grant_type=client_credentials",
    CURLOPT_HTTPHEADER => [
        "Accept: application/json",
        "Accept-Language: en_US"
    ],
    CURLOPT_POST => true
]);
$response = curl_exec($ch);
if (!$response) {
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch PayPal access token']);
    exit;
}
$data = json_decode($response, true);
$accessToken = $data['access_token'] ?? null;
curl_close($ch);

if (!$accessToken) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid PayPal credentials']);
    exit;
}

// 5) Create PayPal order
$orderData = [
    'intent' => 'CAPTURE',
    'purchase_units' => [[
        'amount' => [
            'currency_code' => 'PHP',
            'value' => number_format($currentBill, 2, '.', '')
        ],
        'description' => "User #$user_id subscription"
    ]],
    'application_context' => [
        'brand_name' => 'LYNX Fiber',
        'return_url' => 'https://lynxfiberinternet.com/backend/payment_success.php',
        'cancel_url' => 'https://lynxfiberinternet.com/user_dashboard.html',
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

// 6) Get approval link
$approvalUrl = null;
if (isset($data['links'])) {
    foreach ($data['links'] as $link) {
        if ($link['rel'] === 'approve') {
            $approvalUrl = $link['href'];
            break;
        }
    }
}

if ($approvalUrl) {
    echo json_encode(['status' => 'success', 'checkout_url' => $approvalUrl]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to create PayPal order', 'paypal_response' => $data]);
}
?>
