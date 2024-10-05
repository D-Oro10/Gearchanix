// Function to fetch trip ticket data
function fetchTripTickets() {
    fetch('fetch_trip_tickets.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('tripTicketBody'); // Updated to match the HTML ID
            tableBody.innerHTML = ''; // Clear any existing rows

            if (data.success) {
                // Check if there are any trip tickets
                if (data.data.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="13" class="text-center">No data available</td>`;
                    tableBody.appendChild(row);
                } else {
                    // Populate the table with the fetched data
                    data.data.forEach(ticket => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${ticket.trip_ticket_date || ''}</td>
                            <td>${ticket.vehicle_type || ''}</td>
                            <td>${ticket.plate_num || ''}</td>
                            <td>${ticket.gas_tank || ''}</td>
                            <td>${ticket.purchased_gas || ''}</td>
                            <td>${ticket.total || ''}</td>
                            <td>${ticket.start_odometer || ''}</td>
                            <td>${ticket.end_odometer || ''}</td>
                            <td>${ticket.KM_used || ''}</td>
                            <td>${ticket.RFID_Easy || ''}</td>
                            <td>${ticket.RFID_Auto || ''}</td>
                            <td>${ticket.oil_used || ''}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editTripTicket(${ticket.trip_ticketID})">Edit</button>
                                <button class="btn btn-danger" onclick="confirmDeleteTripTicket(${ticket.trip_ticketID})">Delete</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                }
            } else {
                console.error(data.message);
                alert('Failed to fetch trip ticket data.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch trip ticket data.');
        });
}

// Call the function to fetch trip tickets when the page loads
document.addEventListener('DOMContentLoaded', fetchTripTickets);

// Function to show edit modal with trip ticket data
function editTripTicket(trip_ticketID) {
    fetch(`get_trip_ticket.php?trip_ticketID=${trip_ticketID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.ticket) {
                const ticket = data.ticket;
                // Populate the modal fields with the fetched data
                document.getElementById("editTripTicketID").value = ticket.trip_ticketID || '';
                document.getElementById("editGasTank").value = ticket.gas_tank || '';
                document.getElementById("editPurchasedGas").value = ticket.purchased_gas || '';
                document.getElementById("editTotalGas").value = ticket.total || '';
                document.getElementById("editStartOdometer").value = ticket.start_odometer || '';
                document.getElementById("editEndOdometer").value = ticket.end_odometer || '';
                document.getElementById("editKMUsed").value = ticket.KM_used || '';
                document.getElementById("editRFIDEasy").value = ticket.RFID_Easy || '';
                document.getElementById("editRFIDAuto").value = ticket.RFID_Auto || '';
                document.getElementById("editOilUsed").value = ticket.oil_used || '';

                // Fetch plate numbers based on vehicle type
                fetchPlateNumbers(ticket.vehicle_type);

                const editModal = new bootstrap.Modal(document.getElementById('editModal'));
                editModal.show();
            } else {
                console.error('No data found for the trip ticket ID:', trip_ticketID);
            }
        })
        .catch(error => {
            console.error('Error fetching trip ticket data:', error);
        });
}

// Function to fetch plate numbers based on vehicle type
function fetchPlateNumbers(vehicleType) {
    fetch(`get_plate_numbers.php?vehicle_type=${vehicleType}`)
        .then(response => response.json())
        .then(data => {
            const plateNumSelect = document.getElementById('editPlateNum');
            plateNumSelect.innerHTML = ''; // Clear previous options
            data.plate_numbers.forEach(plate => {
                const option = document.createElement('option');
                option.value = plate.plate_num;
                option.textContent = plate.plate_num;
                plateNumSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching plate numbers:', error);
        });
}

// Event listener for edit form submission
document.getElementById("editTripTicketForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('update_trip_ticket.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Trip ticket updated successfully.');
            fetchTripTickets(); // Reload trip tickets to reflect the update
            const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
            editModal.hide();
        } else {
            alert('Error saving trip ticket: ' + result.message);
        }
    })
    .catch(error => console.error('Error saving trip ticket:', error));
});

// Function to confirm deletion of a trip ticket
function confirmDeleteTripTicket(trip_ticketID) {
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    deleteModal.show();

    document.getElementById("confirmDelete").onclick = function() {
        fetch(`delete_trip_ticket.php`, {
            method: 'DELETE',
            body: new URLSearchParams({ id: trip_ticketID })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                deleteModal.hide();
                alert('Trip ticket deleted successfully.');
                fetchTripTickets(); // Reload trip tickets after deletion
            } else {
                alert('Error deleting trip ticket: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting trip ticket:', error);
        });
    };
}

// Search function for trip tickets
function searchTripTickets() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("tripTicketBody");
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
