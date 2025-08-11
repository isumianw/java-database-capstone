package com.project.back_end.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.back_end.services.TokenService;

import java.util.Map;

@Controller
public class DashboardController {

    @Autowired
    private TokenService tokenService;

    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        boolean isValid = tokenService.validateToken(token, "admin");

        if (isValid) {
            return "admin/adminDashboard";  // valid token, show dashboard
        } else {
            return "redirect:/";  // invalid token, redirect
        }
    }


    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        boolean isValid = tokenService.validateToken(token, "doctor");

        if (isValid) {
            return "doctor/doctorDashboard";
        } else {
            return "redirect:/";
        }
    }

}
