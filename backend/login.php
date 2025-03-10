<?php
session_start();
require 'connectdb.php'; // Include database connection

// Ensure request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

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
    $query = "SELECT $idField, password FROM $table WHERE username = ?";
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

// If user is found
if ($user) {
    if ($password === $user['password']) {
        $_SESSION['user_id'] = $user['user_id'] ?? $user['admin_id']; // Store ID in session
        $_SESSION['username'] = $username;

        // Redirect admin users to admin.html
        if ($is_admin) {
            echo json_encode(["status" => "success", "message" => "Login successful.", "redirect" => "admin.html"]);
        } else {
            echo json_encode(["status" => "success", "message" => "Login successful.", "redirect" => "index.html"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
}

// Close connection
$conn->close();
?>
