<?php
// editvehicle.php
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

// Check for GET request to fetch vehicle details
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    // Fetch vehicle details based on vehicle_ID
    $vehicle_ID = $_GET['id'];
    
    $sql = "SELECT * FROM vehicles WHERE vehicle_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $vehicle_ID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode($data); // Return JSON response
    } else {
        echo json_encode(['message' => 'Vehicle not found']);
    }

    $stmt->close();

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['vehicle_ID'])) {
    // Update vehicle details based on vehicle_ID
    $vehicle_ID = $_POST['vehicle_ID'];
    $query = "UPDATE vehicles SET vehicle_name=?, vehicle_model=?, vehicle_year=?, vehicle_vin=?, vehicle_type=?, plate_num=?, lifespan=?, current_meter=?, vehicle_remarks=? WHERE vehicle_ID=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssissssssi", $_POST['vehicle_name'], $_POST['vehicle_model'], $_POST['vehicle_year'], $_POST['vehicle_vin'], $_POST['vehicle_type'], $_POST['plate_num'], $_POST['lifespan'], $_POST['current_meter'], $_POST['vehicle_remarks'], $vehicle_ID);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update vehicle']);
    }

    $stmt->close();
}

// Close the connection
$conn->close();
?>
