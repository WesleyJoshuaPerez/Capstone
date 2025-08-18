<?php
// Import PHPMailer classes from correct path
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once __DIR__ . '/phpmailer/src/Exception.php';
require_once __DIR__ . '/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/phpmailer/src/SMTP.php';

// Database connection
require_once 'connectdb.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// Function to calculate initial due date based on installation date
function calculateInitialDueDate($installationDate) {
    // Set the first due date to 1 month after installation
    $dueDate = date('Y-m-d', strtotime('+1 month', strtotime($installationDate)));
    return $dueDate;
}

$rawData = file_get_contents("php://input");
$decodedData = json_decode($rawData, true);

if (!$decodedData || !isset($decodedData['id'], $decodedData['status'])) {
    echo json_encode(["success" => false, "error" => "Invalid input", "received_data" => $decodedData]);
    exit();
}

$id = $conn->real_escape_string($decodedData['id']);
$status = $conn->real_escape_string($decodedData['status']);
$nap_box_id = isset($decodedData['nap_box_id']) ? $conn->real_escape_string($decodedData['nap_box_id']) : null;

// Start transaction for data integrity
$conn->begin_transaction();

try {
    $sql = "UPDATE registration_acc SET status='$status' WHERE id='$id'";
    if (!$conn->query($sql)) {
        throw new Exception("Failed to update registration status: " . $conn->error);
    }

    if ($status === 'Approved') {
        $query = "SELECT * FROM registration_acc WHERE id='$id'";
        $result = $conn->query($query);
        if ($result->num_rows === 0) {
            throw new Exception("User not found.");
        }

        $user = $result->fetch_assoc();
        $plan = strtolower($user['subscription_plan']);
        $currentBill = ($plan == 'bronze') ? 1199 : (($plan == 'silver') ? 1499 : 1799);

        // Generate credentials
        $firstLetters = strtoupper(substr($user['first_name'], 0, 1));
        $secondLetters = strpos($user['first_name'], ' ') !== false ? strtoupper(substr(explode(' ', $user['first_name'])[1], 0, 1)) : "";
        $surname = strtolower($user['last_name']);
        $birthDay = date('d', strtotime($user['birth_date']));
        $username = $firstLetters . $secondLetters . $surname . $birthDay . $user['id'];

        function generateRandomPassword($length = 8) {
            $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
            $nums = "0123456789";
            $password = substr(str_shuffle($chars), 0, $length - 1);
            $password .= $nums[rand(0, strlen($nums) - 1)];
            return str_shuffle($password);
        }

        $plainPassword = generateRandomPassword();
        $hashedPassword = md5($plainPassword);
        $fullname = $user['first_name'] . " " . $user['last_name'];
        $address = $user['barangay'] . ", " . $user['municipality'] . ", " . $user['province'];
        $formattedUserId = str_pad($id, 10, '0', STR_PAD_LEFT);

        // Calculate initial due date
        $initialDueDate = calculateInitialDueDate($user['installation_date']);
        
        // Insert approved user with due_date and reminder_sent
        $insertQuery = "INSERT INTO approved_user (
            user_id, username, password, subscription_plan, currentbill, fullname, birth_date, address,
            address_latitude, address_longitude, contact_number, email_address, id_type, id_number, 
            id_photo, proof_of_residency, home_ownership_type, installation_date, registration_date, 
            nap_box_id, due_date, reminder_sent, payment_status, account_status
        ) VALUES (
            '$formattedUserId', '$username', '$hashedPassword', '{$user['subscription_plan']}', '$currentBill', '$fullname', 
            '{$user['birth_date']}', '$address', '{$user['address_latitude']}', '{$user['address_longitude']}',
            '{$user['contact_number']}', '{$user['email_address']}', '{$user['id_type']}', '{$user['id_number']}',
            '{$user['id_photo']}', '{$user['proof_of_residency']}', '{$user['home_ownership_type']}',
            '{$user['installation_date']}', NOW(), '$nap_box_id', '$initialDueDate', 0, 'unpaid', 'active'
        )";

        if (!$conn->query($insertQuery)) {
            throw new Exception("Failed to insert into approved_user: " . $conn->error);
        }

        // Decrease napbox available_slots
        if ($nap_box_id) {
            $updateNapBox = "UPDATE nap_box_availability SET available_slots = available_slots - 1 WHERE nap_box_id = '$nap_box_id'";
            if (!$conn->query($updateNapBox)) {
                throw new Exception("Failed to update NAP box availability: " . $conn->error);
            }
        }

        // Commit transaction before sending email
        $conn->commit();

        // Send approval email
        sendApprovalEmail($user['email_address'], $username, $plainPassword, $initialDueDate);
        
        echo json_encode([
            "success" => true, 
            "message" => "User approved and NAP box assigned.",
            "user_id" => $formattedUserId,
            "due_date" => $initialDueDate
        ]);

    } else {
        if ($status === 'Denied') {
            $query = "SELECT email_address, first_name FROM registration_acc WHERE id='$id'";
            $result = $conn->query($query);
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                sendDenialEmail($user['email_address'], $user['first_name']);
            }
        }
        
        // Commit transaction
        $conn->commit();
        echo json_encode(["success" => true, "message" => "Status updated to $status"]);
    }

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

