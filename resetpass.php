 <?php
session_start(); // Start the session to use $_SESSION

// Import necessary PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'backend/PHPMailer/src/Exception.php';
require 'backend/PHPMailer/src/PHPMailer.php';
require 'backend/PHPMailer/src/SMTP.php';

if (isset($_SESSION['status'])) {
    ?>
    <div class="alert alert-success">
        <h5><?php echo $_SESSION['status']; ?></h5>
    </div>
    <?php
    unset($_SESSION['status']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <link rel="shortcut icon" type="x-icon" href="logo/logo.png">
    <link rel="stylesheet" href="frontend/styles/resetpass.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <div class="reset-password-container">
        <h1>RESET PASSWORD</h1>
        <div class="form-container">
            <form action="" method="POST">
                <label for="email" class="email-label">Email Address</label>
                <input type="email" name="email" placeholder="Enter Email Address" class="email-input" required>
                <button type="submit" name="password_reset_link" class="reset-button">Send Password Reset Link</button>
            </form>
        </div>
    </div>

    <?php
    if (isset($_POST['password_reset_link'])) {
        $email = $_POST['email'];

        $mail = new PHPMailer(true); // Initialize PHPMailer

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // Gmail SMTP server
            $mail->SMTPAuth = true;
            $mail->Username = 'noreplylynxfiber@gmail.com'; // Your Gmail address
            $mail->Password = 'pkeq usho jsfe piqw'; // Your generated app password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Encryption method
            $mail->Port = 587; // Port for sending emails

            // Enable debugging
            $mail->SMTPDebug = 2; // Set SMTP debug level to 2 for verbose output
            $mail->Debugoutput = 'html'; // Set the output format to HTML to see it clearly

            // Recipients
            $mail->setFrom('noreplylynxfiber@gmail.com', 'Lynx Fiber');
            $mail->addAddress($email); // Add the recipient email address

            // Generate a unique verification code
            $code = substr(str_shuffle('1234567890QWERTYUIOPASDFGHJKLZXCVBNM'), 0, 10);

            // Establish database connection
            $conn = new mysqli('localhost', 'root', '', 'lynx'); // Your database connection details
            if ($conn->connect_error) {
                die('Could not connect to the database.');
            }

            // Check if email exists in your table
            $stmt = $conn->prepare("SELECT user_id FROM approved_user WHERE email_address = ?");
            if ($stmt) {
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();

                $user_id = null;

                if ($result->num_rows > 0) {
                    // User email found
                    $row = $result->fetch_assoc();
                    $user_id = $row['user_id']; // Get the user ID from the database
                }

                if ($user_id) {
                    // Insert data into your reset pass request table
                    $request_date = date('Y-m-d H:i:s');
                    $insertStmt = $conn->prepare("INSERT INTO resetpass_request (reset_token, email_address, request_date, user_id) VALUES (?, ?, ?, ?)");
                    if ($insertStmt) {
                        $insertStmt->bind_param("sssi", $code, $email, $request_date, $user_id);
                        $insertStmt->execute();

                        // Send email
                        $mail->isHTML(true);
                        $mail->Subject = 'Password Reset';
                        $mail->Body    = 'To reset your password, click the link here ------> <a href="http://localhost:/Capstone/changepass.php?code='.$code.'">Reset Password</a>.<br>This link will expire in 24 hours.';
                        
                        // Attempt to send the email
                        if($mail->send()) {
                            $alertTitle = 'Email Sent!';
                            $alertText = 'Password reset link has been sent to your email address, please check your email if not double check on the spam folder.';
                            $redirectUrl = 'http://gmail.com';
                        } else {
                            throw new Exception('Email not sent.');
                        }
                    }
                    // Close insert statement
                    $insertStmt->close();
                } else {
                    // Email not found, show SweetAlert and stop further execution
                    echo "<script>
                        Swal.fire({
                            title: 'Email Not Found!',
                            text: 'The email address does not exist in our records.',
                            icon: 'error'
                        });
                    </script>";
                    exit(); // Stop further execution
                }

                // Close user statement
                $stmt->close();
            }

            // Clean up
            $conn->close();
        } catch (Exception $e) {
            $alertTitle = 'Error!';
            $alertText = 'Could not send email. Error: ' . $mail->ErrorInfo;
            $redirectUrl = 'resetmail.php'; // Adjust redirect URL as needed
        }

        // Output SweetAlert2 script for feedback (only if email was found and sent)
        if (isset($alertTitle)) {
            echo "<script>
                Swal.fire({
                    title: '$alertTitle',
                    text: '$alertText',
                    icon: '" . ($user_id ? 'success' : 'error') . "' 
                }).then((result) => {
                    if (result.isConfirmed && '$redirectUrl') {
                        window.location.href = '$redirectUrl';
                    }
                });
            </script>";
        }
    }
    ?>
</body>
</html>