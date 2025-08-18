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

    // Create Gmail-compatible email template with inline styles
    $emailTemplate = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; color: #333333;">
        
        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔐 Password Reset</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">Lynx Fiber Internet Services</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px; font-weight: bold;">Hello there!</h2>
                                
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #666;">
                                    We received a request to reset your password for your Lynx Fiber account. If you made this request, click the button below to create a new password.
                                </p>
                                
                                <!-- Reset Button -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 20px 0;">
                                            <a href="https://lynxfiberinternet.com/changepass.html?code=' . $reset_token . '" 
                                               style="display: inline-block; background-color: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                                🔑 Reset My Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Warning Box -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td style="background-color: #fff3cd; border: 2px solid #ffeaa7; border-radius: 6px; padding: 20px;">
                                            <h3 style="margin: 0 0 10px 0; color: #856404; font-size: 18px; font-weight: bold;">⚠️ Important Security Information</h3>
                                            <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                                                This password reset link will expire in <strong>24 hours</strong> for your security. If you did not request this password reset, please ignore this email or contact our support team immediately.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Divider -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 20px 0;">
                                            <div style="height: 1px; background-color: #ddd; width: 100%;"></div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Alternative Link -->
                                <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Alternative Link:</p>
                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">If the button above doesn\'t work, copy and paste this link into your browser:</p>
                                <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; word-break: break-all; font-size: 12px; color: #495057; margin: 15px 0;">
                                    https://lynxfiberinternet.com/changepass.html?code=' . $reset_token . '
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                                <p style="margin: 0 0 10px 0; font-weight: bold; color: #495057; font-size: 16px;">Lynx Fiber Internet Services</p>
                                <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">Fast. Reliable. Connected.</p>
                                <p style="margin: 0 0 20px 0; color: #6c757d; font-size: 14px;">If you need assistance, please contact our support team.</p>
                                <p style="margin: 0; font-size: 12px; color: #adb5bd;">
                                    This is an automated message. Please do not reply to this email.
                                </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
        
    </body>
    </html>';

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

        $mail->setFrom('noreplylynxfiberinternet@gmail.com', 'Lynx Fiber Internet');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = '🔐 Password Reset Request - Lynx Fiber';
        $mail->Body = $emailTemplate;

        // Add plain text version for better compatibility
        $mail->AltBody = 'To reset your password, visit: https://lynxfiberinternet.com/changepass.html?code=' . $reset_token . '\n\nThis link will expire in 24 hours.\n\nIf you did not request this password reset, please ignore this email.\n\nLynx Fiber Internet Services';

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
?>