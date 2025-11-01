<?php
session_start();
include('connectdb.php'); // Ensure this connects $conn (MySQLi)

// Log errors to a file
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
error_reporting(E_ALL);

// Set JSON response header and clear any stray output
if (ob_get_length()) ob_clean();
header('Content-Type: application/json');

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        handlePaymentProofSubmission($conn, $user_id);
    } else {
        generateQRCodeAndPaymentDetails($conn, $user_id);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit;
}

// Function to handle payment proof submission (POST request)
function handlePaymentProofSubmission($conn, $user_id)
{
    // Check if the user already has a pending payment
    $stmt = mysqli_prepare($conn, "SELECT COUNT(*) FROM payments WHERE user_id = ? AND status = 'Pending'");
    mysqli_stmt_bind_param($stmt, "s", $user_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $pending_count);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    if ($pending_count > 0) {
        echo json_encode(['status' => 'error', 'message' => 'You already have a pending payment. Please wait for it to be approved.']);
        exit;
    }

    if (!isset($_POST['reference_number']) || !isset($_FILES['screenshot'])) {
        echo json_encode(['status' => 'error', 'message' => 'Both reference number and screenshot are required.']);
        exit;
    }

    $reference_number = trim($_POST['reference_number']);

    // Validate the reference number format
    if (!preg_match('/^\d{4}\s\d{3}\s\d{6}$/', $reference_number)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid reference number format.']);
        exit;
    }

    // Check for duplicate reference number
    $stmt = mysqli_prepare($conn, "SELECT COUNT(*) FROM payments WHERE reference_number = ?");
    mysqli_stmt_bind_param($stmt, "s", $reference_number);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $count);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    if ($count > 0) {
        echo json_encode(['status' => 'error', 'message' => 'This reference number has already been used.']);
        exit;
    }

    // Fetch user details and current bill amount from `approved_user` table
    $stmt = mysqli_prepare($conn, "SELECT fullname, subscription_plan, currentBill FROM approved_user WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, "s", $user_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $fullname, $subscription_plan, $currentBill);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    // Validate if the user has a pending bill
    if (!$currentBill || $currentBill <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'No pending bill found.']);
        exit;
    }

    $mode_of_payment = 'GCash'; // Set the mode of payment as GCash
    $paid_amount = $currentBill; // Assume the user is paying the full current bill amount

    // Validate screenshot
    $screenshot = $_FILES['screenshot'];
    if ($screenshot['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'File upload failed.']);
        exit;
    }

    $allowed_file_types = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!in_array($screenshot['type'], $allowed_file_types)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid file type. Only JPG and PNG are allowed.']);
        exit;
    }

    // Save screenshot to server
    $upload_dir = __DIR__ . '/uploads/gcash_proofs/';
    createDirectoryIfNotExists($upload_dir);
    $proof_filename = uniqid('') . "" . basename($screenshot['name']);
    $proof_path = $upload_dir . $proof_filename;

    if (!move_uploaded_file($screenshot['tmp_name'], $proof_path)) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to upload proof of payment.']);
        exit;
    }

    // Insert payment record into the database
    $stmt = mysqli_prepare($conn, "INSERT INTO payments (
        user_id, 
        fullname, 
        subscription_plan, 
        mode_of_payment, 
        paid_amount, 
        payment_date, 
        reference_number, 
        proof_of_payment, 
        status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')");

    $payment_date = date('Y-m-d H:i:s');
    mysqli_stmt_bind_param($stmt, "ssssdsss", $user_id, $fullname, $subscription_plan, $mode_of_payment, $paid_amount, $payment_date, $reference_number, $proof_filename);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Payment proof submitted successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save payment proof.']);
    }
    mysqli_stmt_close($stmt);
}

// Function to generate QR code and payment details (GET request)
function generateQRCodeAndPaymentDetails($conn, $user_id)
{
    // Fetch the current bill amount from `approved_user`
    $stmt = mysqli_prepare($conn, "SELECT currentBill FROM approved_user WHERE user_id=?");
    mysqli_stmt_bind_param($stmt, "s", $user_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $currentBill);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    // Validate if the user has a pending bill
    if (!$currentBill || $currentBill <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'No pending bill found.']);
        exit;
    }

    // Static QR code URL 
    $qr_code_url = 'frontend/assets/images/qr/gcash_qrcode.jpg';

    echo json_encode([
        'status' => 'success',
        'data' => [
            'qr_code_url' => $qr_code_url,
            'amount' => $currentBill
        ]
    ]);
}

// Helper function to create a directory if it doesn't exist
function createDirectoryIfNotExists($dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}
?>