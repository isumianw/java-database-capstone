// doctorServices.js

const DOCTOR_API = window.API_BASE_URL + 'doctor';

// Fetch all doctors
async function getDoctors() {
  try {
    const response = await fetch(`${DOCTOR_API}`);
    if (!response.ok) throw new Error("Failed to fetch doctors");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

// Delete a doctor by ID
async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || "Doctor deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return { success: false, message: "Error deleting doctor" };
  }
}

// Add a new doctor
async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${token}`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doctor)
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || "Doctor saved successfully"
    };
  } catch (error) {
    console.error("Error saving doctor:", error);
    return { success: false, message: "Error saving doctor" };
  }
}

  
// Filter doctors
async function filterDoctors(name, time, specialty) {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (time) params.append("time", time);
    if (specialty) params.append("specialty", specialty);

    try {
        const response = await fetch(`${DOCTOR_API}/filter?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch filtered doctors");

        const data = await response.json();
        return data.doctors || Object.values(data) || [];
    } catch (error) {
        console.error("Error filtering doctors:", error);
        return [];
    }
}

window.getDoctors = getDoctors;
window.deleteDoctor = deleteDoctor;
window.saveDoctor = saveDoctor;
window.filterDoctors = filterDoctors;
