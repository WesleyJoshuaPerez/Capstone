<?php
include 'connectdb.php';
header("Content-Type: application/json");

// Fetch coordinates for users along with barangay from nap_box_availability
$sql_users = "
    SELECT 
        au.username,
        au.fullname,
        au.address_latitude,
        au.address_longitude,
        au.subscription_plan,
        nba.nap_box_brgy AS barangay
    FROM approved_user au
    LEFT JOIN nap_box_availability nba ON au.nap_box_id = nba.nap_box_id
    WHERE au.address_latitude IS NOT NULL AND au.address_longitude IS NOT NULL
";
$result_users = $conn->query($sql_users);

$users = [];
if ($result_users->num_rows > 0) {
    while ($row = $result_users->fetch_assoc()) {
        $users[] = [
            'type' => 'user',
            'username' => $row['username'],
            'fullname' => $row['fullname'],
            'latitude' => $row['address_latitude'],
            'longitude' => $row['address_longitude'],
            'subscription_plan' => $row['subscription_plan'],
            'barangay' => $row['barangay'] // Now included
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
            'type' => 'napbox',
            'barangay' => $row['nap_box_brgy'],
            'latitude' => $row['nap_box_latitude'],
            'longitude' => $row['nap_box_longitude'],
            'available_slots' => $row['available_slots'],
            'status' => $row['nap_box_status'],
        ];
    }
}

// Combine both user and NapBox data
$locations = array_merge($users, $napboxes);

// Return the combined data
echo json_encode($locations);
$conn->close();
?>
