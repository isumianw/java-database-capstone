// Sample prescription data for MongoDB
db.prescriptions.insertMany([
  {
    patientName: "John Doe",
    appointmentId: 12345,
    medication: "Paracetamol",
    dosage: "500mg",
    instructions: "Take twice a day"
  },
  {
    patientName: "Jane Smith",
    appointmentId: 67890,
    medication: "Amoxicillin",
    dosage: "250mg",
    instructions: "Take three times a day"
  }
]);
