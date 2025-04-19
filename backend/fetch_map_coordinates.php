<?php
include 'connectdb.php';

header("Content-Type: application/json");

// Fetch coordinates for users
$sql_users = "SELECT * FROM approved_user WHERE address_latitude IS NOT NULL AND address_longitude IS NOT NULL";
$result_users = $conn->query($sql_users);

$users = [];
if ($result_users->num_rows > 0) {
    while ($row = $result_users->fetch_assoc()) {
        $users[] = [
            'type' => 'user',  // Indicate this is a user marker
            'username' => $row['username'],
            'fullname' => $row['fullname'],
            'latitude' => $row['address_latitude'],
            'longitude' => $row['address_longitude'],
            'subscription_plan' => $row['subscription_plan'],
        ];
    }
}

// Fetch coordinates for NapBoxes
$sql_napboxes = "SELECT * FROM nap_box_availability WHERE nap_box_latitude IS NOT NULL AND nap_box_longitude IS NOT NULL";
$result_napboxes = $conn->query($sql_napboxes);

$napboxes = [];
if ($result_napboxes->num_rows > 0) {
    while ($row = $result_napboxes->fetch_assoc()) {
        $napboxes[] = [
            'type' => 'napbox',  // Indicate this is a NapBox marker
            'barangay' => $row['nap_box_brgy'],
            'latitude' => $row['nap_box_latitude'],
            'longitude' => $row['nap_box_longitude'],
            'available_slots' => $row['available_slots'],
            'status' => $row['nap_box_status'],
        ];
    }
}

// Combine both user and NapBox data into one array
$locations = array_merge($users, $napboxes);

// Return the combined data as a JSON response
echo json_encode($locations);

$conn->close();
?>
