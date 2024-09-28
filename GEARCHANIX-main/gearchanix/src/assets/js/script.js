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



