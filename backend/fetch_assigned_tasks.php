<?php
session_start();
require 'connectdb.php';

if (!isset($_SESSION['techName'])) {
    echo "<tr><td colspan='8'>You are not logged in.</td></tr>";
    exit;
}

$techName = trim($_SESSION['techName']);
$techName = $conn->real_escape_string($techName);

// Count the total number of assigned maintenance tasks for the logged-in technician
$assignedTasksQuery = $conn->prepare("
    SELECT COUNT(*) as total 
    FROM maintenance_requests 
    WHERE TRIM(technician_name) = ? AND status = 'assigned'
");
$assignedTasksQuery->bind_param("s", $techName);
$assignedTasksQuery->execute();
$response["assignedtasks"] = $assignedTasksQuery->get_result()->fetch_assoc()["total"];

// Fetch all tasks for this technician
$sql = "SELECT user_id, full_name, contact_number, address, issue_type, issue_description, contact_time, status 
        FROM maintenance_requests 
        WHERE TRIM(technician_name) = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo "<tr><td colspan='8'>Database error: " . $conn->error . "</td></tr>";
    exit;
}

$stmt->bind_param("s", $techName);
$stmt->execute();
$result = $stmt->get_result();

$output = "";

if ($result->num_rows > 0) {
    // Check if all tasks are "Completed"
    $allCompleted = true;
    $taskRows = [];

    while ($row = $result->fetch_assoc()) {
        if (strtolower(trim($row['status'])) !== 'completed') {
            $allCompleted = false;
        }
        $taskRows[] = $row; // store to reuse later
    }

    if ($allCompleted) {
       $output .= "
<tr>
  <td colspan='8' style='text-align: center; padding: 30px;'>
    <div style='display: inline-block;'>
      <i class='fas fa-user fa-3x' style='margin-bottom: 10px; color: #3775b9;'></i>
      <div style='font-size: 16px; color: #888;'>No assigned tasks found.</div>
    </div>
  </td>
</tr>";

    } else {
        foreach ($taskRows as $row) {
            $status = strtolower(trim($row['status']));
          if ($status === 'completed' || $status === 'viewed') continue; // skip completed and viewed


            $output .= "<tr>";
            $output .= "<td>" . htmlspecialchars($row['user_id']) . "</td>";
            $output .= "<td>" . htmlspecialchars($row['full_name']) . "</td>";
            $output .= "<td>" . htmlspecialchars($row['contact_number']) . "</td>";
            $output .= "<td>" . htmlspecialchars($row['address']) . "</td>";
            $output .= "<td>" . htmlspecialchars($row['issue_type']) . "</td>";
            $output .= "<td>" . htmlspecialchars($row['issue_description']) . "</td>";
            $output .= "<td>" . htmlspecialchars($row['contact_time']) . "</td>";
            $output .= "<td>
                          <div class='btn-group'>
                            <button class='progress-report-btn' data-userid='" . htmlspecialchars($row['user_id']) . "'>Progress Report</button>
                            <button class='completion-form-btn' data-userid='" . htmlspecialchars($row['user_id']) . "'>Completion Report</button>
                          </div>
                        </td>";
            $output .= "</tr>";
        }
    }
} else {
  $output .= "
<tr>
  <td colspan='8' style='text-align: center; padding: 30px;'>
    <div style='display: inline-block;'>
      <i class='fas fa-user fa-3x' style='margin-bottom: 10px; color: #3775b9;'></i>
      <div style='font-size: 16px; color: #888;'>No assigned tasks found.</div>
    </div>
  </td>
</tr>";

}

echo $output;

// Assigned task counter (if needed on frontend)
//echo "<div id='assignedTaskBox'>
//        <h3>Assigned Tasks: <span>" . $response["assignedtasks"] . "</span></h3>
//      </div>";

$stmt->close();
$conn->close();
?>
