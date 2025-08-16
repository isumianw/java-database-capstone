window.createPatientRecordRow = function(appointment) {
    const tr = document.createElement("tr");

    const patient = appointment.patient || {};

    tr.innerHTML = `
        <td>${appointment.id}</td>
        <td>${patient.name ?? ''}</td>
        <td>${patient.phone ?? ''}</td>
        <td>${patient.email ?? ''}</td>
        <td>
          <img src="../assets/images/addPrescriptionIcon/addPrescription.png" 
               alt="addPrescriptionIcon" 
               class="prescription-btn" 
               data-id="${appointment.id}">
        </td>
    `;

    tr.querySelector(".prescription-btn").addEventListener("click", () => {
        window.location.href = `/pages/addPrescription.html?mode=view&appointmentId=${appointment.id}`;
    });

    console.log("CreatePatientRow :: ", appointment); // debug
    return tr;
};
