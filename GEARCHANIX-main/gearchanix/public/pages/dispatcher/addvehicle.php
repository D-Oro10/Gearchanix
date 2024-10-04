<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = '127.0.0.1'; // Adjust as necessary
$db_name = 'gearchanix';
$username = 'root';
$password = ''; // If there's no password, keep it as an empty string

$conn = new mysqli($host, $username, $password, $db_name);

// Check the connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve POST data
    $vehicle_name = $_POST['vehicle_name'] ?? '';
    $vehicle_model = $_POST['vehicle_model'] ?? '';
    $vehicle_year = $_POST['vehicle_year'] ?? '';
    $vehicle_vin = $_POST['vehicle_vin'] ?? '';
    $vehicle_type = $_POST['vehicle_type'] ?? '';
    $plate_num = $_POST['plate_num'] ?? '';
    $lifespan = $_POST['lifespan'] ?? '';
    $current_meter = $_POST['current_meter'] ?? '';
    $vehicle_status = $_POST['vehicle_status'] ?? '';

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_model, vehicle_year, vehicle_vin, vehicle_type, plate_num, lifespan, current_meter, vehicle_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    if ($stmt === false) {
        die(json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("sssssssss", $vehicle_name, $vehicle_model, $vehicle_year, $vehicle_vin, $vehicle_type, $plate_num, $lifespan, $current_meter, $vehicle_status);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Vehicle added successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error adding vehicle: " . $stmt->error]);
    }

    // Close statement and connection
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

$conn->close();
?>
