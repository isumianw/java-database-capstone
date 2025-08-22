package com.project.back_end.services;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.project.back_end.models.Patient;
import com.project.back_end.models.Appointment;
import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.repo.PatientRepository;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.services.TokenService;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public PatientService(PatientRepository patientRepository, 
                          AppointmentRepository appointmentRepository, 
                          TokenService tokenService) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    public boolean patientExists(String email, String phone) {
    Patient byEmail = patientRepository.findByEmail(email);
        if (byEmail != null) {
            return true;
        }
    
        Patient byPhone = patientRepository.findByPhone(phone);
        return byPhone != null;
    }


    public int createPatient(Patient patient) {
        try {
            patientRepository.save(patient);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> getPatientAppointment(Long id, String token) {
        String email = tokenService.extractEmail(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null || !patient.getId().equals(id)) {
            System.out.println("Unauthorized access: patient not found or ID mismatch");
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized access"));
        }

        // Fetch raw appointments from repository
        List<Appointment> rawAppointments = appointmentRepository.findByPatient_Id(id);
        System.out.println("Raw appointments from DB for patientId " + id + ": " + rawAppointments);

        // Map to DTOs
        List<AppointmentDTO> appointments = rawAppointments.stream()
        .map(app -> {
            System.out.println("Appointment ID: " + app.getId() +
                            ", Doctor: " + (app.getDoctor() != null ? app.getDoctor().getName() : "null") +
                            ", Patient: " + (app.getPatient() != null ? app.getPatient().getName() : "null") +
                            ", Status: " + app.getStatus() +
                            ", Time: " + app.getAppointmentTime());
            AppointmentDTO dto = AppointmentDTO.fromEntity(app);
            System.out.println("Mapped DTO: " + dto);
            return dto;
        })
        .collect(Collectors.toList());


        System.out.println("Final appointments list size: " + appointments.size());

        return ResponseEntity.ok(Map.of("appointments", appointments));
    }


    public ResponseEntity<Map<String, Object>> filterByCondition(String condition, Long patientId) {
        Map<String, Object> response = new HashMap<>();

        int status;
        if (condition.equalsIgnoreCase("past")) {
            status = 1;
        } else if (condition.equalsIgnoreCase("future")) {
            status = 0;
        } else {
            response.put("message", "Invalid condition. Use 'past' or 'future'.");
            return ResponseEntity.badRequest().body(response);
        }

        List<Appointment> appointments = appointmentRepository
            .findByPatient_IdAndStatusOrderByAppointmentTimeAsc(patientId, status);

        List<AppointmentDTO> appointmentDTOs = appointments.stream()
            .map(AppointmentDTO::fromEntity)
            .collect(Collectors.toList());

        response.put("appointments", appointmentDTOs);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> filterByDoctor(String name, Long patientId) {
        List<AppointmentDTO> dtos = appointmentRepository
            .filterByDoctorNameAndPatient_Id(name, patientId)
            .stream()
            .map(AppointmentDTO::fromEntity)
            .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("appointments", dtos));
    }

    public ResponseEntity<Map<String, Object>> filterByDoctorAndCondition(String condition, String name, Long patientId) {
        Map<String, Object> response = new HashMap<>();

        int status;
        if (condition.equalsIgnoreCase("past")) {
            status = 1;
        } else if (condition.equalsIgnoreCase("future")) {
            status = 0;
        } else {
            response.put("message", "Invalid condition. Use 'past' or 'future'.");
            return ResponseEntity.badRequest().body(response);
        }

        List<Appointment> appointments = appointmentRepository
            .filterByDoctorNameAndPatient_IdAndStatus(name, patientId, status);

        List<AppointmentDTO> appointmentDTOs = appointments.stream()
            .map(AppointmentDTO::fromEntity)
            .collect(Collectors.toList());

        response.put("appointments", appointmentDTOs);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getPatientDetails(String token) {
        String email = tokenService.extractEmail(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Patient not found"));
        }

        return ResponseEntity.ok(Map.of("patient", patient));
    }
}

