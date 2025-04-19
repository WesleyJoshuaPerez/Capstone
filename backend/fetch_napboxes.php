<?php
require_once 'connectdb.php';

$sql = "SELECT * FROM nap_box_availability";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $napBoxes = [];
    while ($row = $result->fetch_assoc()) {
        $napBoxes[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $napBoxes]);
} else {
    echo json_encode(['success' => false, 'message' => 'No NapBox records found.']);
}

$conn->close();
?>
