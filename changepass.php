<?php
error_reporting(E_ALL); // Report all PHP errors
ini_set('display_errors', 1); // Display errors in the browser
session_start();

// Database connection
$conn = new mysqli('localhost', 'root', '', 'lynx'); // Update with your database credentials

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update'])) {
    $code = $_POST['code'];
    $email = $_POST['email'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    // Check if the reset token is valid
    $stmt = $conn->prepare("SELECT * FROM resetpass_request WHERE reset_token = ? AND email_address = ?");
    $stmt->bind_param("ss", $code, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Validate password confirmation
        if ($new_password === $confirm_password) {
            // Hash the new password
            $hashed_password = $new_password; // Stores password in plain text (insecure)

            // Update password in the database
            $updateStmt = $conn->prepare("UPDATE approved_user SET password = ? WHERE email_address = ?");
            $updateStmt->bind_param("ss", $hashed_password, $email);
            $updateStmt->execute();

            if ($updateStmt->affected_rows > 0) {
                // Password updated successfully
                echo "<script>
                    console.log('SweetAlert2 script reached'); // Debugging line
                    Swal.fire({
                        title: 'Success!',
                        text: 'Password updated successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = 'http://localhost:8080/Capstone/login.html';
                        }
                    });
                </script>";
                exit();
            } else {
                // Failed to update password
                echo "<script>
                    console.log('SweetAlert2 script reached'); // Debugging line
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to update password.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                </script>";
            }
        } else {
            // Passwords do not match
            echo "<script>
                console.log('SweetAlert2 script reached'); // Debugging line
                Swal.fire({
                    title: 'Error!',
                    text: 'Passwords do not match.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            </script>";
        }
    } else {
        // Invalid reset token or email address
        echo "<script>
            console.log('SweetAlert2 script reached'); // Debugging line
            Swal.fire({
                title: 'Error!',
                text: 'Invalid reset token or email address.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        </script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Change Password</title>
    <link rel="stylesheet" href="frontend/styles/changepass.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="icon" type="image/x-icon" href="frontend/assets/images/icons/lynxicon.ico" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="scripts/passwordhider.js" defer></script>
  </head>
  <body>
    <div class="change-password-container">
      <div class="logo">
        <img src="frontend/assets/images/logos/lynxlogo.png" alt="Lynx Logo" />
      </div>
      
      <form action="changepass.php" method="post">
        <!-- Fix: Properly escape the PHP variable and close the input tag -->
        <input type="hidden" name="code" value="<?php echo htmlspecialchars($_GET['code']); ?>" />

        <div class="form-container">
          <h1>CHANGE PASSWORD</h1>
          <div class="input_group">
            <label for="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter Email Address" class="email-input" name="email" required />
          </div>

          <div class="input_group">
            <label for="new-password">New Password</label>
            <div class="password-wrapper">
              <input type="password" id="new-password" placeholder="Enter New Password" class="email-input" name="new_password" required />
              <span class="toggle-password" onclick="togglePasswords()">
                <i class="fa-solid fa-eye"></i>
              </span>
            </div>
          </div>

          <div class="input_group">
            <label for="confirm-password">Confirm Password</label>
            <div class="password-wrapper">
              <input type="password" id="confirm-password" placeholder="Enter Confirm Password" class="email-input" name="confirm_password" required />
              <span class="toggle-password" onclick="togglePasswords()">
                <i class="fa-solid fa-eye"></i>
              </span>
            </div>
          </div>

          <button type="submit" class="update-button" name="update" id="update_button">UPDATE PASSWORD</button>
        </div>
      </form>
    </div>
  </body>
</html>