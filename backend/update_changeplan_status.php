<?php
include 'connectdb.php'; // Ensure you include your DB connection

// Get JSON data from request
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['change_plan_id'], $data['user_id'], $data['status'])) {
    $change_plan_id = intval($data['change_plan_id']);
    $user_id = $data['user_id']; // user_id is VARCHAR
    $status = $data['status'];
    $new_plan = isset($data['new_plan']) ? $data['new_plan'] : null;
    $price = isset($data['price']) ? intval($data['price']) : null; // Make sure it's INT

    // Get current date and time
    $current_date = date('Y-m-d H:i:s');

    // Update the status and approved_date (if status is Approved)
    if ($status === 'Approved') {
        $query = "UPDATE change_plan_application SET status = ?, approved_date = ? WHERE change_plan_id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssis", $status, $current_date, $change_plan_id, $user_id);
    } else {
        $query = "UPDATE change_plan_application SET status = ? WHERE change_plan_id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sis", $status, $change_plan_id, $user_id);
    }

    if ($stmt->execute()) {
        // If approved, update the user's plan in approved_user
        if ($status === 'Approved' && $new_plan) {
            $updateUserPlan = "UPDATE approved_user SET subscription_plan = ?, currentBill = ?, installation_date = ? WHERE user_id = ?";
            $stmt2 = $conn->prepare($updateUserPlan);
            $stmt2->bind_param("siss", $new_plan, $price, $current_date, $user_id);
            $stmt2->execute();
            $stmt2->close();
        }

        echo json_encode(["success" => true, "message" => "Change plan updated successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Database update failed."]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request parameters."]);
}

$conn->close();
?>
