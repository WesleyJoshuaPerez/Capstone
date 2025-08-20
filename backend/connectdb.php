<?php
// Detect CLI like running php test_cron.php or localhost
$isCli = (php_sapi_name() === 'cli');

if ($isCli || (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === 'localhost')) {
    // Localhost (XAMPP)
    $host = "localhost";   
    $user = "root";  
    $pass = "";      
    $db   = "lynx"; 
} else {
    // Hostinger (Live)
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
