package dev.kaustubh.net.job_portal.controller;

import dev.kaustubh.net.job_portal.model.Company;
import dev.kaustubh.net.job_portal.model.Job;
import dev.kaustubh.net.job_portal.service.CompanyService;
import dev.kaustubh.net.job_portal.service.UserService;
import dev.kaustubh.net.job_portal.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<List<Company>> getAllCompanies(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String foundedYear,
            @RequestParam(required = false) String createdBy,
            @RequestParam(required = false) String createdAt,
            @RequestParam(required = false) String updatedAt){
        return ResponseEntity.ok(companyService.getCompanyByFilter(name,industry,location,size,foundedYear,createdBy,createdAt,updatedAt));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable String id){
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCompany(@RequestBody Company company, HttpServletRequest request){
        try {
            // Extract JWT token from the Authorization header
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid.");
            }

            String token = authorizationHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            // Verify if the user exists and is valid
            userService.userByEmail(email); // Throws exception if not found
            company.setCreatedBy(email); // Set employerId as the current user's email

            Company savedCompany = companyService.createCompany(company);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCompany);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable String id, @RequestBody Company companyUpdates){
        try{
            Company updatedCompany = companyService.updateCompany(id, companyUpdates);
            return ResponseEntity.status(HttpStatus.OK).body(updatedCompany);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/companyNames")
    public ResponseEntity<List<String>> getAllCompanyNames(){
        return ResponseEntity.ok(companyService.getAllCompanyNames());
    }
}
