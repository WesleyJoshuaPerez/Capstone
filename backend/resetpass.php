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
$conn = new mysqli('localhost', 'root', '', 'lynx');
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "title" => "Database Error", "message" => "Could not connect to the database."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['email'])) {
    $email = trim($_POST['email']);

    // Check if email exists
    $stmt = $conn->prepare("SELECT user_id FROM approved_user WHERE email_address = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    $user_id = null;
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $user_id = $row['user_id'];
    }
    $stmt->close();

    if (!$user_id) {
        echo json_encode(["status" => "error", "title" => "Email Not Found", "message" => "The email address does not exist in our records."]);
        exit();
    }

    // Generate unique reset token
    $reset_token = substr(str_shuffle('1234567890QWERTYUIOPASDFGHJKLZXCVBNM'), 0, 10);
    $request_date = date('Y-m-d H:i:s');

    // Insert reset token into database
    $insertStmt = $conn->prepare("INSERT INTO resetpass_request (reset_token, email_address, request_date, user_id) VALUES (?, ?, ?, ?)");
    $insertStmt->bind_param("sssi", $reset_token, $email, $request_date, $user_id);
    $insertStmt->execute();
    $insertStmt->close();

    // Send email with reset link
    $mail = new PHPMailer(true);
    try {
        // SMTP settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'noreplylynxfiber@gmail.com';
        $mail->Password = 'pkeq usho jsfe piqw'; // Use an environment variable for security
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('noreplylynxfiber@gmail.com', 'Lynx Fiber');
        $mail->addAddress($email);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset';
        $mail->Body = 'To reset your password, click the link here: <a href="http://localhost/Github/Capstone/changepass.html?code='.$reset_token.'">Reset Password</a>.<br>This link will expire in 24 hours.';

        if ($mail->send()) {
            echo json_encode([
                "status" => "success",
                "title" => "Email Sent!",
                "message" => "Password reset link has been sent to your email. Check your inbox or spam folder.",
                "redirect" => "http://localhost/Github/Capstone/index.html"
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
