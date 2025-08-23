// updateAppointment.js 

// Uses global functions from appointmentRecordService.js and doctorServices.js
document.addEventListener("DOMContentLoaded", initializePage);

async function initializePage() {
  const token = localStorage.getItem("token"); 

  // Get appointmentId and patientId from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get("appointmentId");
  const patientId = urlParams.get("patientId");
  const doctorId = urlParams.get("doctorId");
  const patientName = urlParams.get("patientName");
  const doctorName = urlParams.get("doctorName");
  const appointmentDate = urlParams.get("appointmentDate");
  const appointmentTime = urlParams.get("appointmentTime");

  console.log("Doctor ID from URL:", doctorId);

  if (!token || !patientId) {
    alert("Missing session data, redirecting to appointments page.");
    window.location.href = "../pages/patientAppointments.html";
    return;
  }

  // get doctor to display only the available time of doctor
    window.getDoctors()
    .then(doctorsResponse => {
      console.log("Doctors response:", doctorsResponse);

      // Normalize response: sometimes API returns { doctors: [...] }
      const doctors = Array.isArray(doctorsResponse)
        ? doctorsResponse
        : doctorsResponse.doctors || Object.values(doctorsResponse) || [];

      // Find the doctor by the ID from the URL
      const doctor = doctors.find(d => d.id == doctorId);

      if (!doctor) {
        alert("Doctor not found.");
        return;
      }

      // Fill the form with the appointment data passed in the URL
      document.getElementById("patientName").value = patientName || "You";
      document.getElementById("doctorName").value = doctorName;
      document.getElementById("appointmentDate").value = appointmentDate;
      document.getElementById("appointmentTime").value = appointmentTime;

      const timeSelect = document.getElementById("appointmentTime");
      doctor.availableTimes.forEach(time => {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
      });

      // Handle form submission for updating the appointment
      document.getElementById("updateAppointmentForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const date = document.getElementById("appointmentDate").value;
        const time = document.getElementById("appointmentTime").value;
        const startTime = time.split('-')[0];

        if (!date || !time) {
          alert("Please select both date and time.");
          return;
        }

        const updatedAppointment = {
            id: appointmentId,
            doctor: doctorId,       
            patient: patientId,    
            appointmentTime: `${date}T${startTime}:00`,
            status: 0
        };
        

        const updateResponse = await window.updateAppointment(updatedAppointment, token);

        if (updateResponse.success) {
          alert("✅ Appointment updated successfully!");
          window.location.href = "../pages/patientAppointments.html";
        } else {
          alert("❌ Failed to update appointment: " + updateResponse.message);
        }
      });
    })
    .catch(error => {
      console.error("Error fetching doctors:", error);
      alert("❌ Failed to load doctor data.");
    });
}
