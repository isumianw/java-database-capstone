// patientServices.js

const PATIENT_API = API_BASE_URL + '/patient';

// For creating a patient in db
async function patientSignup(data) {
    try {
        const response = await fetch(`${PATIENT_API}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Error :: patientSignup :: ", error);
        return { success: false, message: error.message };
    }
}

// For logging in patient
async function patientLogin(data) {
    console.log("patientLogin :: ", data);
    return await fetch(`${PATIENT_API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

// For getting patient data (name, id, etc). Used in booking appointments
async function getPatientData(token) {
    try {
        const response = await fetch(`${PATIENT_API}/${token}`);
        const data = await response.json();
        if (response.ok) return data.patient;
        return null;
    } catch (error) {
        console.error("Error fetching patient details:", error);
        return null;
    }
}

// Fetch patient appointments
async function getPatientAppointments(id, token, user) {
    try {
        const response = await fetch(`${PATIENT_API}/${id}/${user}/${token}`);
        const data = await response.json();
        console.log(data.appointments);
        if (response.ok) {
            return data.appointments;
        }
        return null;
    } catch (error) {
        console.error("Error fetching patient details:", error);
        return null;
    }
}

// Filter appointments
async function filterAppointments(condition, name, token) {
    try {
        const response = await fetch(`${PATIENT_API}/filter/${condition}/${name}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
}


window.patientSignup = patientSignup;
window.patientLogin = patientLogin;
window.getPatientData = getPatientData;
window.getPatientAppointments = getPatientAppointments;
window.filterAppointments = filterAppointments;
