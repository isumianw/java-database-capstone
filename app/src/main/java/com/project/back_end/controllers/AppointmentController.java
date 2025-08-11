package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final CommonService service;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, CommonService service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<?> getAppointments(@PathVariable String patientName, @PathVariable LocalDate date, @PathVariable String token) {
        var tokenValidation = service.validateToken(token, "doctor");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(appointmentService.getAppointment(patientName, date, token));
    }

    @PostMapping("/{token}")
    public ResponseEntity<?> bookAppointment(@PathVariable String token, @RequestBody Appointment appointment) {
        var tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        int validation = service.validateAppointment(appointment);
        if (validation == -1) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        } else if (validation == 0) {
            return ResponseEntity.status(400).body(Map.of("message", "Time slot unavailable"));
        }

        appointmentService.bookAppointment(appointment);
        return ResponseEntity.status(201).body(Map.of("message", "Appointment booked successfully"));
    }

    @PutMapping("/{token}")
    public ResponseEntity<?> updateAppointment(@PathVariable String token, @RequestBody Appointment appointment) {
        var tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        appointmentService.updateAppointment(appointment);
        return ResponseEntity.ok(Map.of("message", "Appointment updated successfully"));
    }

     @DeleteMapping("/{id}/{token}")
     public ResponseEntity<?> cancelAppointment(@PathVariable Long id,@PathVariable String token) {
        var tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        appointmentService.cancelAppointment(id, token);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));

     }
}
