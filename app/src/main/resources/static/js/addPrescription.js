// addPrescription.js (non-module version)

document.addEventListener('DOMContentLoaded', async () => {
    const savePrescriptionBtn = document.getElementById("savePrescription");
    const patientNameInput = document.getElementById("patientName");
    const medicinesInput = document.getElementById("medicines");
    const dosageInput = document.getElementById("dosage");
    const notesInput = document.getElementById("notes");
    const heading = document.getElementById("heading");
  
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get("appointmentId");
    const mode = urlParams.get("mode");
    const token = localStorage.getItem("token");
    const patientName = urlParams.get("patientName");
  
    if (heading) {
      if (mode === "view") {
        heading.innerHTML = `View <span>Prescription</span>`;
      } else {
        heading.innerHTML = `Add <span>Prescription</span>`;
      }
    }
  
    // Pre-fill patient name
    if (patientNameInput && patientName) {
      patientNameInput.value = patientName;
    }
  
    // Fetch and pre-fill existing prescription if it exists
    if (appointmentId && token && window.getPrescription) {
      try {
        const response = await window.getPrescription(appointmentId, token);
        console.log("getPrescription :: ", response);
  
        if (response.prescription && response.prescription.length > 0) {
          const existingPrescription = response.prescription[0];
          patientNameInput.value = existingPrescription.patientName || "";
          medicinesInput.value = existingPrescription.medication || "";
          dosageInput.value = existingPrescription.dosage || "";
          notesInput.value = existingPrescription.doctorNotes || "";
        }
  
      } catch (error) {
        console.warn("No existing prescription found or failed to load:", error);
      }
    }
  
    if (mode === 'view') {
      patientNameInput.disabled = true;
      medicinesInput.disabled = true;
      dosageInput.disabled = true;
      notesInput.disabled = true;
      savePrescriptionBtn.style.display = "none";
    }
  
    // Save prescription on button click
    savePrescriptionBtn.addEventListener('click', async (e) => {
      e.preventDefault();
  
      if (!window.savePrescription) {
        console.error("savePrescription function not available.");
        return;
      }
  
      const prescription = {
        patientName: patientNameInput.value,
        medication: medicinesInput.value,
        dosage: dosageInput.value,
        doctorNotes: notesInput.value,
        appointmentId
      };
  
      const { success, message } = await window.savePrescription(prescription, token);
  
      if (success) {
        alert("✅ Prescription saved successfully.");
        selectRole('doctor');
      } else {
        alert("❌ Failed to save prescription. " + message);
      }
    });
  });
  