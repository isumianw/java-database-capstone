// patientDashboard.js 

const PATIENT_API = API_BASE_URL + '/patient/login';

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();
  
    const btn = document.getElementById("patientSignup");
    if (btn) {
      btn.addEventListener("click", () => openModal("patientSignup"));
    }
  
    const loginBtn = document.getElementById("patientLogin");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => openModal("patientLogin"));
    }
  
    document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
    document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
    document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);
  });
  
  function loadDoctorCards() {
    getDoctors()
      .then(data => {
        
        const doctors = data.doctors || data;
  
        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = "";
  
        // Only loop if it's an array
        if (Array.isArray(doctors)) {
          doctors.forEach(doctor => {
            const card = createDoctorCard(doctor);
            contentDiv.appendChild(card);
          });
        } else {
          console.error("Doctors data is not an array:", doctors);
        }
      })
      .catch(error => {
        console.error("Failed to load doctors:", error);
      });
  }
  
  
  function filterDoctorsOnChange() {
    const searchBar = document.getElementById("searchBar").value.trim();
    const filterTime = document.getElementById("filterTime").value;
    const filterSpecialty = document.getElementById("filterSpecialty").value;
  
    const name = searchBar.length > 0 ? searchBar : null;
    const time = filterTime.length > 0 ? filterTime : null;
    const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;
  
    filterDoctors(name, time, specialty)
      .then(response => {
        // Ensure we always have an array
        const doctors = (response && response.doctors) || response || [];
  
        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = "";
  
        if (Array.isArray(doctors) && doctors.length > 0) {
          doctors.forEach(doctor => {
            const card = createDoctorCard(doctor);
            contentDiv.appendChild(card);
          });
        } else {
          contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
          console.log("Nothing found");
        }
      })
      .catch(error => {
        console.error("Failed to filter doctors:", error);
        alert("❌ An error occurred while filtering doctors.");
      });
  }
  
  
  window.signupPatient = async function () {
    try {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const phone = document.getElementById("phone").value;
      const address = document.getElementById("address").value;
  
      const data = { name, email, password, phone, address };
      const { success, message } = await patientSignup(data);
      if (success) {
        alert(message);
        document.getElementById("modal").style.display = "none";
        window.location.reload();
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("An error occurred while signing up.");
    }
  };
  
  
  window.loginPatient = async function () {
    try {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      const data = { email, password };
      const response = await patientLogin(data);
  
      if (response.ok) {
        const result = await response.json();
        selectRole("loggedPatient");
        localStorage.setItem("token", result.token);
        window.location.href = "/pages/loggedPatientDashboard.html";
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      alert("Failed to Login : " + error);
      console.error("Error :: loginPatient :: ", error);
    }
  };

  window.patientLoginHandler = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const patient = { email, password };

    try {
        const response = await fetch(PATIENT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patient),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", "loggedPatient");
            localStorage.setItem("patient", JSON.stringify(data.patient)); 

            window.location.href = "/pages/loggedPatientDashboard.html";
        } else {
            alert("Invalid credentials!");
        }
    } catch (error) {
        console.error("Patient login error:", error);
        alert("Something went wrong. Please try again.");
    }
};

  