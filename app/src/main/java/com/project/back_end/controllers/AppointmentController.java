package com.project.back_end.controllers;

import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import java.time.LocalDateTime;

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
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;


    @Autowired
    public AppointmentController(AppointmentService appointmentService, CommonService service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @GetMapping("/{date}/{token}")
    public ResponseEntity<?> getAppointments(
            @PathVariable("date") LocalDate date,
            @PathVariable("token") String token,
            @RequestParam(value = "patientName", required = false) String patientName)  {

        var tokenValidation = service.validateToken(token, "doctor");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        // Treat empty string as no filter
        if ("".equals(patientName)) patientName = null;

        return ResponseEntity.ok(appointmentService.getAppointment(patientName, date, token));
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> body) {

        if (token.startsWith("Bearer ")) token = token.substring(7);

        var tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getBody().get("message").equals("Token is valid")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        try {
            Long doctorId = Long.valueOf(body.get("doctor").toString().replaceAll("[^0-9]", ""));
            Long patientId = Long.valueOf(body.get("patient").toString().replaceAll("[^0-9]", ""));
            LocalDateTime appointmentTime = LocalDateTime.parse(body.get("appointmentTime").toString());
            int status = Integer.parseInt(body.get("status").toString());

            Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
            Patient patient = patientRepository.findById(patientId).orElse(null);

            if (doctor == null || patient == null)
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid doctor or patient"));

            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setAppointmentTime(appointmentTime);
            appointment.setStatus(status);

            int validation = service.validateAppointment(appointment);
            if (validation == -1) return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
            if (validation == 0) return ResponseEntity.status(400).body(Map.of("message", "Time slot unavailable"));

            appointmentService.bookAppointment(appointment);
            return ResponseEntity.status(201).body(Map.of("message", "Appointment booked successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid request body"));
        }
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
