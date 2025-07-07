<?php
// Enable full error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header("Content-Type: application/json");

// Log: we reached this file
file_put_contents(__DIR__ . '/resetpass-log.txt', "resetpass.php accessed\n", FILE_APPEND);

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Adjust paths if needed based on your structure
require_once __DIR__ . '/../PHPMailer/src/Exception.php';
require_once __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer/src/SMTP.php';

// DB connection
require_once 'connectdb.php';

if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['email'])) {
    $email = trim($_POST['email']);
    $user_id = null;
    $role = null;

    // Check if email exists
    $stmt = $conn->prepare("
        SELECT user_id, 'user' AS role FROM approved_user WHERE email_address = ? 
        UNION 
        SELECT admin_id AS user_id, 'admin' AS role FROM lynx_admin WHERE email_address = ?
    ");
    if (!$stmt) {
        echo json_encode(["status" => "error", "title" => "Database Error", "message" => "Prepare failed: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("ss", $email, $email);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "title" => "Database Error", "message" => "Execution failed: " . $stmt->error]);
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
        echo json_encode(["status" => "error", "title" => "Email Not Found", "message" => "Email not found in our records."]);
        exit();
    }

    // Generate token
    $reset_token = substr(str_shuffle('1234567890QWERTYUIOPASDFGHJKLZXCVBNM'), 0, 10);
    $request_date = date('Y-m-d H:i:s');

    // Check if 'role' column exists
    $role_exists = false;
    $role_check = $conn->query("SHOW COLUMNS FROM resetpass_request LIKE 'role'");
    if ($role_check && $role_check->num_rows > 0) {
        $role_exists = true;
    }

    // Insert token
    if ($role_exists) {
        $insertStmt = $conn->prepare("INSERT INTO resetpass_request (reset_token, email_address, request_date, user_id, role) VALUES (?, ?, ?, ?, ?)");
        $insertStmt->bind_param("sssss", $reset_token, $email, $request_date, $user_id, $role);
    } else {
        $insertStmt = $conn->prepare("INSERT INTO resetpass_request (reset_token, email_address, request_date, user_id) VALUES (?, ?, ?, ?)");
        $insertStmt->bind_param("ssss", $reset_token, $email, $request_date, $user_id);
    }

    if (!$insertStmt->execute()) {
        echo json_encode(["status" => "error", "title" => "Database Error", "message" => "Failed to insert token: " . $conn->error]);
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
        $mail->Password = 'xoel vjfs smnc ckjy'; // ⚠️ Replace this with ENV variable in real use
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
                "message" => "A password reset link has been sent to your email.",
                "redirect" => "https://lynxfiberinternet.com/index.html"
            ]);
        } else {
            throw new Exception("Mail send failed.");
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "title" => "Mailer Error",
            "message" => "Email sending failed: " . $mail->ErrorInfo
        ]);
    }
    $conn->close();
    exit();
}

// Fallback: if nothing matched
echo json_encode([
    "status" => "error",
    "title" => "No Request",
    "message" => "No valid POST request or email provided."
]);
$conn->close();
