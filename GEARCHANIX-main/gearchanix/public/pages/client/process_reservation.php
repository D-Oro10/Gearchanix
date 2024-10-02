<?php
// Database connection
$host = '127.0.0.1';
$dbname = 'gearchanix';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the form data
    $vehicle_type = $_POST['vehicle_type'];
    $reservation_date = $_POST['reservation_date']; // scheduled date
    $date = date("Y-m-d"); // current date as the reservation date
    $location = $_POST['location'];
    $duration = $_POST['duration'];
    $time_departure = $_POST['time_departure'];
    $purpose = $_POST['purpose'];
    $no_passengers = $_POST['no_passengers'];
    $office_dept = $_POST['office_dept'];
    $email = $_POST['email'];
    $contact_no = $_POST['contact_no'];
    $service_type = $_POST['service_type'];

    // Handle the uploaded file 
    $passenger_manifest = NULL;
    if (isset($_FILES['passenger_manifest']) && $_FILES['passenger_manifest']['size'] > 0) {
        $passenger_manifest = file_get_contents($_FILES['passenger_manifest']['tmp_name']);
    }

    // Step 1: Retrieve the vehicle_ID from the vehicles table based on the vehicle_type
    $stmt = $conn->prepare("SELECT vehicle_ID FROM vehicles WHERE vehicle_type = :vehicle_type LIMIT 1");
    $stmt->bindParam(':vehicle_type', $vehicle_type);
    $stmt->execute();
    $vehicle = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($vehicle) {
        $vehicle_ID = $vehicle['vehicle_ID']; // Assign the retrieved vehicle_ID

        // Step 2: Insert the reservation data into the client_reservation table
        $sql = "INSERT INTO client_reservation (
            vehicle_ID, vehicle_type, date, reservation_date, location, duration, time_departure, purpose, no_passengers, office_dept, email, contact_no, passenger_manifest, service_type
        ) VALUES (
            :vehicle_ID, :vehicle_type, :date, :reservation_date, :location, :duration, :time_departure, :purpose, :no_passengers, :office_dept, :email, :contact_no, :passenger_manifest, :service_type
        )";

        // Prepare the statement
        $stmt = $conn->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':vehicle_ID', $vehicle_ID);
        $stmt->bindParam(':vehicle_type', $vehicle_type);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':reservation_date', $reservation_date);
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':duration', $duration);
        $stmt->bindParam(':time_departure', $time_departure);
        $stmt->bindParam(':purpose', $purpose);
        $stmt->bindParam(':no_passengers', $no_passengers);
        $stmt->bindParam(':office_dept', $office_dept);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':contact_no', $contact_no);
        $stmt->bindParam(':passenger_manifest', $passenger_manifest, PDO::PARAM_LOB);
        $stmt->bindParam(':service_type', $service_type);

        if ($stmt->execute()) {
            echo "Reservation successful!";
        } else {
            echo "Error: Unable to save the reservation.";
        }
    } else {
        echo "Error: No vehicle found for the selected vehicle type.";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$conn = null;
?>
