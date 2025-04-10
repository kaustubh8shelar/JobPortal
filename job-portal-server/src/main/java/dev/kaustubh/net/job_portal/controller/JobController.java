package dev.kaustubh.net.job_portal.controller;

import dev.kaustubh.net.job_portal.model.Company;
import dev.kaustubh.net.job_portal.model.Job;
import dev.kaustubh.net.job_portal.model.User;
import dev.kaustubh.net.job_portal.service.CompanyService;
import dev.kaustubh.net.job_portal.service.JobService;
import dev.kaustubh.net.job_portal.service.UserService;
import dev.kaustubh.net.job_portal.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("")
    public  ResponseEntity<List<Job>> getAllJobs(){
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> getJobsByFilter(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String salary,
            @RequestParam(required = false) String requiredEducation,
            @RequestParam(required = false) String companyId,
            @RequestParam(required = false) List<String> skillsRequired,
            @RequestParam(required = false) String requiredExperience,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size){
        return ResponseEntity.ok(jobService.getJobsByFilter(title, location, salary, requiredEducation, companyId, skillsRequired, requiredExperience, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable String id){
        return ResponseEntity.ok(jobService.jobById(id));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<String>> getJobSkills(){
        return ResponseEntity.ok(jobService.jobSkills());
    }

    @GetMapping("/locations")
    public ResponseEntity<List<String>> getJobLocations(){
        return ResponseEntity.ok(jobService.jobLocations());
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<Job>> getJobByEmployerId(@PathVariable String employerId){
        return ResponseEntity.ok(jobService.jobByEmployerId(employerId));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createJob(@RequestBody Job job, HttpServletRequest request) {
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
            job.setEmployerId(email); // Set employerId as the current user's email

            Job savedJob = jobService.createJob(job);

            // updating the jobsPosted array in Company document
            mongoTemplate.update(Company.class)
                    .matching(Criteria.where("id").is(job.getCompanyId()))
                    .apply(new Update().push("jobsPosted").value(savedJob.getId()))
                    .first();

            return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable String id, @RequestBody Job jobUpdates) {
        try {
            Job updatedJob = jobService.updateJob(id, jobUpdates);
            return ResponseEntity.ok().body(updatedJob);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/recommendations/{candidateID}")
    public ResponseEntity<List<Job>> getRecommendedJobs(@PathVariable String candidateID) {
        List<Job> recommendedJobs = jobService.recommendJobs(candidateID);
        return ResponseEntity.ok(recommendedJobs);
    }

}
