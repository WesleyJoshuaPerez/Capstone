<?php
// Show all errors (only in dev/testing)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header("Content-Type: application/json");

// Import PHPMailer classes from correct path
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once __DIR__ . '/phpmailer/src/Exception.php';
require_once __DIR__ . '/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/phpmailer/src/SMTP.php';

// Database connection
require_once 'connectdb.php';

if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['email'])) {
    $email = trim($_POST['email']);
    $user_id = null;
    $role = null;

    // Check if the email exists
    $stmt = $conn->prepare("
        SELECT user_id, 'user' AS role FROM approved_user WHERE email_address = ? 
        UNION 
        SELECT admin_id AS user_id, 'admin' AS role FROM lynx_admin WHERE email_address = ?
    ");

    if (!$stmt) {
        echo json_encode(["status" => "error", "title" => "Database Error", "message" => "Query preparation failed: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("ss", $email, $email);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "title" => "Database Error", "message" => "Query execution failed: " . $stmt->error]);
        exit();
    }

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $user_id = $row['user_id'];
        $role = $row['role'];
    }
    $stmt->close();

    if (!$user_id) {
        echo json_encode(["status" => "error", "title" => "Email Not Found", "message" => "The email address does not exist in our records."]);
        exit();
    }

    // Generate reset token
    $reset_token = substr(str_shuffle('1234567890QWERTYUIOPASDFGHJKLZXCVBNM'), 0, 10);
    $request_date = date('Y-m-d H:i:s');

    // Check if 'role' column exists in resetpass_request table
    $role_exists = false;
    $role_check = $conn->query("SHOW COLUMNS FROM resetpass_request LIKE 'role'");
    if ($role_check && $role_check->num_rows > 0) {
        $role_exists = true;
    }

    // Insert reset token into the database
    if ($role_exists) {
        $insertStmt = $conn->prepare("INSERT INTO resetpass_request (reset_token, email_address, request_date, user_id, role) VALUES (?, ?, ?, ?, ?)");
        $insertStmt->bind_param("sssss", $reset_token, $email, $request_date, $user_id, $role);
    } else {
        $insertStmt = $conn->prepare("INSERT INTO resetpass_request (reset_token, email_address, request_date, user_id) VALUES (?, ?, ?, ?)");
        $insertStmt->bind_param("ssss", $reset_token, $email, $request_date, $user_id);
    }

    if (!$insertStmt->execute()) {
        echo json_encode(["status" => "error", "title" => "Database Error", "message" => "Error inserting token: " . $conn->error]);
        exit();
    }
    $insertStmt->close();

    // Send email
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'noreplylynxfiberinternet@gmail.com';
        $mail->Password = 'xoel vjfs smnc ckjy'; // Replace with a secure method in production
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('noreplylynxfiberinternet@gmail.com', 'Lynx Fiber');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Password Reset';
        $mail->Body = 'To reset your password, click this link: 
        <a href="https://lynxfiberinternet.com/changepass.html?code=' . $reset_token . '">Reset Password</a><br>This link will expire in 24 hours.';

        if ($mail->send()) {
            echo json_encode([
                "status" => "success",
                "title" => "Email Sent!",
                "message" => "Password reset link has been sent to your email. Check your inbox or spam folder.",
                "redirect" => "https://lynxfiberinternet.com/index.html"
            ]);
        } else {
            throw new Exception("Email could not be sent.");
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "title" => "Mailer Error",
            "message" => "Failed to send email: " . $mail->ErrorInfo
        ]);
    }

    $conn->close();
    exit();
}

// Fallback: No email sent
echo json_encode([
    "status" => "error",
    "title" => "Invalid Request",
    "message" => "No email address was provided."
]);
$conn->close();
