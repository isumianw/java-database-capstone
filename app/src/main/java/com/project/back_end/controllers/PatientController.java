package com.project.back_end.controllers;

import com.project.back_end.models.Patient;
import com.project.back_end.DTO.Login;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;
    private final Service service;

    @Autowired
    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> getPatientDetails(@PathVariable String token) {
        var tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        var patientDetails = patientService.getPatientDetails(token);
        return ResponseEntity.ok(patientDetails);
    }

    @PostMapping()
    public ResponseEntity<Map<String, String>> createPatient(@RequestBody Patient patient) {
        if (patientService.patientExists(patient.getEmail(), patient.getPhone())) {
            return ResponseEntity.status(409).body(Map.of("message", "Patient already exist"));
        }

        int result = patientService.createPatient(patient);
        if (result == 1) {
            return ResponseEntity.status(201).body(Map.of("message", "Signup successful"));
        } else {
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> patientLogin(@RequestBody Login login) {
        return service.validatePatientLogin(login);
    }

    @GetMapping("/{id}/{token}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long id, @PathVariable String token) {
        var tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        var appointments = patientService.getPatientAppointment(id, token);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/filter/{condition}/{name}/{token}")
    public ResponseEntity<?> filterPatientAppointments (
        @PathVariable String condition,
        @PathVariable String name,
        @PathVariable String token) {

        var tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
                return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        var filteredAppointments = service.filterPatient(condition, name, token);
        return ResponseEntity.ok(filteredAppointments);
    }

}


