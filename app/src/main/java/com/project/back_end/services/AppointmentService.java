package com.project.back_end.services;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.Optional;

import com.project.back_end.models.Appointment;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.PatientRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.services.TokenService;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final TokenService tokenService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                                PatientRepository patientRepository,
                                DoctorRepository doctorRepository,
                                TokenService tokenService) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.tokenService = tokenService;
    }

    public int bookAppointment(Appointment appointment) {
        try {
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, String>> updateAppointment(Appointment appointment) {
        Map<String, String> response = new HashMap<>();
        Optional<Appointment> existing = appointmentRepository.findById(appointment.getId());

        if (existing.isPresent()) {
            appointmentRepository.save(appointment);
            response.put("message", "Appointment updated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Appointment not found");
            return ResponseEntity.badRequest().body(response);
        }
    }

    public ResponseEntity<Map<String, String>> cancelAppointment(Long id, String token) {
        Map<String, String> response = new HashMap<>();
        java.util.Optional<Appointment> appointment = appointmentRepository.findById(id);

        if (appointment.isPresent()) {
            appointmentRepository.delete(appointment.get());
            response.put("message", "Appointment cancelled successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Appointment not found");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @Transactional
    public Map<String, Object> getAppointment(String pname, LocalDate date, String token) {
        
        String doctorEmail = tokenService.extractEmail(token);

        
        var doctor = doctorRepository.findByEmail(doctorEmail);
        if (doctor == null) {
            throw new RuntimeException("Doctor not found for email: " + doctorEmail);
        }

        List<Appointment> appointments = appointmentRepository
            .findByDoctorIdAndAppointmentTimeBetween(
                doctor.getId(), 
                date.atStartOfDay(), 
                date.plusDays(1).atStartOfDay()
            );

        if (pname != null && !pname.trim().isEmpty()) {
            String searchName = pname.toLowerCase().trim();
            appointments = appointments.stream()
                .filter(a -> a.getPatient() != null &&
                            a.getPatient().getName() != null &&
                            a.getPatient().getName().toLowerCase().trim().contains(searchName))
                .toList();
        }
        Map<String, Object> result = new HashMap<>();
        result.put("appointments", appointments);
        return result;
    }


    @Transactional
    public void changeStatus(Long appointmentId, int newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(newStatus);
        appointmentRepository.save(appointment);
    }


    public Optional<Appointment> getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId);
    }
    
}
