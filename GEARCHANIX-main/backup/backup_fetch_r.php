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

// Fetch data from client_reservation table with reservation_ID
$sql = "SELECT reservation_ID, vehicle_type, reservation_date, location, duration, 
        TIME_FORMAT(time_departure, '%h:%i %p') AS time_departure, 
        no_passengers, office_dept, email, contact_no, service_type, purpose, passenger_manifest, reservation_status 
        FROM client_reservation
        WHERE reservation_status = 'Pending'";

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

// deletion request
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



<?php
header('Content-Type: application/json');

$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['reservation_ID']) && isset($data['reservation_status'])) {
    $reservation_ID = $data['reservation_ID'];
    $reservation_status = $data['reservation_status'];

    // Prepare and bind
    $stmt = $conn->prepare("UPDATE client_reservation SET reservation_status = ? WHERE reservation_ID = ?");
    $stmt->bind_param("si", $reservation_status, $reservation_ID);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Reservation status updated successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating reservation status: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
}

// Close connection
$conn->close();
?>
