<?php
session_start();
require 'connectdb.php'; // Include database connection

// Ensure request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

// Get and trim form data
$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

// Validate required fields
if (empty($username) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Username and password are required."]);
    exit;
}

function checkLogin($conn, $table, $idField, $username) {
    $query = "SELECT $idField, password FROM $table WHERE username = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        return null;
    }
    
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    
    return null;
}

$is_admin = false;
$is_technician = false;

// Try regular user login (approved_user table)
$user = checkLogin($conn, "approved_user", "user_id", $username);

if (!$user) {
    // Try admin login (lynx_admin table)
    $user = checkLogin($conn, "lynx_admin", "admin_id", $username);
    if ($user) {
        $is_admin = true;
    }
}

if (!$user) {
    // Try technician login (lynx_technicians table) with an extended query to get the name as well.
    $query = "SELECT technician_id, name, password FROM lynx_technicians WHERE username = ?";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result && $result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $is_technician = true;
            // Start session if not already started
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            // Store the technician's name in session variable
            $_SESSION['techName'] = $user['name'];
        }
        $stmt->close();
    }
}

if ($user) {
    // For production, replace this plaintext comparison with password_verify() if passwords are hashed.
    if ($password === $user['password']) {
        // Store the appropriate ID in session. The operator '??' picks the first non-null value.
        $_SESSION['user_id'] = $user['user_id'] ?? $user['admin_id'] ?? $user['technician_id'];
        $_SESSION['username'] = $username;
        
        // Choose redirect based on role.
        if ($is_admin) {
            echo json_encode([
                "status" => "success", 
                "message" => "Login successful.", 
                "redirect" => "admin.html"
            ]);
        } elseif ($is_technician) {
            echo json_encode([
                "status" => "success", 
                "message" => "Login successful.", 
                "redirect" => "technician_dashboard.html"
            ]);
        } else {
            echo json_encode([
                "status" => "success", 
                "message" => "Login successful.", 
                "redirect" => "user_dashboard.html"
            ]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
}

$conn->close();
?>
