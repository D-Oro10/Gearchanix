<?php
// Database credentials
$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';

// Establish connection
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    // Fetch reservation details based on reservation_ID
    $reservation_ID = $_GET['id'];
    
    $sql = "SELECT * FROM client_reservation WHERE reservation_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $reservation_ID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode($data); // Return JSON response
    } else {
        echo json_encode(['message' => 'Reservation not found']);
    }

    $stmt->close();

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['id'])) {
    // Update reservation based on reservation_ID
    $reservation_ID = $_GET['id'];
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

    // Check if a file was uploaded for passenger_manifest
    $manifest_path = null;
    if (isset($_FILES['passenger_manifest']) && $_FILES['passenger_manifest']['error'] == UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/manifests/';
        // Create the upload directory if it doesn't exist
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        $manifest_path = $upload_dir . basename($_FILES['passenger_manifest']['name']);
        move_uploaded_file($_FILES['passenger_manifest']['tmp_name'], $manifest_path);
    } else {
        // If no new file uploaded, keep the old manifest file
        $sql = "SELECT passenger_manifest FROM client_reservation WHERE reservation_ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $reservation_ID);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $manifest_path = $row['passenger_manifest'];
        $stmt->close();
    }

    // Update the reservation record
    $sql = "UPDATE client_reservation SET vehicle_type=?, reservation_date=?, location=?, duration=?, time_departure=?, no_passengers=?, office_dept=?, email=?, contact_no=?, service_type=?, purpose=?, passenger_manifest=? WHERE reservation_ID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssissssssssi', $vehicle_type, $reservation_date, $location, $duration, $time_departure, $no_passengers, $office_dept, $email, $contact_no, $service_type, $purpose, $manifest_path, $reservation_ID);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>