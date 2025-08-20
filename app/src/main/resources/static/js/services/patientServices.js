const PATIENT_API = API_BASE_URL + 'patient';
const APPOINTMENT_API = API_BASE_URL + 'appointments';

// For creating a patient in db
window.patientSignup = async function(data) {
    try {
        const response = await fetch(`${PATIENT_API}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Error :: patientSignup :: ", error);
        return { success: false, message: error.message };
    }
};

// For logging in patient
window.patientLogin = async function(data) {
    try {
        const response = await fetch(`${PATIENT_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error("Error :: patientLogin :: ", error);
        throw error;
    }
};

// Global login function for modals (works on any page)
window.loginPatient = async function() {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const data = { email, password };

        const response = await window.patientLogin(data);

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("token", result.token);
            localStorage.setItem("userRole", "loggedPatient");
            window.location.href = "/pages/loggedPatientDashboard.html";
        } else {
            const error = await response.json();
            alert(error.message || "Invalid credentials!");
        }
    } catch (error) {
        alert("Failed to Login: " + error);
    }
};

// For getting patient data (name, id, etc). Used in booking appointments
window.getPatientData = async function(token) {
    try {
      const response = await fetch(`${PATIENT_API}/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) return data.patient;
      console.error("Failed to fetch patient details:", data);
      return null;
    } catch (error) {
      console.error("Error fetching patient details:", error);
      return null;
    }
  };
  
// Fetch patient appointments
window.getPatientAppointments = async function(id, token, user) {
    try {
        const response = await fetch(`${PATIENT_API}/${id}/${user}/${token}`);
        const data = await response.json();
        if (response.ok) return data.appointments;
        return null;
    } catch (error) {
        console.error("Error fetching patient appointments:", error);
        return null;
    }
};

// Filter appointments
window.filterAppointments = async function(condition, name, token) {
    try {
        const response = await fetch(`${PATIENT_API}/filter/${condition}/${name}/${token}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch doctors:", response.statusText);
            return { appointments: [] };
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
        return { appointments: [] };
    }
};

// book appointment
window.bookAppointment = async function(appointment, token) {
    try {
        const response = await fetch(`${APPOINTMENT_API}/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(appointment)
        });

        const data = await response.json();
        return { success: response.ok, message: data.message };
    } catch (error) {
        console.error("Error booking appointment:", error);
        return { success: false, message: error.message };
    }
};
