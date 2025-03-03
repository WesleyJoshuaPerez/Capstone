<?php
include 'connectdb.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

$rawData = file_get_contents("php://input"); // Get raw input
$decodedData = json_decode($rawData, true);

if (!$decodedData) {
    echo json_encode(["success" => false, "error" => "JSON decoding failed", "raw_input" => $rawData]);
    exit();
}

if (isset($decodedData['id']) && isset($decodedData['status'])) {
    $id = $conn->real_escape_string($decodedData['id']);
    $status = $conn->real_escape_string($decodedData['status']);

    // First, update the status
    $sql = "UPDATE registration_acc SET status='$status' WHERE id='$id'";
    if ($conn->query($sql) === TRUE) {
        
        // If Approved, insert into approved_user
        if ($status === 'Approved') {
            // Get user details
            $query = "SELECT * FROM registration_acc WHERE id='$id'";
            $result = $conn->query($query);

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();

                // Generate unique username
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

                // Concatenate full name and address
                $fullname = $user['first_name'] . " " . $user['last_name'];
                $address = $user['barangay'] . ", " . $user['municipality'] . ", " . $user['province'];


                // // Insert into approved_user use hashedpassword when the phpmailer have
                // $insertQuery = "INSERT INTO approved_user (user_id, username, password, subscription_plan, fullname, birth_date, address, contact_number, email_address, id_type, id_number, id_photo, proof_of_residency, home_ownership_type, installation_date, registration_date) 
                // VALUES ('$id', '$username', '$hashedPassword', '$user[subscription_plan]', '$fullname', '$user[birth_date]', '$address', '$user[contact_number]', '$user[email_address]', '$user[id_type]', '$user[id_number]', '$user[id_photo]', '$user[proof_of_residency]', '$user[home_ownership_type]', '$user[installation_date]', NOW())";

                 
                 // Insert into approved_user the plain password for now to check it the logic in login works
                   $insertQuery = "INSERT INTO approved_user (user_id, username, password, subscription_plan, fullname, birth_date, address, contact_number, email_address, id_type, id_number, id_photo, proof_of_residency, home_ownership_type, installation_date, registration_date) 
                   VALUES ('$id', '$username', '$plainPassword', '$user[subscription_plan]', '$fullname', '$user[birth_date]', '$address', '$user[contact_number]', '$user[email_address]', '$user[id_type]', '$user[id_number]', '$user[id_photo]', '$user[proof_of_residency]', '$user[home_ownership_type]', '$user[installation_date]', NOW())";

                if ($conn->query($insertQuery) === TRUE) {
                    // Send email with the plain password
                    // sendApprovalEmail($user['email_address'], $username, $plainPassword);
                    echo json_encode(["success" => true, "message" => "User approved and inserted."]);
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

// //for php mailer i will comment  this now
// // ✅ Function to send email with username and password
// function sendApprovalEmail($email, $username, $password) {
//     $subject = "Your Account Has Been Approved!";
//     $message = "Hello,\n\nYour account has been approved.\n\nUsername: $username\nPassword: $password\n\nPlease change your password after logging in.";
//     $headers = "From: no-reply@yourwebsite.com";

//     mail($email, $subject, $message, $headers);
// }
?>
