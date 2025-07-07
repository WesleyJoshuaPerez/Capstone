<?php
$host = "localhost";
$user = "u242690062_lynx";
$pass = "Capstonelynx2025";
$db = "u242690062_lynx";

// Create a new mysqli connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
 
?>