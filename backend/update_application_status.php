<?php
// Import PHPMailer classes
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

if (!$decodedData) {
    echo json_encode(["success" => false, "error" => "JSON decoding failed", "raw_input" => $rawData]);
    exit();
}

if (isset($decodedData['id']) && isset($decodedData['status'])) {
    $id = $conn->real_escape_string($decodedData['id']);
    $status = $conn->real_escape_string($decodedData['status']);

    $sql = "UPDATE registration_acc SET status='$status' WHERE id='$id'";
    if ($conn->query($sql) === TRUE) {
        if ($status === 'Approved') {
            $query = "SELECT * FROM registration_acc WHERE id='$id'";
            $result = $conn->query($query);

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();

                // Determine the current bill based on subscription_plan
                $currentBill = 0;
                $plan = strtolower($user['subscription_plan']);
                if ($plan == 'bronze') {
                    $currentBill = 1199;
                } elseif ($plan == 'silver') {
                    $currentBill = 1499;
                } elseif ($plan == 'gold') {
                    $currentBill = 1799;
                }

                // Generate username
                $firstLetters = strtoupper(substr($user['first_name'], 0, 1));
                $secondLetters = strpos($user['first_name'], ' ') !== false ? strtoupper(substr(explode(' ', $user['first_name'])[1], 0, 1)) : "";
                $surname = strtolower($user['last_name']);
                $birthDay = date('d', strtotime($user['birth_date']));
                $username = $firstLetters . $secondLetters . $surname . $birthDay;

                // Generate random password
                function generateRandomPassword($length = 8) {
                    return substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"), 0, $length);
                }
                $plainPassword = generateRandomPassword();
                $hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

                $fullname = $user['first_name'] . " " . $user['last_name'];
                $address = $user['barangay'] . ", " . $user['municipality'] . ", " . $user['province'];

                // Format the user_id to always be 10 digits
                $formattedUserId = str_pad($id, 10, '0', STR_PAD_LEFT);

                // Modify the insert query to include formatted user_id
                $insertQuery = "INSERT INTO approved_user (
                    user_id, username, password, subscription_plan, currentbill, fullname, birth_date, address,
                    address_latitude, address_longitude,
                    contact_number, email_address, id_type, id_number, id_photo, proof_of_residency, 
                    home_ownership_type, installation_date, registration_date
                ) VALUES (
                    '$formattedUserId', '$username', '$plainPassword', '{$user['subscription_plan']}', '$currentBill', '$fullname', 
                    '{$user['birth_date']}', '$address',
                    '{$user['address_latitude']}', '{$user['address_longitude']}',
                    '{$user['contact_number']}', '{$user['email_address']}', '{$user['id_type']}', '{$user['id_number']}', 
                    '{$user['id_photo']}', '{$user['proof_of_residency']}', '{$user['home_ownership_type']}', 
                    '{$user['installation_date']}', NOW()
                )";
                
                if ($conn->query($insertQuery) === TRUE) {
                    sendApprovalEmail($user['email_address'], $username, $plainPassword);
                    echo json_encode(["success" => true, "message" => "User approved and email sent."]);
                } else {
                    echo json_encode(["success" => false, "error" => "Failed to insert into approved_user: " . $conn->error]);
                }
            } else {
                echo json_encode(["success" => false, "error" => "User not found."]);
            }
        } else {
            echo json_encode(["success" => true, "message" => "Status updated to $status"]);
        }
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid input", "received_data" => $decodedData]);
}

$conn->close();

function sendApprovalEmail($email, $username, $plainPassword) {
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Replace with your mail server
        $mail->SMTPAuth = true;
        $mail->Username = 'noreplylynxfiber@gmail.com'; // Replace with your email
        $mail->Password = 'pkeq usho jsfe piqw'; // Replace with your email password or app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Sender and recipient
        $mail->setFrom('noreplylynxfiber@gmail.com', 'Lynx Fiber');
        $mail->addAddress($email);

        // Email content
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
?>
