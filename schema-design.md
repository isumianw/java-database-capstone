## MySQL Database Design

### Table: patients
- id: INT, Primary Key, Auto Increment
- first_name: VARCHAR(50), NOT NULL
- last_name: VARCHAR(50), NOT NUL
- dob: DATE, NOT NULL
- gender: INT (0 = Male, 1 = Female, 2 = Other)
- username: VARCHAR(50), UNIQUE, NOT NULL
- password_hash: VARCHAR(255), NOT NULL
- email: VARCHAR(100), UNIQUE
- phone: VARCHAR(15), NOT NULL
- address: VARCHAR(255)

### Table: doctors
- id: INT, Primary Key, Auto Increment
- first_name: VARCHAR(50), NOT NULL
- last_name: VARCHAR(50), NOT NULL
- specialization: VARCHAR(100), NOT NULL
- username: VARCHAR(50), UNQIUE, NOT NULL
- password_hash: VARCHAR(255), NOT NULL
- email: VARCHAR(100), UNQIUE, NOT NULL
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
- password_hash: VARCHAR(255), NOT NULL
- email: VARCHAR(100), UNIQUE

## MongoDB Collection Design

{
  "_id": "ObjectId('64fabc123456')",
  "appointmentId": 51,
  "patient": {
    "id": 201,
    "name": "John Smith",
    "age": 28,
    "gender": "Female"
  },
  "doctor": {
    "id": 103,
    "name": "Dr. James Ruby",
    "specialization": "General Physician"
  },
  "issuedDate": "2025-07-25T09:30:00Z",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "duration": "7 days",
      "notes": "After meals"
    },
    {
      "name": "Panadol",
      "dosage": "500mg",
      "frequency": "Every 6 hours",
      "duration": "5 days"
    }
  ],
  "doctorNotes": "Patient shows signs of mild infection. Monitor temperature daily.",
  "tags": ["infection", "antibiotics"],
  "pharmacy": {
    "name": "Medicare Pharmacy",
    "location": "Marker Street"
  }
  "refill": {
    "allowed": true,
    "refillCount": 1,
    "lastRefilled": "2025-07-27T08:00:00Z",
  }
  "attachments": [
    {
      "filename": "blood_test_results.pdf",
      "url": "/uploads/blodd_text_results.pdf"
    }
  ]
}
