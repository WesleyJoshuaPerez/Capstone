<?php
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

// Handle checkboxes (store "Checked" or "Unchecked")
$terms_agreed = isset($_POST['terms']) ? "Checked" : "Unchecked";
$data_processing_consent = isset($_POST['data-processing']) ? "Checked" : "Unchecked";
$id_photo_consent = isset($_POST['id-photo-consent']) ? "Checked" : "Unchecked";

// Handle file uploads
$target_dir = "uploads/";
if (!is_dir($target_dir)) { mkdir($target_dir, 0777, true); }

$id_photo_path = $target_dir . basename($_FILES["id_photo"]["name"]);
$proof_of_residency_path = $target_dir . basename($_FILES["proof_of_residency"]["name"]);

move_uploaded_file($_FILES["id_photo"]["tmp_name"], $id_photo_path);
move_uploaded_file($_FILES["proof_of_residency"]["tmp_name"], $proof_of_residency_path);

// Insert into database
$sql = "INSERT INTO registration_acc (
    subscription_plan, first_name, last_name, contact_number, email_address, 
    birth_date, id_type, id_number, id_photo, home_ownership_type, 
    province, municipality, barangay, proof_of_residency,
    installation_date, terms_agreed, data_processing_consent, id_photo_consent
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "ssssssssssssssssss",
    $subscription_plan, $first_name, $last_name, $contact_number, $email_address, 
    $birth_date, $id_type, $id_number, $id_photo_path, $home_ownership_type, 
    $province, $municipality, $barangay, $proof_of_residency_path, 
    $installation_date, $terms_agreed, $data_processing_consent, $id_photo_consent
);

$stmt->execute();
echo "Registration successful!";
$stmt->close();
$conn->close();
?>
