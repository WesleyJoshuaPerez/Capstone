<?php
include 'connectdb.php';

header("Content-Type: application/json");

// Query to fetch coordinates of users
$sql = "SELECT * FROM approved_user WHERE address_latitude IS NOT NULL AND address_longitude IS NOT NULL";
$result = $conn->query($sql);

$users = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);
$conn->close();
?>
