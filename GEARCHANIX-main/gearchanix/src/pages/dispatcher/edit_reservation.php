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
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$reservation_ID= $_GET['id'];

// Fetch the reservation details from the database
$query = "SELECT * FROM client_reservation WHERE reservation_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $reservation_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row); // Return the data as JSON
} else {
    echo json_encode(['message' => 'No reservation found']);
}

$stmt->close();
$conn->close();
?>

