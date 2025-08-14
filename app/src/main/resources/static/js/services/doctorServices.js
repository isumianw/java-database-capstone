// doctorServices.js
import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + 'doctor';

export async function getDoctors() {
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

export async function deleteDoctor(id, token) {
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

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

export async function filterDoctors(name, time, specialty) {
  try {
    const params = new URLSearchParams();

    if (name) params.append("name", name);
    if (time) params.append("time", time);
    if (specialty) params.append("specialty", specialty);

    const response = await fetch(`${DOCTOR_API}/filter?${params.toString()}`);

    if (!response.ok) throw new Error("Failed to fetch filtered doctors");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error filtering doctors:", error);
    return [];
  }
}
