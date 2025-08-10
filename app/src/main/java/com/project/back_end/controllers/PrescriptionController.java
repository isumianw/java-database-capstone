package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}prescription")
public class PrescriptionController {
    
    private final PrescriptionService prescriptionService;
    private final Service service;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService, Service service) {
        this.prescriptionService = prescriptionService;
        this.service = service;
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> savePrescription(@PathVariable String token,
                                                                @RequestBody Prescription prescription) {
        var tokenValidation = service.validateToken(token, "doctor");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        prescriptionService.savePrescription(prescription);
        return ResponseEntity.status(201).body(Map.of("message", "Prescription saved successfully"));
    }

    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<?> getPrescription(@PathVariable Long appointmentId,
                                            @PathVariable String token) {
        var tokenValidation = service.validateToken(token, "doctor");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        var prescription = prescriptionService.getPrescription(appointmentId);
        if (prescription == null) {
            return ResponseEntity.status(404).body(Map.of("message", "No prescription found for appointment"));
        }

        return ResponseEntity.ok(prescription);
    }

}
