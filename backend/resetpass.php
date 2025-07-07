<?php
session_start();
header("Content-Type: application/json");

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Database connection
require_once 'connectdb.php';

if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['email'])) {
    $email = trim($_POST['email']);
    $user_id = null;
    $role = null;

    // Check if email exists in approved_user or lynx_admin
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

    // Generate unique reset token
    $reset_token = substr(str_shuffle('1234567890QWERTYUIOPASDFGHJKLZXCVBNM'), 0, 10);
    $request_date = date('Y-m-d H:i:s');

    // Check if role column exists in resetpass_request
    $role_exists = false;
    $role_check = $conn->query("SHOW COLUMNS FROM resetpass_request LIKE 'role'");
    if ($role_check && $role_check->num_rows > 0) {
        $role_exists = true;
    }

    // Insert reset token into database
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

    // Send email with reset link
    $mail = new PHPMailer(true);
    try {
        // SMTP settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'noreplylynxfiberinternet@gmail.com';
        $mail->Password = 'xoel vjfs smnc ckjy'; // Use an environment variable for security
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('noreplylynxfiberinternet@gmail.com', 'Lynx Fiber');
        $mail->addAddress($email);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset';
      $mail->Body = 'To reset your password, click the link here: <a href="https://lynxfiberinternet.com/changepass.html?code='.$reset_token.'">Reset Password</a>.<br>This link will expire in 24 hours.';


        if ($mail->send()) {
            echo json_encode([
                "status" => "success",
                "title" => "Email Sent!",
                "message" => "Password reset link has been sent to your email. Check your inbox or spam folder.",
                "redirect" => "https://lynxfiberinternet.com/index.html"

            ]);
        } else {
            throw new Exception("Email not sent.");
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "title" => "Error!",
            "message" => "Could not send email. Error: " . $mail->ErrorInfo
        ]);
    }
}

$conn->close();
?>