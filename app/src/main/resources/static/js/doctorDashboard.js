import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

const appointmentTableBody = document.querySelector('#patientTableBody');
let selectedDate = new Date().toISOString().split('T')[0]; // today's date
const token = localStorage.getItem("token"); // for auth
let patientName = null; // for search filter

const searchBar = document.querySelector('#searchBar');
searchBar.addEventListener('input', () => {
    const inputValue = searchBar.value.trim();
    patientName = inputValue === '' ? 'null' : inputValue;
    loadAppointments(); // refresh list with filter
});

const todayButton = document.querySelector('#todayAppointmentsBtn');
todayButton.addEventListener('click', () => {
    selectedDate = new Date().toISOString().split('T')[0];
    document.querySelector('#appointmentDate').value = selectedDate;
    loadAppointments();
});

const datePicker = document.querySelector('#appointmentDate')
datePicker.addEventListener('change', () => {
    selectedDate = datePicker.value;
    loadAppointments();
});

async function loadAppointments() {
    try {
        const appointments = await getAllAppointments(selectedDate, patientName, token);
        appointmentTableBody.innerHTML = ''; // clear old data

        if (!appointments || appointments.length === 0) {
            appointmentTableBody.innerHTML = `
                <tr>
                    <td colspan="5">No Appointments found for today.</td>
                </tr>
            `;
            return;
        }

        appointments.forEach((appointment) => {
            const row = createPatientRow(appointment);
            appointmentTableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        appointmentTableBody.innerHTML = `
            <tr>
                <td colspan="5">Failed to load appointments. Please try again.</td>
            </tr>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderContent();

    document.querySelector('#appointmentDate').value = selectedDate;
    loadAppointments();
});