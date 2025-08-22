// prescriptionServices.js

const PRESCRIPTION_API = window.API_BASE_URL + "/prescription";

window.savePrescription = async function(prescription, token) {
  try {
    const response = await fetch(`${PRESCRIPTION_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(prescription)
    });
    const result = await response.json();
    return { success: response.ok, message: result.message };
  } catch (error) {
    console.error("Error :: savePrescription :: ", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
};

window.getPrescription = async function(appointmentId, token) {
  try {
    const response = await fetch(`${PRESCRIPTION_API}/${appointmentId}/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch prescription:", errorData);
      throw new Error(errorData.message || "Unable to fetch prescription");
    }

    const result = await response.json();
    console.log("Fetched prescription:", result);
    return result;
  } catch (error) {
    console.error("Error :: getPrescription ::", error);
    throw error;
  }
};
