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

// Fetch data from client_reservation table with formatting for time_departure in 12-hour format
$sql = "SELECT vehicle_type, reservation_date, location, duration, 
        TIME_FORMAT(time_departure, '%h:%i %p') AS time_departure, 
        no_passengers, office_dept, email, contact_no, service_type, purpose, passenger_manifest 
        FROM client_reservation";
$result = $conn->query($sql);

$reservations = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Check if there's a passenger manifest and convert BLOB to Base64
        if (!is_null($row['passenger_manifest'])) {
            $row['passenger_manifest'] = base64_encode($row['passenger_manifest']);
        }
        $reservations[] = $row;
    }
} 

// Close connection
$conn->close();

// Return data as JSON
echo json_encode($reservations);
?>
