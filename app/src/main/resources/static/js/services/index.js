import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";
import { selectRole } from "/js/render.js"

const ADMIN_API = API_BASE_URL + '/admin';
const DOCTOR_API = API_BASE_URL + '/doctor/login';
const PATIENT_API = API_BASE_URL + '/patient/login'

window.onload = function () {
    const adminBtn = document.getElementById('admin-btn');
    const doctorBtn = document.getElementById('doctor-btn');
    const patientBtn = document.getElementById('patient-btn');

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            openModal('adminLogin');
        });
    }

    if (doctorBtn) {
        doctorBtn.addEventListener('click', () => {
            openModal('doctorLogin');
        });
    }

    if (patientBtn) {
        patientBtn.addEventListener('click', () => {
            openModal('patientLogin'); 
        });
    }

    window.adminLoginHandler = async function () {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const admin = { username, password };

        try {
            const response = await fetch(ADMIN_API + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(admin),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                selectRole("admin");
            } else {
                alert("Invalid credentials!");
            }
        } catch (error) {
            console.error("Admin login error:", error);
            alert("Something went wrong. Please try again.");
        }
    }

    window.doctorLoginHandler = async function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const doctor = { email, password };

        try {
            const response = await fetch(DOCTOR_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(doctor),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                selectRole("doctor");
            } else {
                alert("Invalid credentials!");
            }
        } catch (error) {
            console.error("Doctor login error:", error);
            alert("Something went wrong. Please try again.");
        }
    }

    window.patientLoginHandler = async function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const patient = { email, password };

        try {
            const response = await fetch(PATIENT_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patient),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                selectRole("patient");
            } else {
                alert("Invalid credentials!");
            }
        } catch (error) {
            console.error("Patient login error:", error);
            alert("Something went wrong. Please try again.");
        }
    }
}