<?php
header('Content-Type: application/json');

// Database credentials
$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';

// Establishing connection
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$reservation_ID = $_GET['id'];

// Get the form data
$vehicle_type = $_POST['vehicle_type'];
$reservation_date = $_POST['reservation_date'];
$location = $_POST['location'];
$duration = $_POST['duration'];
$time_departure = $_POST['time_departure'];
$no_passengers = $_POST['no_passengers'];
$office_dept = $_POST['office_dept'];
$email = $_POST['email'];
$contact_no = $_POST['contact_no'];
$service_type = $_POST['service_type'];
$purpose = $_POST['purpose'];

// Update the reservation in the database
$query = "UPDATE client_reservation SET vehicle_type = ?, reservation_date = ?, location = ?, duration = ?, time_departure = ?, no_passengers = ?, office_dept = ?, email = ?, contact_no = ?, service_type = ?, purpose = ? WHERE reservation_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sssissssssi", $vehicle_type, $reservation_date, $location, $duration, $time_departure, $no_passengers, $office_dept, $email, $contact_no, $service_type, $purpose, $reservation_ID);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}

$stmt->close();
$conn->close();
?>
