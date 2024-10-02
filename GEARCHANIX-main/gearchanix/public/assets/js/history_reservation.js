// adding new reservations
document.getElementById("addBtn").addEventListener("click", function() {
    window.location.href = "/GEARCHANIX-MAIN/gearchanix/src/pages/dispatcher/addreservation.html";
});

// Fetch reservation data and populate the table
function loadReservations() {
    fetch('historyfetch_reservation.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('reservation-data');
            tableBody.innerHTML = ''; 

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="13">No reservations found</td></tr>'; 
            } else {
                data.forEach(row => {
                    let manifestDownload = row.passenger_manifest
                        ? `<a href="data:image/jpeg;base64,${row.passenger_manifest}" download="passenger_manifest_${row.reservation_date}.jpg">Download</a>`
                        : 'No Attachment';

                    const tableRow = `
                    <tr data-reservation-id="${row.reservation_ID}">
                        <td>${row.reservation_status}</td>
                        <td>${row.vehicle_type}</td>
                        <td>${row.reservation_date}</td>
                        <td>${row.location}</td>
                        <td>${row.duration}</td>
                        <td>${row.time_departure}</td>
                        <td>${row.no_passengers}</td>
                        <td>${row.office_dept}</td>
                        <td>${row.email}</td>
                        <td>${row.contact_no}</td>
                        <td>${row.service_type}</td>
                        <td>${row.purpose}</td>
                        <td>${manifestDownload}</td>
                        <td>
                           <button class="delete-btn" onclick="confirmDelete(${row.reservation_ID})">Delete</button>
                        </td>
                    </tr>
                `;
                    tableBody.innerHTML += tableRow;
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

let reservationIdToDelete; // Variable to store the ID of the reservation to delete

// Function to show the delete confirmation modal
function confirmDelete(reservationId) {
    reservationIdToDelete = reservationId; // Store the reservation ID
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    deleteModal.show();
}

// Handle the confirm delete button click
document.getElementById("confirmDelete").addEventListener("click", function() {
    // Make AJAX call to delete the reservation
    fetch(`fetch_reservations.php?del_reserve=${reservationIdToDelete}`)
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                // Hide delete confirmation modal
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
                deleteModal.hide();

                // Show the success modal
                const successModal = new bootstrap.Modal(document.getElementById("successModal"));
                successModal.show();

                // Reload the page after a delay
                setTimeout(() => {
                    window.location.reload(); // Reload the page after a brief delay
                }, 1500);
            } else {
                // Handle any error messages here if necessary
                alert('Error deleting reservation: ' + result.message);
            }
        })
        .catch(error => console.error('Error deleting reservation:', error));
});



// edit action
function editReservation(reservation_ID) {
    fetch(`update_reservation.php?id=${reservation_ID}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                // Populate the modal fields with the fetched data
                document.getElementById("editReservationID").value = data.reservation_ID;
                document.getElementById("editVehicleType").value = data.vehicle_type;
                document.getElementById("editReservationDate").value = data.reservation_date;
                document.getElementById("editLocation").value = data.location;
                document.getElementById("editDuration").value = data.duration;
                document.getElementById("editTimeDeparture").value = data.time_departure;
                document.getElementById("editNoPassengers").value = data.no_passengers;
                document.getElementById("editOfficeDept").value = data.office_dept;
                document.getElementById("editEmail").value = data.email;
                document.getElementById("editContactNo").value = data.contact_no;
                document.getElementById("editServiceType").value = data.service_type;
                document.getElementById("editPurpose").value = data.purpose;

                // Handle passenger manifest: show link to existing file if available
                if (data.passenger_manifest) {
                    const manifestLink = document.getElementById('manifestLink');
                    manifestLink.innerHTML = `<a href="${data.passenger_manifest}" target="_blank">View current manifest</a>`;
                } else {
                    document.getElementById('manifestLink').innerHTML = '';
                }

               
                const editModal = new bootstrap.Modal(document.getElementById("editModal"));
                editModal.show();
            } else {
                alert('Error: Could not fetch reservation details.');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Search function
function searchFunction() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("reservation-data");
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


window.onload = loadReservations;
