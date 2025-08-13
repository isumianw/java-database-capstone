// render.js

export function selectRole(role) {
    console.log("selectRole called with:", role);

    setRole(role);
    const token = localStorage.getItem('token');
  
    if (role === "admin") {
      if (token) {
        window.location.href = `/adminDashboard/${token}`;
      }
    } else if (role === "patient") {
      window.location.href = "/pages/patientDashboard.html";
    } else if (role === "doctor") {
      if (token) {
        window.location.href = `/doctorDashboard/${token}`;
      }
    } else if (role === "loggedPatient") {
      window.location.href = "loggedPatientDashboard.html";
    }
  }
  
function renderContent() {
  const role = getRole();
  if (!role) {
    window.location.href = "/"; // if no role, send to role selection page
    return;
  }
}
