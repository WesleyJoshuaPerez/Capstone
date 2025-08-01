<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

require_once 'connectdb.php'; // for datbase connection

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $response = ["status" => "error", "title" => "Error!", "message" => "Something went wrong."];

    $code = $_POST['code'];
    $email = $_POST['email'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    $stmt = $conn->prepare("SELECT user_id, role FROM resetpass_request WHERE reset_token = ? AND email_address = ?");
    $stmt->bind_param("ss", $code, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $user_id = $row['user_id'];
        $role = $row['role'];

        if ($new_password === $confirm_password) {
            $hashed_password = md5($new_password);

            if ($role === 'user') {
                $updateStmt = $conn->prepare("UPDATE approved_user SET password = ? WHERE email_address = ?");
            } elseif ($role === 'admin') {
                $updateStmt = $conn->prepare("UPDATE lynx_admin SET password = ? WHERE email_address = ?");
            } else {
                $response["message"] = "Invalid user role.";
                echo json_encode($response);
                exit();
            }

            $updateStmt->bind_param("ss", $hashed_password, $email);
            $updateStmt->execute();

            if ($updateStmt->affected_rows > 0) {
                $deleteStmt = $conn->prepare("DELETE FROM resetpass_request WHERE reset_token = ?");
                $deleteStmt->bind_param("s", $code);
                $deleteStmt->execute();

                $response = [
                    "status" => "success",
                    "title" => "Success!",
                    "message" => "Password updated successfully!",
                    "redirect" => "https://lynxfiberinternet.com/login.html"

                ];
            } else {
                $response["message"] = "Failed to update password.";
            }
        } else {
            $response["message"] = "Passwords do not match.";
        }
    } else {
        $response["message"] = "Invalid reset token or email address.";
    }

    echo json_encode($response);
}
?>
