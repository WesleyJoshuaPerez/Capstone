<?php
// Turn off HTML error output
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Include database connection
    require_once 'connectdb.php';
    
    // Get and decode JSON input
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    // Check if JSON was valid
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON input: ' . json_last_error_msg());
    }
    
    // Validate required fields
    if (empty($data['nap_box_brgy']) || 
        !isset($data['available_slots']) || 
        !isset($data['nap_box_longitude']) || 
        !isset($data['nap_box_latitude'])) {
        throw new Exception('Missing required fields');
    }
    
    // Sanitize and retrieve data
    $brgy = $conn->real_escape_string($data['nap_box_brgy']);
    $slots = (int)$data['available_slots'];
    $longitude = (float)$data['nap_box_longitude'];
    $latitude = (float)$data['nap_box_latitude'];

    // Generate new 10-digit nap_box_id
    $result = $conn->query("SELECT nap_box_id FROM nap_box_availability ORDER BY nap_box_id DESC LIMIT 1");

    if ($result && $row = $result->fetch_assoc()) {
        $lastId = (int)$row['nap_box_id'];
        $newId = str_pad($lastId + 1, 10, '0', STR_PAD_LEFT);
    } else {
        $newId = str_pad(1, 10, '0', STR_PAD_LEFT);
    }

    // Insert into the database
    $sql = "INSERT INTO nap_box_availability 
            (nap_box_id, nap_box_brgy, available_slots, nap_box_longitude, nap_box_latitude)
            VALUES ('$newId', '$brgy', $slots, $longitude, $latitude)";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'nap_box_id' => $newId]);
    } else {
        throw new Exception('Database error: ' . $conn->error);
    }
    
} catch (Exception $e) {
    // Return any errors as JSON
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    // Close connection if it exists
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>
