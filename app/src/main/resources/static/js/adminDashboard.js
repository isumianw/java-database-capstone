// adminDashboard.js

// Add Doctor button opens modal
document.getElementById('addDocBtn').addEventListener('click', () => {
    openModal('addDoctor');
});

// Load doctor cards on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();
});

// Load all doctors and render cards
async function loadDoctorCards() {
    try {
        const response = await getDoctors(); 
        const doctors = response.doctors;  // access the array
        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = ""; 

        if (!doctors || doctors.length === 0) {
            contentDiv.innerHTML = "<p>No doctors found.</p>";
        } else {
            doctors.forEach(doctor => {
                const card = createDoctorCard(doctor); // globally defined
                contentDiv.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}

// Event listeners for filters
document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
document.getElementById("sortByTime").addEventListener("change", filterDoctorsOnChange); 
document.getElementById("filterBySpecialty").addEventListener("change", filterDoctorsOnChange);

async function filterDoctorsOnChange() {
    const searchValue = document.getElementById("searchBar").value;
    const timeValue = document.getElementById("sortByTime").value;
    const specialty = document.getElementById("filterBySpecialty").value;

    try {
        const doctors = await filterDoctors(searchValue, timeValue, specialty); // global
        renderDoctorCards(doctors);
    } catch (error) {
        console.error("Error filtering doctors:", error);
    }
}

// Render filtered doctors
function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML = "<p>No doctors found.</p>";
        return;
    }

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor); // global
        contentDiv.appendChild(card);
    });
}

// Add Doctor form submission handler
async function adminAddDoctor(event) {
    event.preventDefault();

    const name = document.getElementById("doctorName").value;
    const specialty = document.getElementById("specialization").value;
    const email = document.getElementById("doctorEmail").value;
    const password = document.getElementById("doctorPassword").value;
    const mobile = document.getElementById("doctorPhone").value;

    const availability = Array.from(document.querySelectorAll('input[name="availability"]:checked'))
        .map(cb => cb.value);
    
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Login required to add doctor.");
        return;
    }

    const doctorData = { name, specialty, email, password, mobile, availability };

    try {
        const result = await saveDoctor(doctorData, token); // global
        
        if (result.success) {
            alert("Doctor added successfully!");
            loadDoctorCards(); // refresh doctor list
            const form = document.getElementById("addDoctorForm");
            if (form) form.reset(); // clear form
        } else {
            alert("Failed to add doctor.");
        }
    } catch (error) {
        console.error("Error adding doctor:", error);
        alert("An error occurred while adding the doctor.");
    }
}

window.adminAddDoctor = adminAddDoctor;
