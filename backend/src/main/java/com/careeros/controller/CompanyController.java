package com.placement.controller;

import com.placement.model.Company;
import com.placement.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<String> createCompany(@RequestBody Company company) {
        companyRepository.save(company);
        return ResponseEntity.ok("Company created successfully");
    }

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }
}

