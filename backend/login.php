<?php
session_start();
require 'connectdb.php'; // Include your database connection

// Process login if request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Validate input fields
    if (empty($username) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Username and password are required."]);
        exit;
    }

    // Function to check login in a given table
    function checkLogin($conn, $table, $idField, $username) {
        $query = "SELECT * FROM $table WHERE username = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            return null;
        }
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        return null;
    }

    // Try to log in as a regular user
    $user = checkLogin($conn, "approved_user", "user_id", $username);
    $is_admin = false;

    if (!$user) {
        // If not found, try to log in as an admin
        $user = checkLogin($conn, "admin_lynx", "admin_id", $username);
        $is_admin = $user ? true : false;
    }

    // If user is found, verify the password
    if ($user) {
        if ($password === $user['password']) {
            // Store entire user data in session
            $_SESSION['user_id'] = $user['user_id'] ?? $user['admin_id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['fullname'] = $user['fullname']; // Ensure 'fullname' is stored
            
            // Return JSON response with redirect URL based on user type
            if ($is_admin) {
                echo json_encode(["status" => "success", "message" => "Login successful.", "redirect" => "admin.html"]);
            } else {
                echo json_encode(["status" => "success", "message" => "Login successful.", "redirect" => "user_dashboard.html"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }

    $conn->close();
    exit;
}
?>
