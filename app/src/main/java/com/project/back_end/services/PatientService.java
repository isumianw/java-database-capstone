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
import com.project.back_end.service.TokenService;

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
        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null || !patient.getId().equals(id)) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized access"));
        }

        List<AppointmentDTO> appointments = appointmentRepository.findByPatientId(id)
            .stream()
            .map(AppointmentDTO::fromEntity)
            .collect(Collectors.toList());

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
            .filterByDoctorNameAndPatientId(name, patientId)
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
            .filterByDoctorNameAndPatientIdAndStatus(name, patientId, status);

        List<AppointmentDTO> appointmentDTOs = appointments.stream()
            .map(AppointmentDTO::fromEntity)
            .collect(Collectors.toList());

        response.put("appointments", appointmentDTOs);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getPatientDetails(String token) {
        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Patient not found"));
        }

        return ResponseEntity.ok(Map.of("patient", patient));
    }
}

