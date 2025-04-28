<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';
header("Content-Type: application/json");

// Define the upload directory for profile images
$uploadDir = '../frontend/assets/images/technicians/';

// --- Action Handling ---
// First, try to get 'action' from POST data (form submissions),
// If not available in POST, try to get 'action' from GET parameters (URL),
// If still not found, default to 'fetch'.
$action = $_POST['action'] ?? $_GET['action'] ?? 'fetch';

// Check database connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// --- Fetch Technicians ---
if ($action === 'fetch') {
    // Fetch technicians from database
    $sql = "SELECT * FROM lynx_technicians";
    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
        exit;
    }

    $technicians = [];

    while ($row = $result->fetch_assoc()) {
        $technicians[] = [
            "id" => $row["technician_id"],
            "name" => $row["name"],
            "role" => $row["role"],
            "contact" => $row["contact"],
            "status" => $row["status"],
            "profile_image" => $row["profile_image"]
        ];
    }

    // Return the technician list as JSON
    echo json_encode(["success" => true, "data" => $technicians], JSON_UNESCAPED_UNICODE);

} elseif ($action === 'add') {
    // --- Add a New Technician ---
    // Handle profile image upload
    if (isset($_FILES['profileImage'])) {
        $fileName = basename($_FILES['profileImage']['name']);
        $targetFile = $uploadDir . $fileName;

        // Create the upload directory if it doesn't exist
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Move the uploaded file to the target directory
        if (!move_uploaded_file($_FILES['profileImage']['tmp_name'], $targetFile)) {
            echo json_encode(["success" => false, "error" => "Failed to upload profile image."]);
            exit;
        }
    } else {
        // If no file is uploaded, use a default profile image
        $fileName = 'default_profile.jpg';
    }

    // Sanitize and prepare input data
    $name = $conn->real_escape_string($_POST['name']);
    $username = $conn->real_escape_string($_POST['username']);
    $password = $conn->real_escape_string($_POST['password']); // Get the raw password
    $hashedPassword = md5($password); // MD5 hash the password
    $role = $conn->real_escape_string($_POST['role']);
    $contact = $conn->real_escape_string($_POST['contact']);
    $profileImage = $conn->real_escape_string($fileName);

    // Insert technician data into the database
    $sql = "INSERT INTO lynx_technicians (name, username, password, role, contact, profile_image) 
            VALUES ('$name', '$username', '$hashedPassword', '$role', '$contact', '$profileImage')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Technician added successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Error adding technician: " . $conn->error]);
    }
}

// Close the database connection
$conn->close();
?>
