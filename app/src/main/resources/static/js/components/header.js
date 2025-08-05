function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    // Clear session if on homepage
    if (window.location.pathname.endsWith("/")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
    }

    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // If role is logged in but no token, session expired
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    let headerContent = "";

    if (role === "admin") {
        headerContent = `
            <button id="addDocBtn" class="adminBtn" onclick="openModal('addDoctor')">Add Doctor</button>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "doctor") {
        headerContent = `
            <a href="/doctorDashboard.html">Home</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "loggedPatient") {
        headerContent = `
            <a href="/patientDashboard.html">Home</a>
            <a href="/patientAppointments.html">Appointments</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "patient") {
        headerContent = `
            <a href="/login.html">Login</a>
            <a href="/signup.html">Sign Up</a>
        `;
    }

    headerDiv.innerHTML = headerContent;
    attachHeaderButtonListeners();

    function attachHeaderButtonListeners() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        const addDocBtn = document.getElementById("addDocBtn");
        if (addDocBtn) {
            addDocBtn.addEventListener("click", function () {
                openModal("addDoctor");
            });
        }
    }

    function logout() {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    function logoutPatient() {
        localStorage.removeItem("token");
        localStorage.setItem("userRole", "patient");
        window.location.href = "/patientDashboard.html";
    }
}

window.addEventListener("DOMContentLoaded", renderHeader);
