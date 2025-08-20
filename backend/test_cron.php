<?php
// tests locally, try easycron to test live 
// check how u can schedule the sms live 
// test_cron.php
date_default_timezone_set('Asia/Manila'); // set timezone to PH

while (true) {
    $now = date('H:i');
    
    // Check if it's exactly 9:00 AM the time is military time
    if ($now === '15:46') {
        echo "Running reminder script at " . date('Y-m-d H:i:s') . "\n";
        
        // Run your reminder script
        include "send_reminders.php"; 
        
        // Sleep for 61 seconds to avoid sending multiple SMS in the same minute
        sleep(61);
    } else {
        // Just wait 30 seconds before checking again
        sleep(30);
    }
}