$conn->close();

function sendApprovalEmail($email, $username, $plainPassword, $dueDate = null) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'noreplylynxfiberinternet@gmail.com';
        $mail->Password = 'xoel vjfs smnc ckjy';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('noreplylynxfiberinternet@gmail.com', 'Lynx Fiber');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Your LYNX Fiber Internet Account Has Been Approved!';
        
        $dueDateInfo = $dueDate ? "<p><b>First Billing Due Date:</b> " . date('F j, Y', strtotime($dueDate)) . "</p>" : "";
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background-color: #007bff; color: white; padding: 20px; text-align: center;'>
                <h2>LYNX Fiber Internet</h2>
                <h3>Welcome to Our Network!</h3>
            </div>
            <div style='padding: 20px; background-color: #f8f9fa;'>
                <h3>Hello,</h3>
                <p>Congratulations! Your LYNX Fiber Internet account has been <strong>approved</strong>.</p>
                
                <div style='background-color: white; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;'>
                    <h4>Your Account Details:</h4>
                    <p><b>Username:</b> $username</p>
                    <p><b>Temporary Password:</b> $plainPassword</p>
                    $dueDateInfo
                </div>
                
                <div style='background-color: #fff3cd; padding: 15px; border: 1px solid #ffc107; border-radius: 5px; margin: 20px 0;'>
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>Please change your password after logging in</li>
                        <li>Your first bill will be generated based on your installation date</li>
                        <li>You can pay online or visit our office</li>
                    </ul>
                </div>
                
                <p>You can now log in to your account at: <a href='https://lynxfiberinternet.com/login.html'>https://lynxfiberinternet.com/</a></p>
                
                <p>Thank you for choosing LYNX Fiber Internet!</p>
                <p><em>Stay Connected, Stay Fast!</em></p>
            </div>
            <div style='background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px;'>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>";

        $mail->send();
        error_log("Approval email sent successfully to: $email");
    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
    }
}

function sendDenialEmail($email, $firstName) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'noreplylynxfiberinternet@gmail.com';
        $mail->Password = 'xoel vjfs smnc ckjy';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('noreplylynxfiberinternet@gmail.com', 'Lynx Fiber');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'LYNX Fiber Internet Application Status: Denied';
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background-color: #dc3545; color: white; padding: 20px; text-align: center;'>
                <h2>LYNX Fiber Internet</h2>
                <h3>Application Status Update</h3>
            </div>
            <div style='padding: 20px; background-color: #f8f9fa;'>
                <h3>Hello $firstName,</h3>
                <p>We regret to inform you that your application for LYNX Fiber Internet has been <strong>denied</strong>.</p>
                
                <div style='background-color: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px 0;'>
                    <p><strong>Next Steps:</strong></p>
                    <ul>
                        <li>If you have questions about this decision, please contact our support team</li>
                        <li>You may reapply in the future if your circumstances change</li>
                        <li>We appreciate your interest in our services</li>
                    </ul>
                </div>
                
                <p>If you believe this was a mistake or have additional information to provide, feel free to contact us at:</p>
                <p><strong>Email:</strong> support@lynxfiberinternet.com</p>
                
                <p>Thank you for your interest in LYNX Fiber Internet.</p>
            </div>
            <div style='background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px;'>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>";

        $mail->send();
        error_log("Denial email sent successfully to: $email");
    } catch (Exception $e) {
        error_log("Denial email failed: " . $mail->ErrorInfo);
    }
}
?>