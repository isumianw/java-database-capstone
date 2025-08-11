package com.project.back_end.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import com.project.back_end.models.Admin;
import com.project.back_end.services.CommonService;

@RestController
@RequestMapping("${api.path}admin")
public class AdminController {

    private final CommonService service;

    @Autowired
    public AdminController(CommonService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Admin admin) {
        return service.validateAdmin(admin);
    }
}

