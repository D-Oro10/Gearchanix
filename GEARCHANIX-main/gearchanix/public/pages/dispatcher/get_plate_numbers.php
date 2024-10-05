<?php
$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

if (isset($_GET['vehicle_type'])) {
    $vehicleType = $_GET['vehicle_type'];
    $stmt = $conn->prepare("SELECT plate_num FROM vehicles WHERE vehicle_type = ?");
    $stmt->bind_param("s", $vehicleType);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $plateNumbers = [];
    while ($row = $result->fetch_assoc()) {
        $plateNumbers[] = $row;
    }

    echo json_encode(['success' => true, 'plate_numbers' => $plateNumbers]);

    $stmt->close();
}
$conn->close();
?>
