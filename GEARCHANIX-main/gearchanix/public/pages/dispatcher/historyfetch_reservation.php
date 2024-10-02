<?php
header('Content-Type: application/json');

$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


// Fetch data from client_reservation table to show those approved/rejected reservations
$sql = "SELECT reservation_ID, vehicle_type, reservation_date, location, duration, 
        TIME_FORMAT(time_departure, '%h:%i %p') AS time_departure, 
        no_passengers, office_dept, email, contact_no, service_type, purpose, passenger_manifest, reservation_status
        FROM client_reservation 
        WHERE reservation_status IN ('Approved', 'Rejected')";

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

// Deletion request
if (isset($_GET['del_reserve'])) {
    $reservation_ID = $_GET['del_reserve'];

    // Delete the reservation from the database
    $sql = "DELETE FROM client_reservation WHERE reservation_ID='$reservation_ID'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['status' => 'success', 'message' => 'Reservation deleted successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error deleting reservation: ' . $conn->error]);
    }
    $conn->close();
    exit();
}

// Close connection
$conn->close();

// Return data as JSON
echo json_encode($reservations);
?>
