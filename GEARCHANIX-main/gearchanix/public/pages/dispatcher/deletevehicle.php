<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = '127.0.0.1';
$db_name = 'gearchanix';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $vehicle_id = $_DELETE['id'] ?? '';

    $stmt = $conn->prepare("DELETE FROM vehicles WHERE vehicle_ID = ?");
    if ($stmt === false) {
        die(json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("i", $vehicle_id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Vehicle deleted successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "No vehicle found with that ID."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting vehicle: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

$conn->close();
?>
