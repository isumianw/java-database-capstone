// doctorCard.js

function createDoctorCard(doctor) {
    // Main card container
    const card = document.createElement("div");
    card.classList.add("doctor-card");
    const role = localStorage.getItem("userRole");

    // Doctor info section
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info");

    const name = document.createElement("h3");
    name.textContent = doctor.name;

    const specialization = document.createElement("p");
    specialization.textContent = `Specialty: ${doctor.specialty}`;

    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email}`;

    const availability = document.createElement("p");
    availability.textContent = `Available: ${doctor.availableTimes.join(", ")}`;

    infoDiv.appendChild(name);
    infoDiv.appendChild(specialization);
    infoDiv.appendChild(email);
    infoDiv.appendChild(availability);

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");

    if (role === "admin") {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Delete";
        removeBtn.addEventListener("click", async () => {
            const confirmed = confirm(`Are you sure you want to delete Dr. ${doctor.name}?`);
            if (!confirmed) return;

            const token = localStorage.getItem("token");
            try {
                await deleteDoctor(doctor.id, token); 
                card.remove();
            } catch (error) {
                console.error("Failed to delete doctor:", error);
                alert("Deletion failed. Try again.");
            }
        });
        actionsDiv.appendChild(removeBtn);
    } else if (role === "patient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.addEventListener("click", () => {
            alert("Please log in to book an appointment.");
        });
        actionsDiv.appendChild(bookNow);
    } else if (role === "loggedPatient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.addEventListener("click", async (e) => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not logged in. Please log in first.");
                return;
            }
    
            try {
                const patientData = await getPatientData(token);
                
                if (!patientData) {
                    alert("Failed to load patient details. Please log in again.");
                    console.error("getPatientData returned null or undefined. Token:", token);
                    return;
                }
    
                console.log("Patient Data:", patientData); // Debug info
                showBookingOverlay(e, doctor, patientData);
            } catch (error) {
                console.error("Booking failed:", error);
                alert("Something went wrong. Please try again.");
            }
        });
        actionsDiv.appendChild(bookNow);
    }
    
    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);

    return card;
}


window.createDoctorCard = createDoctorCard;
