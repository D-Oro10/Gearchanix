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
