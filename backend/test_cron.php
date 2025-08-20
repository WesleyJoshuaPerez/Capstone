<?php
date_default_timezone_set('Asia/Manila');

echo "Running reminder script at " . date('Y-m-d H:i:s') . "\n";

// Call your SMS reminder logic
include "send_reminders.php";
