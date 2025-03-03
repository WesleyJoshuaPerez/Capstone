<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connectdb.php';

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to select only approved applications
$sql = "SELECT id, subscription_plan, first_name, last_name, contact_number, email_address, birth_date, id_type, id_number, id_photo, home_ownership_type, province, municipality, barangay, proof_of_residency, installation_date, registration_date 
        FROM registration_acc 
        WHERE status = 'Pending'"; // Filtering by status

$result = $conn->query($sql);

if (!$result) {
    die("Query failed: " . $conn->error);
}

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<tr data-user='" . htmlspecialchars(json_encode($row), ENT_QUOTES, 'UTF-8') . "'>
                <td>{$row['id']}</td>
                <td>{$row['subscription_plan']}</td>
                <td>{$row['first_name']}</td>
                <td>{$row['last_name']}</td>
                <td>{$row['contact_number']}</td>
              </tr>";
    }
} else {
    echo "<tr><td colspan='5'>No approved records found.</td></tr>";
}

$conn->close();
?>
