<?php
require_once 'connectdb.php';

$nap_box_id = (int)$_GET['nap_box_id'];

// Get the current status
$sql = "SELECT nap_box_status FROM nap_box_availability WHERE nap_box_id = $nap_box_id";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $new_status = ($row['nap_box_status'] === 'Enabled') ? 'Disabled' : 'Enabled';

    // Update the status
    $updateSql = "UPDATE nap_box_availability SET nap_box_status = '$new_status' WHERE nap_box_id = $nap_box_id";
    if ($conn->query($updateSql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'NapBox not found.']);
}

$conn->close();
?>
