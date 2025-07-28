## MySQL Database Design

### Table: patients
- id: INT, Primary Key, Auto Increment
- first_name: VARCHAR(50), NOT NULL
- last_name: VARCHAR(50), NOT NUL
- dob: DATE, NOT NULL
- gender: INT (0 = Male, 1 = Female, 2 = Other)
- username: VARCHAR(50), UNIQUE, NOT NULL
- password: VARCHAR(255), NOT NULL
- phone: VARCHAR(15), NOT NULL
- address: VARCHAR(255)

### Table: doctors
- id: INT, Primary Key, Auto Increment
- first_name: VARCHAR(50), NOT NULL
- last_name: VARCHAR(50), NOT NULL
- specialization: VARCHAR(100), NOT NULL
- username: VARCHAR(50), UNQIUE, NOT NULL
- password: VARCHAR(255), NOT NULL
- phone: VARCHAR(15), NOT NULL

### Table: appointments
- id: INT, Primary Key, Auto Increment
- doctor_id: INT, Foreign Key → doctors(id)
- patient_id: INT, Foreign Key → patients(id)
- appointment_time: DATETIME, NOT NULL
- status: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)

### Table: admins
- id: INT, Primary Key, Auto Increment
- username: VARCHAR(50), UNIQUE, NOT NULL
- password: VARCHAR(255), NOT NULL

## MongoDB Collection Design

### Collection: prescriptions
```json
{
  "_id": "ObjectId('64abc123456')",
  "patientName": "John Smith",
  "appointmentId": 51,
  "medication": "Paracetamol",
  "dosage": "500mg",
  "doctorNotes": "Take 1 tablet every 6 hours.",
  "refillCount": 2,
  "pharmacy": {
    "name": "Walgreens SF",
    "location": "Market Street"
  }
}
