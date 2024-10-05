<?php
$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

if (isset($_GET['trip_ticketID'])) {
    $trip_ticketID = $_GET['trip_ticketID'];

    // Prepare and execute the query to fetch trip ticket details
    $query = "SELECT * FROM trip_ticket WHERE trip_ticketID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $trip_ticketID);  // 'i' for integer parameter
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the trip ticket exists
    if ($result->num_rows > 0) {
        $ticket = $result->fetch_assoc();

        // Return success response with trip ticket data
        echo json_encode([
            'success' => true,
            'ticket' => [
                'trip_ticketID' => $ticket['trip_ticketID'],
                'trip_ticket_date' => $ticket['trip_ticket_date'],
                'vehicle_type' => $ticket['vehicle_type'],
                'plate_num' => $ticket['plate_num'],
                'gas_tank' => $ticket['gas_tank'],
                'purchased_gas' => $ticket['purchased_gas'],
                'total' => $ticket['total'],
                'start_odometer' => $ticket['start_odometer'],
                'end_odometer' => $ticket['end_odometer'],
                'KM_used' => $ticket['KM_used'],
                'RFID_Easy' => $ticket['RFID_Easy'],
                'RFID_Auto' => $ticket['RFID_Auto'],
                'oil_used' => $ticket['oil_used']
            ]
        ]);
    } else {
        // Return error response if trip ticket not found
        echo json_encode([
            'success' => false,
            'message' => 'No trip ticket found with this ID.'
        ]);
    }

    $stmt->close();
} else {
    // Return error response if trip_ticketID is not provided
    echo json_encode([
        'success' => false,
        'message' => 'No trip_ticketID provided.'
    ]);
}

// Close the database connection
$conn->close();
?>
