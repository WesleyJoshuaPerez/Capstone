<?php
include 'connectdb.php';

header('Content-Type: application/json');

// Check if user_id is provided
if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
    echo json_encode(['error' => 'Missing or invalid user_id']);
    exit;
}

$user_id = $_GET['user_id']; // Assuming user_id is a string

// Prepare SQL statement
$stmt = mysqli_prepare($conn, "SELECT * FROM payments WHERE user_id = ? AND status IN ('Paid', 'Viewed')");

if (!$stmt) {
    echo json_encode(['error' => 'Failed to prepare the SQL statement']);
    exit;
}

mysqli_stmt_bind_param($stmt, "s", $user_id);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);
if (!$result) {
    echo json_encode(['error' => 'Database query failed: ' . mysqli_error($conn)]);
    exit;
}

$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}

// Close statement and connection
mysqli_stmt_close($stmt);
mysqli_close($conn);

// Return the rows as JSON
echo json_encode($rows);
?>