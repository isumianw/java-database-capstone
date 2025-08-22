// header.js

function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    if (window.location.pathname.endsWith("/")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
    }

    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    let navLinks = "";

    if (role === "admin") {
        navLinks = `
            <button id="addDocBtn" class="adminBtn">Add Doctor</button>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "doctor") {
        navLinks = `
            <a href="doctorDashboard.html">Home</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "loggedPatient") {
        navLinks = `
            <a href="patientDashboard.html">Home</a>
            <a href="patientAppointments.html">Appointments</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "patient") {
        navLinks = `
            <a href="#" id="loginModalBtn">Login</a>
            <a href="#" id="signupModalBtn">Sign Up</a>
        `;
    }

    // Inject full header structure
    headerDiv.innerHTML = `
        <header class="header">
            <a href="/" class="logo-link">
                <img src="/assets/images/logo/logo.png" class="logo-img" alt="Logo">
                <span class="logo-title">Clinic Management System</span>
            </a>
            <nav>${navLinks}</nav>
        </header>
    `;

    attachHeaderButtonListeners();

    function attachHeaderButtonListeners() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.addEventListener("click", logout);

        const addDocBtn = document.getElementById("addDocBtn");
        if (addDocBtn) addDocBtn.addEventListener("click", () => openModal("addDoctor"));

        const loginBtn = document.getElementById("loginModalBtn");
        if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));

        const signupBtn = document.getElementById("signupModalBtn");
        if (signupBtn) signupBtn.addEventListener("click", () => openModal("patientSignup"));
    }

    function logout() {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        window.location.href = "/";
    }
}

window.renderHeader = renderHeader;

window.addEventListener("DOMContentLoaded", renderHeader);
