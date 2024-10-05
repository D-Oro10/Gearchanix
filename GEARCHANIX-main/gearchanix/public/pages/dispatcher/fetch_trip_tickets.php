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

// Fetch data from trip_ticket table
$query = "SELECT trip_ticket_date, vehicle_type, plate_num, gas_tank, purchased_gas, total, start_odometer, end_odometer, KM_used, RFID_Easy, RFID_Auto, oil_used FROM trip_ticket";
$result = $conn->query($query);

$trip_tickets = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $trip_tickets[] = $row;
    }
}

// Return the data as a JSON response
echo json_encode(['success' => true, 'data' => $trip_tickets]);

$conn->close();
?>
