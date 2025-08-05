function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    // Clear session on homepage
    if (window.location.pathname.endsWith("/")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
    }

    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // Handle expired session
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    let headerContent = "";

    if (role === "admin") {
        headerContent += `
            <button id="addDocBtn" class="adminBtn">Add Doctor</button>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "doctor") {
        headerContent += `
            <a href="/doctorDashboard.html">Home</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "loggedPatient") {
        headerContent += `
            <a href="/patientDashboard.html">Home</a>
            <a href="/appointments.html">Appointments</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "patient") {
        // MODAL-based buttons
        headerContent += `
            <a href="#" id="loginModalBtn">Login</a>
            <a href="#" id="signupModalBtn">Sign Up</a>
        `;
    }

    headerDiv.innerHTML = headerContent;

    // listeners
    attachHeaderButtonListeners();

    function attachHeaderButtonListeners() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.addEventListener("click", logout);

        const addDocBtn = document.getElementById("addDocBtn");
        if (addDocBtn) addDocBtn.addEventListener("click", () => openModal("addDoctor"));

        // Modal triggers for unauthenticated patient
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

window.addEventListener("DOMContentLoaded", renderHeader);
