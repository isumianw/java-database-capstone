package com.project.back_end.services;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.time.temporal.ChronoUnit;


import com.project.back_end.models.*;
import com.project.back_end.repo.*;
import com.project.back_end.DTO.Login;

@Service
public class CommonService {

    private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public CommonService(TokenService tokenService,
                    AdminRepository adminRepository,
                    DoctorRepository doctorRepository,
                    PatientRepository patientRepository,
                    DoctorService doctorService,
                    PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    public ResponseEntity<Map<String, String>> validateToken(String token, String user) {
        Map<String, String> response = new HashMap<>();

        boolean valid = tokenService.validateToken(token, user);

        if (!valid) {
            response.put("message", "Invalid or expired token");
            return ResponseEntity.status(401).body(response);
        }
        response.put("message", "Token is valid");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, String>> validateAdmin(Admin receivedAdmin) {
        Map<String, String> response = new HashMap<>();
        Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());

        if (admin == null) {
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }

        String token = tokenService.generateToken(admin.getEmail());
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
        // Normalize inputs
        if (name == null) name = "";
        else name = name.trim();
    
        if (specialty == null) specialty = "";
        else specialty = specialty.trim();
    
        if (time == null) time = "";
        else time = time.trim();
    
        // All filters empty → return all doctors
        if (name.isEmpty() && specialty.isEmpty() && time.isEmpty()) {
            return doctorService.getDoctors();
        }
    
        // Name + Specialty + Time
        if (!name.isEmpty() && !specialty.isEmpty() && !time.isEmpty()) {
            return doctorService.filterDoctorsByNameSpecilityandTime(name, specialty, time);
        }
    
        // Name + Specialty
        if (!name.isEmpty() && !specialty.isEmpty()) {
            return doctorService.filterDoctorByNameAndSpecility(name, specialty);
        }
    
        // Name + Time
        if (!name.isEmpty() && !time.isEmpty()) {
            return doctorService.filterDoctorByNameAndTime(name, time);
        }
    
        // Specialty + Time
        if (!specialty.isEmpty() && !time.isEmpty()) {
            return doctorService.filterDoctorByTimeAndSpecility(specialty, time);
        }
    
        // Name only
        if (!name.isEmpty()) {
            return doctorService.filterDoctorByNameAndTime(name, ""); // empty time
        }
    
        // Specialty only
        if (!specialty.isEmpty()) {
            return doctorService.filterDoctorBySpecility(specialty);
        }
    
        // Time only
        if (!time.isEmpty()) {
            return doctorService.filterDoctorsByTime(time);
        }
    
        // Fallback (should never hit)
        return doctorService.getDoctors();
    }
    
    public int validateAppointment(Appointment appointment) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(appointment.getDoctor().getId());
    
        if (doctorOpt.isEmpty()) {
            return -1; // doctor does not exist
        }
    
        var availableSlots = doctorService.getDoctorAvailability(
            appointment.getDoctor().getId(),
            appointment.getAppointmentTime().toLocalDate()
        );
    
        // Truncate seconds to match "HH:mm" format in availableSlots
        var timeString = appointment.getAppointmentTime()
                                    .toLocalTime()
                                    .truncatedTo(ChronoUnit.MINUTES)
                                    .toString();
    
        if (availableSlots.contains(timeString)) {
            return 1; // time slot is available
        } else {
            return 0; // time slot unavailable
        }
    }

    public boolean validatePatient(Patient patient) {
        Patient existing = patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone());
        return existing == null;
    }

    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();
        Patient patient = patientRepository.findByEmail(login.getEmail());

        if (patient == null || !patient.getPassword().equals(login.getPassword())) {
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(401).body(response);
        }

        String token = tokenService.generateToken(patient.getEmail());
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        String email = tokenService.extractEmail(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        if (condition != null && !condition.isEmpty() && name != null && !name.isEmpty()) {
            return patientService.filterByDoctorAndCondition(condition, name, patient.getId());
        } else if (condition != null && !condition.isEmpty()) {
            return patientService.filterByCondition(condition, patient.getId());
        } else if (name != null && !name.isEmpty()) {
            return patientService.filterByDoctor(name, patient.getId());
        } else {
            return patientService.getPatientAppointment(patient.getId(), token);
        }
    }

}
