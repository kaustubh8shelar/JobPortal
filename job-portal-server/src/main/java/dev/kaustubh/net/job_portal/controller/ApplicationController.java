package dev.kaustubh.net.job_portal.controller;

import dev.kaustubh.net.job_portal.model.Application;
import dev.kaustubh.net.job_portal.model.Job;
import dev.kaustubh.net.job_portal.model.User;
import dev.kaustubh.net.job_portal.service.ApplicationService;
import dev.kaustubh.net.job_portal.service.JobService;
import dev.kaustubh.net.job_portal.service.UserService;
import dev.kaustubh.net.job_portal.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private JobService jobService;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<Application>> getApplications(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String jobId,
            @RequestParam(required = false) String status){
        return ResponseEntity.ok(applicationService.getApplications(userId, jobId, status));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createApplication(@RequestBody Application application, HttpServletRequest request){
        try {
            Job job = jobService.jobById(application.getJobId());
            if(job == null){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Job Not Found!");
            }

            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid.");
            }
            String token = authorizationHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            User user = userService.userByEmail(email);
            if(user == null){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found!");
            }

            Application savedApplication = applicationService.createApplication(application, email);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedApplication);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/{status}")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @PathVariable String status){
        try {
            Application application = applicationService.applicationById(id);
            application = applicationService.updateApplicationStatus(application, status);

            return ResponseEntity.status(HttpStatus.OK).body(application);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
