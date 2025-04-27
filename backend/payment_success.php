<?php
session_start();
include('connectdb.php');

$status = $_GET['status'] ?? null;

if ($status === 'success') {
    $user_id = $_SESSION['user_id'] ?? null;
    if (!$user_id) {
        die("Unauthorized access");
    }

    $today = date('Y-m-d');

    // Update currentBill to 0, set payment status to 'paid', and log last payment date
    $update = mysqli_prepare($conn, "UPDATE approved_user SET currentBill = 0, payment_status = 'paid', last_payment_date = ? WHERE user_id = ?");
    mysqli_stmt_bind_param($update, "si", $today, $user_id);
    mysqli_stmt_execute($update);
    mysqli_stmt_close($update);

    header("Location: http://localhost/Github/Capstone/user_dashboard.html?paid=true");
    exit;
} elseif ($status === 'canceled') {
    header("Location: http://localhost/Github/Capstone/user_dashboard.html?status=canceled");
    exit;
} else {
    echo "Payment status not recognized.";
    exit;
}
?>
