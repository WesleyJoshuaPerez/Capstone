<?php
// Enable output buffering to prevent blank pages
ob_start();

// Enable error reporting
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Database connection
$host = "localhost"; 
$username = "root"; 
$password = ""; 
$database = "lynx";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure all POST data is received
if (!isset($_POST['subscription_plan'])) {
    die("Error: Form data not received.");
}

// Retrieve and sanitize form data
$subscription_plan = $_POST['subscription_plan'];
$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$contact_number = $_POST['contact_number'];
$email_address = $_POST['email_address'];
$birth_date = date('Y-m-d', strtotime($_POST['birth_date']));
$id_type = $_POST['id_type'];
$id_number = $_POST['id_number'];
$home_ownership_type = $_POST['home_ownership_type'];
$province = $_POST['province'];
$municipality = $_POST['municipality'];
$barangay = $_POST['barangay'];
$installation_date = !empty($_POST['installation-date']) ? date('Y-m-d', strtotime($_POST['installation-date'])) : NULL; // Convert date

// Retrieve the address details if needed
$address_details = $_POST['address_details'] ?? "";

// Retrieve pinned coordinates from hidden fields, if provided
$latitude = $_POST['latitude'] ?? "";
$longitude = $_POST['longitude'] ?? "";

// Handle checkboxes (store "Checked" or "Unchecked")
$terms_agreed = isset($_POST['terms']) ? "Checked" : "Unchecked";
$data_processing_consent = isset($_POST['data-processing']) ? "Checked" : "Unchecked";
$id_photo_consent = isset($_POST['id-photo-consent']) ? "Checked" : "Unchecked";

// Handle file uploads
$target_dir1 = "../frontend/assets/images/uploads/Id_Photo/";
if (!is_dir($target_dir1)) { mkdir($target_dir1, 0777, true); }

$target_dir2 = "../frontend/assets/images/uploads/Proof_of_Residency/";
if (!is_dir($target_dir2)) { mkdir($target_dir2, 0777, true); }

// Extract only the filename
$id_photo_filename = basename($_FILES["id_photo"]["name"]);
$proof_of_residency_filename = basename($_FILES["proof_of_residency"]["name"]);

// Define full paths for moving the file
$id_photo_path = $target_dir1 . $id_photo_filename;
$proof_of_residency_path = $target_dir2 . $proof_of_residency_filename;

// Move uploaded files
move_uploaded_file($_FILES["id_photo"]["tmp_name"], $id_photo_path);
move_uploaded_file($_FILES["proof_of_residency"]["tmp_name"], $proof_of_residency_path);

// Update the INSERT query to include the pinned coordinates columns (address_latitude, address_longitude)
$sql = "INSERT INTO registration_acc (
    subscription_plan, first_name, last_name, contact_number, email_address, 
    birth_date, id_type, id_number, id_photo, home_ownership_type, 
    province, municipality, barangay, proof_of_residency,
    installation_date, terms_agreed, data_processing_consent, id_photo_consent,
    address_latitude, address_longitude
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "ssssssssssssssssssss", 
    $subscription_plan, $first_name, $last_name, $contact_number, $email_address, 
    $birth_date, $id_type, $id_number, $id_photo_filename, $home_ownership_type, 
    $province, $municipality, $barangay, $proof_of_residency_filename, 
    $installation_date, $terms_agreed, $data_processing_consent, $id_photo_consent, 
    $latitude, $longitude
);

// Execute Query and Show SweetAlert Message
if ($stmt->execute()) {
    echo '<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
              <style>
                  body {
                      font-family: "Open Sans", sans-serif !important;
                  }
              </style>
          </head>
          <body>
              <script>
                  Swal.fire({
                      icon: "success",
                      title: "Registration Successful!",
                      html: "<p style=\'font-family: Open Sans, sans-serif;\'>Your data has been successfully submitted.<br><br>Login credentials will be sent to your email within 1-2 working days.</p>",
                      confirmButtonText: "OK",
                      customClass: {
                          popup: "custom-font"
                      }
                  }).then(() => {
                      window.location.href = "../index.html"; // 
                  });
              </script>
          </body>
          </html>';
} else {
    echo '<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
              <style>
                  body {
                      font-family: "Open Sans", sans-serif !important;
                  }
              </style>
          </head>
          <body>
              <script>
                  Swal.fire({
                      icon: "error",
                      title: "Submission Failed",
                      html: "<p style=\'font-family: Open Sans, sans-serif;\'>There was an error submitting your data. Please try again.</p>",
                      confirmButtonText: "OK",
                      customClass: {
                          popup: "custom-font"
                      }
                  }).then(() => {
                      window.history.back(); // Redirect back to the form
                  });
              </script>
          </body>
          </html>';
}

$stmt->close();
$conn->close();

ob_end_flush();
?>
