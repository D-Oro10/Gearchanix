<?php
// vehiclelist.php
$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Initialize an array to hold vehicle data
$vehicles = [];

// Handle the delete request
$data = json_decode(file_get_contents("php://input"));
if (isset($data->vehicle_id)) {
    $vehicle_id = $data->vehicle_id;

    $query = "DELETE FROM vehicles WHERE vehicle_ID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $vehicle_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete vehicle']);
    }
    $stmt->close();
    exit; // Exit after handling delete
}

// Fetch vehicle data
$query = "SELECT * FROM vehicles"; // Adjust the query as needed
$result = $conn->query($query);

if ($result->num_rows > 0) {
    // Fetch data for each vehicle
    while ($row = $result->fetch_assoc()) {
        $vehicles[] = $row; // Add each row to the vehicles array
    }
}

// Return the data as a JSON response
header('Content-Type: application/json');
echo json_encode($vehicles);

$conn->close(); // Close the database connection
?>
