package com.project.back_end.services;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import com.project.back_end.models.Prescription;
import com.project.back_end.repo.PrescriptionRepository;

@Service
public class PrescriptionService {
    
    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public ResponseEntity<Map<String, String>> savePrescription(Prescription prescription) {
        Map<String, String> response = new HashMap<>();

        try {
            List<Prescription> existing = prescriptionRepository.findByAppointmentId(prescription.getAppointmentId());
            if (existing != null) {
                response.put("message", "Prescription already exists for this appointment");
                return ResponseEntity.status(400).body(response);
            }

            prescriptionRepository.save(prescription);
            response.put("message", "Prescription saved");
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            response.put("message", "Error saving prescription");
            return ResponseEntity.status(500).body(response);
        }
        
    }

    public ResponseEntity<Map<String, Object>> getPrescription(Long appointmentId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Prescription> prescription = prescriptionRepository.findByAppointmentId(appointmentId);

            if (prescription == null) {
                response.put("message", "Prescription not found");
                return ResponseEntity.status(404).body(response);
            }

            response.put("prescription", prescription);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error fetching prescription");
            return ResponseEntity.status(500).body(response);
        }
    }
}
