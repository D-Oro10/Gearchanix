// Placeholder for adding new reservations
document.getElementById("addBtn").addEventListener("click", function() {
    window.location.href = "/GEARCHANIX-MAIN/gearchanix/src/pages/dispatcher/addreservation.html";
});

// Fetch reservation data and populate the table
fetch('fetch_reservations.php')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('reservation-data');
        tableBody.innerHTML = ''; // Clear previous data if any

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="12">No reservations found</td></tr>'; // Updated column count
        } else {
            data.forEach(row => {
                let manifestDownload = row.passenger_manifest 
                    ? `<a href="data:image/jpeg;base64,${row.passenger_manifest}" download="passenger_manifest_${row.reservation_date}.jpg">Download</a>` 
                    : 'No Attachment';

                    const tableRow = `
                    <tr data-reservation-id="${row.reservation_ID}">
                        <td><input type="checkbox" class="select-row" value="${row.reservation_ID}"></td>
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
                    </tr>
                `;
                tableBody.innerHTML += tableRow;
            });
        }
    })
    .catch(error => console.error('Error fetching data:', error));

// // Select/Deselect all checkboxes
// document.getElementById('selectAll').addEventListener('click', function() {
//     const checkboxes = document.querySelectorAll('.select-row');
//     checkboxes.forEach(checkbox => checkbox.checked = this.checked);
// });

// Allow only one checkbox to be selected at a time
document.querySelectorAll('.select-row').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        document.querySelectorAll('.select-row').forEach(cb => {
            if (cb !== this) cb.checked = false; // Deselect others
        });
    });
});

// document.getElementById("editBtn").addEventListener("click", function() {
//     const selectedCheckbox = document.querySelector('input[type="checkbox"]:checked');
//     if (selectedCheckbox) {
//         const reservationId = selectedCheckbox.value; // Get the selected reservation ID

//         // Fetch reservation details from the server (using AJAX or fetch)
//         fetch(`edit_reservation.php?id=${reservationId}`)
//             .then(response => response.json())
//             .then(data => {
//                 // Populate the modal fields with the fetched data
//                 document.getElementById("editVehicleType").value = data.vehicle_type;
//                 document.getElementById("editReservationDate").value = data.reservation_date;
//                 document.getElementById("editLocation").value = data.location;
//                 document.getElementById("editDuration").value = data.duration;
//                 document.getElementById("editTimeDeparture").value = data.time_departure;
//                 document.getElementById("editNoPassengers").value = data.no_passengers;
//                 document.getElementById("editOfficeDept").value = data.office_dept;
//                 document.getElementById("editEmail").value = data.email;
//                 document.getElementById("editContactNo").value = data.contact_no;
//                 document.getElementById("editServiceType").value = data.service_type;
//                 document.getElementById("editPurpose").value = data.purpose;
//                 // Optional: handle file upload for passenger manifest if needed
//             })
//             .catch(error => console.error('Error fetching data:', error));
//     } else {
//         alert("Please select a reservation to edit.");
//     }
// });


// document.getElementById("editReservationForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent form from submitting the default way

//     const formData = new FormData(this); // Get the form data
//     const reservationId = document.querySelector('input[type="checkbox"]:checked').value;

//     // Send the updated data to the server
//     fetch(`update_reservation.php?id=${reservation_ID}`, {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(result => {
//         if (result.success) {
//             alert('Reservation updated successfully.');
//             location.reload(); // Reload the page to show updated data
//         } else {
//             alert('Error updating reservation: ' + result.message);
//         }
//     })
//     .catch(error => console.error('Error updating reservation:', error));
// });

document.getElementById("editBtn").addEventListener("click", function() {
    const selectedCheckbox = document.querySelector('input[type="checkbox"]:checked');
    if (selectedCheckbox) {
        const reservationId = selectedCheckbox.value; // Get the selected reservation ID
        
        fetch(`edit_reservation.php?id=${reservation_ID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
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

                // Show the edit modal
                const editModal = new bootstrap.Modal(document.getElementById("editModal"));
                editModal.show();
            })
            .catch(error => console.error('Error fetching data:', error));
    } else {
        alert('Please select a reservation to edit.');
    }
});



document.getElementById("saveChangesBtn").addEventListener("click", function() {
    const formData = new FormData(document.getElementById("editReservationForm"));
    
    // Append the reservation ID to the form data
    const reservationId = document.getElementById("editReservationID").value;
    formData.append("reservation_ID", reservationId);

    // Send the form data to the server
    fetch("update_reservation.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Reservation updated successfully!");
            // Optionally, refresh the table or close the modal
            window.location.reload(); // Refresh page to see changes
        } else {
            alert("Error updating reservation: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});






















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
