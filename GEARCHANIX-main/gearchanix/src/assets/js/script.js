//Dispatcher Calendar
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            //Example events
            {
                title: 'Scheduled',
                start: '2024-09-15',
                end: '2024-09-16'
            },
            {
                title: 'Maintenance',
                start: '2024-09-10',
            }
        ]
    });
    calendar.render();
});


//Client Calendar
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('client-calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        select: function(info) {
            // Check availability for the chosen date
            const isAvailable = checkAvailability(info.startStr);
            const date = info.startStr;

            if (isAvailable) {
                showAvailableDialog(date);
            } else {
                showUnavailableDialog(date);
            }

            // Unselect the date after handling
            calendar.unselect();
        },
    });
    calendar.render();

    // Checking the availability of the chosen date
    function checkAvailability(date) {
        const day = new Date(date).getDay();
        return day !== 0 && day !== 6; // Example: available on weekdays only
    }

    // Show Available Date Modal
    function showAvailableDialog(date) {
        const modal = new bootstrap.Modal(document.getElementById('availableModal'));
        document.getElementById('proceedButton').href = "/GEARCHANIX-MAIN/gearchanix/src/pages/client/reservation.html?date=${date}";
        modal.show();
    }

    // Show Unavailable Date Modal
    function showUnavailableDialog(date) {
        const modal = new bootstrap.Modal(document.getElementById('unavailableModal'));
        modal.show();
    }
});


//Vehicle reservation form
$(document).ready(function() {
    $('.datepicker').datepicker({
        format: 'mm/dd/yyyy', 
        todayHighlight: true,
        autoclose: true
    });
});



//Reservation confirmation
document.getElementById('confirmSubmit').addEventListener('click', function() {
    document.getElementById('reservationForm').submit();
});

document.addEventListener('DOMContentLoaded', function() {
    // Function to get query parameters from URL
    function getQueryParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    let selectedDate = getQueryParam('selected_date');

    if (selectedDate) {
        document.getElementById('scheduled_date').value = selectedDate;
    }
});

document.getElementById('reservationForm').addEventListener('submit', function (event) {
    event.preventDefault(); 


    var formData = new FormData(this);

    fetch('process_reservation.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result.includes("Reservation successful")) {
            var successModal = new bootstrap.Modal(document.getElementById('reservationSuccessModal'));
            successModal.show();

            // Redirect to homepage after a delay
            document.querySelector('.modal-footer .btn-secondary').addEventListener('click', function() {
            window.location.href = '//GEARCHANIX-MAIN/gearchanix/src/pages/hompage/homepage.html';
        });
        } else {
            alert(result); // Show error message if any
        }
    })
    .catch(error => console.error('Error:', error));
});


document.getElementById('reservationForm').addEventListener('submit', function (event) {
    event.preventDefault(); 


    var formData = new FormData(this);

    fetch('addreservation.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result.includes("Reservation successful")) {
            var successModal = new bootstrap.Modal(document.getElementById('reservationSuccessModal'));
            successModal.show();

            // Redirect to homepage after a delay
            document.querySelector('.modal-footer .btn-secondary').addEventListener('click', function() {
            window.location.href = '/GEARCHANIX-MAIN/gearchanix/src/pages/dispatcher/vehicle-reservation.html';
        });
        } else {
            alert(result); // Show error message if any
        }
    })
    .catch(error => console.error('Error:', error));
});

// Function to fetch reservation data with pagination
const fetchReservations = (limit = 10) => {
    fetch(`fetch_reservations.php?limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('reservation-data');
            tableBody.innerHTML = ''; // Clear existing data
            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="12">No reservations found</td></tr>';
            } else {
                data.forEach(row => {
                    const tableRow = `
                        <tr>
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
                            <td>${row.passenger_manifest}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += tableRow;
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
};

// Initial fetch
fetchReservations();

// Event listener for record limit change
document.getElementById('record-limit').addEventListener('change', (event) => {
    const limit = event.target.value;
    fetchReservations(limit);
});

