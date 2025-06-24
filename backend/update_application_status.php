<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
include 'connectdb.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$rawData = file_get_contents("php://input");
$decodedData = json_decode($rawData, true);

if (!$decodedData || !isset($decodedData['id'], $decodedData['status'])) {
    echo json_encode(["success" => false, "error" => "Invalid input", "received_data" => $decodedData]);
    exit();
}

$id = $conn->real_escape_string($decodedData['id']);
$status = $conn->real_escape_string($decodedData['status']);
$nap_box_id = isset($decodedData['nap_box_id']) ? $conn->real_escape_string($decodedData['nap_box_id']) : null;

$sql = "UPDATE registration_acc SET status='$status' WHERE id='$id'";
if (!$conn->query($sql)) {
    echo json_encode(["success" => false, "error" => $conn->error]);
    exit();
}

if ($status === 'Approved') {
    $query = "SELECT * FROM registration_acc WHERE id='$id'";
    $result = $conn->query($query);
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "User not found."]);
        exit();
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

    // Insert approved user with nap_box_id
    $insertQuery = "INSERT INTO approved_user (
        user_id, username, password, subscription_plan, currentbill, fullname, birth_date, address,
        address_latitude, address_longitude, contact_number, email_address, id_type, id_number, 
        id_photo, proof_of_residency, home_ownership_type, installation_date, registration_date, nap_box_id
    ) VALUES (
        '$formattedUserId', '$username', '$hashedPassword', '{$user['subscription_plan']}', '$currentBill', '$fullname', 
        '{$user['birth_date']}', '$address', '{$user['address_latitude']}', '{$user['address_longitude']}',
        '{$user['contact_number']}', '{$user['email_address']}', '{$user['id_type']}', '{$user['id_number']}',
        '{$user['id_photo']}', '{$user['proof_of_residency']}', '{$user['home_ownership_type']}',
        '{$user['installation_date']}', NOW(), '$nap_box_id'
    )";

    if ($conn->query($insertQuery) === TRUE) {
        // Decrease napbox available_slots
        if ($nap_box_id) {
            $conn->query("UPDATE nap_box_availability SET available_slots = available_slots - 1 WHERE nap_box_id = '$nap_box_id'");
        }

        sendApprovalEmail($user['email_address'], $username, $plainPassword);
        echo json_encode(["success" => true, "message" => "User approved and NAP box assigned."]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to insert into approved_user: " . $conn->error]);
    }
} else {
    if ($status === 'Denied') {
        $query = "SELECT email_address, first_name FROM registration_acc WHERE id='$id'";
        $result = $conn->query($query);
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            sendDenialEmail($user['email_address'], $user['first_name']);
        }
    }
    echo json_encode(["success" => true, "message" => "Status updated to $status"]);
}

$conn->close();

function sendApprovalEmail($email, $username, $plainPassword) {
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
        $mail->Subject = 'Your Account Has Been Approved!';
        $mail->Body = "<h3>Hello,</h3>
                       <p>Your account has been approved.</p>
                       <p><b>Username:</b> $username</p>
                       <p><b>Password:</b> $plainPassword</p>
                       <p>Please change your password after logging in.</p>";
        $mail->send();
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
        $mail->Subject = 'Application Status: Denied';
        $mail->Body = "<h3>Hello $firstName,</h3>
                       <p>We regret to inform you that your application for Lynx Fiber Internet has been <strong>denied</strong>.</p>
                       <p>If you have questions or believe this was a mistake, feel free to contact us at support@lynxfiber.com.</p>
                       <p>Thank you for your interest.</p>";
        $mail->send();
    } catch (Exception $e) {
        error_log("Denial email failed: " . $mail->ErrorInfo);
    }
}
?>
