// patientAppointment.js

const tableBody = document.getElementById("patientTableBody");
const token = localStorage.getItem("token");

let allAppointments = [];
let patientId = null;

document.addEventListener("DOMContentLoaded", initializePage);

async function initializePage() {
  try {
    if (!token) throw new Error("No token found");

    // Get patient info
    const patient = await getPatientData(token);
    if (!patient) throw new Error("Failed to fetch patient details");

    patientId = Number(patient.id);

    // Get appointments
    const appointmentData = await getPatientAppointments(patientId, token, "patient") || [];
    console.log("Appointments from backend:", appointmentData); // Debug

    
    allAppointments = appointmentData.filter(app => {
     
      return (app.patientId ? app.patientId === patientId : app.patient?.id === patientId);
    });

    renderAppointments(allAppointments);
  } catch (error) {
    console.error("Error loading appointments:", error);
    alert("❌ Failed to load your appointments.");
  }
}

function renderAppointments(appointments) {
  tableBody.innerHTML = "";

  const actionTh = document.querySelector("#patientTable thead tr th:last-child");
  if (actionTh) actionTh.style.display = "table-cell";

  if (!appointments.length) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No Appointments Found</td></tr>`;
    return;
  }

  appointments.forEach(appointment => {
    const patientName = appointment.patient?.name || "You";
    const doctorName = appointment.doctor?.name || appointment.doctorName;
    const date = appointment.appointmentDate || appointment.date;
    const time = appointment.appointmentTimeOnly || appointment.time;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${patientName}</td>
      <td>${doctorName}</td>
      <td>${date}</td>
      <td>${time}</td>
      <td>${appointment.status == 0 
        ? `<img src="../assets/images/edit/edit.png" alt="Edit" class="prescription-btn" data-id="${appointment.patientId || appointment.patient?.id}">` 
        : "-"}</td>
    `;

    if (appointment.status == 0) {
      const actionBtn = tr.querySelector(".prescription-btn");
      if (actionBtn) actionBtn.addEventListener("click", () => redirectToUpdatePage(appointment));
    }

    tableBody.appendChild(tr);
  });
}

function redirectToUpdatePage(appointment) {
 
    const appointmentId = appointment.id;
    const patientId = appointment.patient?.id || appointment.patientId;
    const doctorId = appointment.doctor?.id || appointment.doctorId;
    const patientName = appointment.patient?.name || "You";
    const doctorName = appointment.doctor?.name || appointment.doctorName;
    const appointmentDate = appointment.appointmentDate || appointment.date;
    const appointmentTime = appointment.appointmentTimeOnly || appointment.time;
  

    const queryParams = new URLSearchParams({
      appointmentId,
      patientId,
      doctorId,
      patientName,
      doctorName,
      appointmentDate,
      appointmentTime
    });
  
    
    window.location.href = `../pages/updateAppointment.html?${queryParams.toString()}`;
  }
  