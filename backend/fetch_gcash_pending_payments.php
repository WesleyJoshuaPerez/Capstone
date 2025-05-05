<?php
// Database connection
include('connectdb.php'); // Ensure this connects $conn (MySQLi)

// Set JSON response header
header('Content-Type: application/json');

// SQL to fetch payments where mode_of_payment is 'Gcash' and status is 'Pending'
$sql = "SELECT *
        FROM payments 
        WHERE mode_of_payment = 'Gcash' AND status = 'Pending'";
$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Return the JSON response
echo json_encode(['status' => 'success', 'data' => $data]);
$conn->close();
?>