<?php
// Check if the server is localhost this if else statement use so the code can work live or localhost
if ($_SERVER['HTTP_HOST'] === 'localhost') {
    // Localhost database credentials
    $host = "localhost";
    $user = "root";  
    $pass = "";      
    $db   = "lynx"; 
} else {
    // Hostinger database credentials
    $host = "localhost";  
    $user = "u242690062_lynx";
    $pass = "Capstonelynx2025";
    $db   = "u242690062_lynx";
}

// Create a new mysqli connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
