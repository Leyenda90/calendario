const startDate = new Date('2024-11-01');
const endDate = new Date('2025-12-31');
const calendarEl = document.getElementById('calendar');
const messageEl = document.getElementById('message');
const reminderEl = document.getElementById('reminder');

let checkedDays = JSON.parse(localStorage.getItem('checkedDays')) || {};

function createCalendar() {
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';

        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthDiv.appendChild(monthTitle);

        const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const weekdaysRow = document.createElement('div');
        weekdaysRow.className = 'weekdays';
        weekdays.forEach(weekday => {
            const weekdayDiv = document.createElement('div');
            weekdayDiv.textContent = weekday;
            weekdaysRow.appendChild(weekdayDiv);
        });
        monthDiv.appendChild(weekdaysRow);

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        const daysContainer = document.createElement('div');
        daysContainer.className = 'days';

        for (let i = 0; i < startDay; i++) {
            const emptyDiv = document.createElement('div');
            daysContainer.appendChild(emptyDiv);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = i;

            if (checkedDays[day.toDateString()]) {
                dayDiv.classList.add('checked');
            }

            dayDiv.addEventListener('click', () => toggleDay(dayDiv, day));
            daysContainer.appendChild(dayDiv);
        }
        monthDiv.appendChild(daysContainer);
        calendarEl.appendChild(monthDiv);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
}

function toggleDay(dayDiv, day) {
    const dayStr = day.toDateString();
    if (checkedDays[dayStr]) {
        if (confirm('¿Está seguro de que quiere desmarcar este día?')) {
            dayDiv.classList.remove('checked');
            delete checkedDays[dayStr];
            localStorage.setItem('checkedDays', JSON.stringify(checkedDays));
            messageEl.textContent = `Día ${day.getDate()} desmarcado.`;
            reminderEl.textContent = '';
        }
    } else {
        dayDiv.classList.add('checked');
        checkedDays[dayStr] = true;
        localStorage.setItem('checkedDays', JSON.stringify(checkedDays));
        messageEl.textContent = `Día ${day.getDate()} completado. ¡Vamos para el siguiente!`;
        reminderEl.textContent = '¡Sigue así!';
        checkMonthCompletion(day);
    }
}

function checkMonthCompletion(day) {
    const monthEnd = new Date(day.getFullYear(), day.getMonth() + 1, 0);
    const daysInMonth = monthEnd.getDate();
    const completedDays = Object.keys(checkedDays).filter(dateStr => {
        const date = new Date(dateStr);
        return date.getFullYear() === day.getFullYear() && date.getMonth() === day.getMonth();
    }).length;

    if (completedDays === daysInMonth) {
        alert('Mes completado! ¡Vamos por el siguiente!');
    }
}

createCalendar();