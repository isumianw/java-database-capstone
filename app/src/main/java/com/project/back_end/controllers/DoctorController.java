package com.project.back_end.controllers;

import com.project.back_end.models.Doctor;
import com.project.back_end.DTO.Login;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping("${api.path}doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final CommonService service;

    @Autowired
    public DoctorController(DoctorService doctorService, CommonService service) {
        this.doctorService = doctorService;
        this.service = service;
    }

    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<?> getDoctorAvailability(
        @PathVariable String user,
        @PathVariable Long doctorId,
        @PathVariable LocalDate date,
        @PathVariable String token) {

        var tokenValidation = service.validateToken(token, user);
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        Map<String, Object> availability = doctorService.getDoctorAvailability(doctorId, date);
        return ResponseEntity.ok(availability);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDoctors() {
        List<Doctor> doctorList = doctorService.getDoctors();
        Map<String, Object> response = Map.of("doctors", doctorList);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> addDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        var tokenValidation = service.validateToken(token, "admin");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        int result = doctorService.saveDoctor(doctor);
        if (result == 1) {
            return ResponseEntity.status(201).body(Map.of("message", "Doctor added to db"));
        } else if (result == 0) {
            return ResponseEntity.status(409).body(Map.of("message", "Doctor already exists"));
        } else {
            return ResponseEntity.status(500).body(Map.of("message", "Some internal error occurred"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> doctorLogin(@RequestBody Login login) {
        return doctorService.validateDoctor(login);
        
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        var tokenValidation = service.validateToken(token, "admin");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        int result = doctorService.updateDoctor(doctor);
        if (result == 1) {
            return ResponseEntity.ok(Map.of("message", "Doctor updated"));
        } else if (result == 0) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        } else {
            return ResponseEntity.status(500).body(Map.of("message", "Some internal error occurred"));
        }
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable Long id, @PathVariable String token) {
        var tokenValidation = service.validateToken(token, "admin");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        int result = doctorService.deleteDoctor(id);
        if (result == 1) {
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
        } else if (result == 0) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found with id"));
        } else {
            return ResponseEntity.status(500).body(Map.of("message", "Some internal error occurred"));
        }
    }

    @GetMapping("/filter/{name}/{time}/{specialty}")
    public ResponseEntity<Map<String, Object>> filterDoctors(@PathVariable String name,
                                                            @PathVariable String time,
                                                            @PathVariable String specialty) {
        Map<String, Object> filteredDoctors = service.filterDoctor(name, specialty, time);
        return ResponseEntity.ok(filteredDoctors);
    }

}
