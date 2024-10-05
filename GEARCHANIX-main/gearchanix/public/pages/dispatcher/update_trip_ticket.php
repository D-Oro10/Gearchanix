<?php
$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tripTicketID = $_POST['trip_ticketID'];
    $gasTank = $_POST['gas_tank'];
    $purchasedGas = $_POST['purchased_gas'];
    $totalGas = $_POST['total'];
    $startOdometer = $_POST['start_odometer'];
    $endOdometer = $_POST['end_odometer'];
    $KMUsed = $_POST['KM_used'];
    $RFIDEasy = $_POST['RFID_Easy'];
    $RFIDAuto = $_POST['RFID_Auto'];
    $oilUsed = $_POST['oil_used'];
    $plateNum = $_POST['plate_num'];

    $stmt = $conn->prepare("UPDATE trip_ticket SET gas_tank=?, purchased_gas=?, total=?, start_odometer=?, end_odometer=?, KM_used=?, RFID_Easy=?, RFID_Auto=?, oil_used=?, plate_num=? WHERE trip_ticketID=?");
    $stmt->bind_param("ddddddssssi", $gasTank, $purchasedGas, $totalGas, $startOdometer, $endOdometer, $KMUsed, $RFIDEasy, $RFIDAuto, $oilUsed, $plateNum, $tripTicketID);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update trip ticket.']);
    }

    $stmt->close();
}
$conn->close();
?>
