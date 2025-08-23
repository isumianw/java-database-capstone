// appointmentRecordService.js

// This is for the doctor to get all the patient Appointments
async function getAllAppointments(date, patientName, token) {
    // base URL with date + token in path
    let url = `${APPOINTMENT_API}/${date}/${token}`;
  
    // add patientName as query parameter only if provided
    if (patientName && patientName.trim() !== "") {
      url += `?patientName=${encodeURIComponent(patientName)}`;
    }
  
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }
  
    return await response.json();
  }
    
async function bookAppointment(appointment, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "Something went wrong"
    };
  } catch (error) {
    console.error("Error while booking appointment:", error);
    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}

async function updateAppointment(appointment, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(appointment)
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "Something went wrong"
    };
  } catch (error) {
    console.error("Error while updating appointment:", error);
    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}


window.getAllAppointments = getAllAppointments;
window.bookAppointment = bookAppointment;
window.updateAppointment = updateAppointment;
