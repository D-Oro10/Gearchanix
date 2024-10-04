// Function to fetch vehicle data
function loadVehicles() {
    fetch('vehiclelist.php')
        .then(response => response.json())
        .then(data => {
            const vehicleTableBody = document.getElementById("vehicle-data"); // Updated to match the HTML ID
            vehicleTableBody.innerHTML = ''; 

            data.forEach(vehicle => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${vehicle.vehicle_status || 'N/A'}</td> 
                    <td>${vehicle.vehicle_name}</td>
                    <td>${vehicle.vehicle_model}</td>
                    <td>${vehicle.vehicle_year}</td>
                    <td>${vehicle.vehicle_vin}</td>
                    <td>${vehicle.vehicle_type}</td>
                    <td>${vehicle.plate_num}</td>
                    <td>${vehicle.lifespan}</td>
                    <td>${vehicle.current_meter}</td>
                    <td>${vehicle.pms_date || 'N/A'}</td> 
                    <td>${vehicle.vehicle_remarks || ''}</td>
                    <td>
                        <button class="btn btn-danger" onclick="confirmDelete(${vehicle.vehicle_ID})">Delete</button>
                        <button class="btn btn-primary" onclick="editVehicle(${vehicle.vehicle_ID})">Edit</button>
                    </td>
                `;

                vehicleTableBody.appendChild(row); 
            });
        })
        .catch(error => console.error('Error loading vehicle data:', error));
}

// Call loadVehicles on page load or when necessary
document.addEventListener("DOMContentLoaded", loadVehicles);


// Function to show edit modal with vehicle data
function editVehicle(vehicle_ID) {
    fetch(`editvehicle.php?id=${vehicle_ID}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                // Populate the modal fields with the fetched data
                document.getElementById("editVehicleID").value = data.vehicle_ID || '';
                document.getElementById("editVehicleName").value = data.vehicle_name || '';
                document.getElementById("editVehicleModel").value = data.vehicle_model || '';
                document.getElementById("editVehicleYear").value = data.vehicle_year || '';
                document.getElementById("editVehicleVin").value = data.vehicle_vin || '';
                document.getElementById("editVehicleType").value = data.vehicle_type || '';
                document.getElementById("editPlateNum").value = data.plate_num || '';
                document.getElementById("editLifespan").value = data.lifespan || '';
                document.getElementById("editCurrentMeter").value = data.current_meter || '';
                document.getElementById("editRemarks").value = data.vehicle_remarks || '';

                
                const editModal = new bootstrap.Modal(document.getElementById('editModal'));
                editModal.show();
            } else {
                console.error('No data found for the vehicle ID:', vehicle_ID);
            }
        })
        .catch(error => {
            console.error('Error fetching vehicle data:', error);
        });
}

let vehicleIdToDelete; // Variable to store the ID of the vehicle to delete

// Function to confirm deletion
function confirmDelete(vehicle_ID) {
    vehicleIdToDelete = vehicle_ID; // Store the ID of the vehicle to delete
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    deleteModal.show(); 
}

// Handle the confirm delete button click
document.getElementById("confirmDelete").addEventListener("click", function() {
    // Make AJAX call to delete the vehicle
    fetch(`deletevehicle.php`, {
        method: 'DELETE',
        body: new URLSearchParams({ id: vehicleIdToDelete }) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Hide delete confirmation modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
            deleteModal.hide();

            
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            // Reload the page after a brief delay
            setTimeout(() => {
                window.location.reload(); 
            }, 1500);
        } else {
            // Handle any error messages here if necessary
            alert('Error deleting vehicle: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting vehicle:', error);
    });
});


// Event listener for edit form submission
document.getElementById("editVehicleForm").addEventListener("submit", function(e) {
    e.preventDefault(); 
    const formData = new FormData(this);

    fetch('editvehicle.php', { 
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            loadVehicles(); 
            const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
            editModal.hide(); 
        } else {
            alert('Error saving vehicle: ' + result.message);
        }
    })
    .catch(error => console.error('Error saving vehicle:', error));
});



// Function to handle form submission for adding a vehicle
document.getElementById('addVehicleForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const formData = new FormData(this); 

    fetch('addvehicle.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        if (data.success) {
            $('#addVehicleModal').modal('hide'); // Hide the add vehicle modal
            loadVehicles(); // Reload vehicles to reflect the new addition

            // Show success modal
            const addSuccessModal = new bootstrap.Modal(document.getElementById('addSuccessModal'));
            addSuccessModal.show(); // Show the success modal

            
        } else {
            alert(data.message); // Show error message if not successful
        }
    })
    .catch(error => {
        console.error('Error adding vehicle:', error);
        alert('An error occurred: ' + error.message); 
    });
});

// Search function
function searchFunction() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("vehicle-data");
    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName("td");
        let match = false;
        for (let j = 0; j < cells.length; j++) {
            if (cells[j] && cells[j].innerText.toLowerCase().indexOf(input) > -1) {
                match = true;
            }
        }
        rows[i].style.display = match ? "" : "none";
    }
}