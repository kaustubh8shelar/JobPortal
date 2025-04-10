package dev.kaustubh.net.job_portal.service;

import dev.kaustubh.net.job_portal.model.Application;
import dev.kaustubh.net.job_portal.model.Job;
import dev.kaustubh.net.job_portal.model.User;
import dev.kaustubh.net.job_portal.repository.JobRepository;
import dev.kaustubh.net.job_portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public Map<String, Object> getJobsByFilter(String title, String location, String salary, String requiredEducation, String companyId, List<String> skillsRequired, String requiredExperience, int page, int size) {
        Query query = new Query();

        if (title != null && !title.isEmpty()) {
            query.addCriteria(Criteria.where("title").is(title));
        }
        if (location != null && !location.isEmpty()) {
            query.addCriteria(Criteria.where("location").is(location));
        }
        if (salary != null && !salary.isEmpty()) {
            query.addCriteria(Criteria.where("salary").is(salary));
        }
        if (requiredEducation != null && !requiredEducation.isEmpty()) {
            query.addCriteria(Criteria.where("requiredEducation").is(requiredEducation));
        }
        if (companyId != null && !companyId.isEmpty()) {
            query.addCriteria(Criteria.where("companyId").is(companyId));
        }
        if (skillsRequired != null && !skillsRequired.isEmpty()) {
            query.addCriteria(Criteria.where("skillsRequired").in(skillsRequired));
        }

        List<Job> filteredJobs;

        // Handle requiredExperience filtering manually
        if (requiredExperience != null && !requiredExperience.isEmpty()) {
            try {
                int experience = Integer.parseInt(requiredExperience.trim());
                List<Job> allJobs = mongoTemplate.find(query, Job.class);

                filteredJobs = allJobs.stream()
                        .filter(job -> {
                            try {
                                String range = job.getRequiredExperience(); // Assuming it's like "2 - 5"
                                String[] parts = range.split(" - ");
                                if (parts.length == 2) {
                                    int min = Integer.parseInt(parts[0].trim());
                                    int max = Integer.parseInt(parts[1].trim());
                                    return experience >= min && experience <= max;
                                }
                            } catch (Exception e) {
                                // Skip invalid format
                            }
                            return false;
                        })
                        .collect(Collectors.toList());
            } catch (NumberFormatException e) {
                // Invalid experience input, fallback to empty
                filteredJobs = new ArrayList<>();
            }
        } else {
            filteredJobs = mongoTemplate.find(query, Job.class);
        }

        long total = filteredJobs.size();

        // Apply pagination manually
        int fromIndex = Math.min((page - 1) * size, filteredJobs.size());
        int toIndex = Math.min(fromIndex + size, filteredJobs.size());
        List<Job> paginatedJobs = filteredJobs.subList(fromIndex, toIndex);

        // Wrap results
        Map<String, Object> response = new HashMap<>();
        response.put("jobs", paginatedJobs);
        response.put("totalElements", total);
        response.put("currentPage", page);
        response.put("totalPages", (int) Math.ceil((double) total / size));

        return response;
    }


    public Job jobById(String id){
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found!"));
    }

    public List<Job> getAllJobs(){
        return jobRepository.findAll();
    }

    public List<String> jobSkills(){
        return jobRepository.findDistinctSkills();
    }

    public List<String> jobLocations(){
        return jobRepository.findDistinctLocations()
                .stream()
                .map(Job::getLocation)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<Job> jobByEmployerId(String employerId){
        return jobRepository.findByEmployerId(employerId);
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public void deleteJob(String id) {
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job with ID " + id + " not found.");
        }
        jobRepository.deleteById(id);
    }

    public Job updateJob(String id, Job jobUpdates) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (jobUpdates.getTitle() != null) {
            existingJob.setTitle(jobUpdates.getTitle());
        }
        if (jobUpdates.getDescription() != null) {
            existingJob.setDescription(jobUpdates.getDescription());
        }
        if (jobUpdates.getLocation() != null) {
            existingJob.setLocation(jobUpdates.getLocation());
        }
        if (jobUpdates.getSalary() != null) {
            existingJob.setSalary(jobUpdates.getSalary());
        }
        if (jobUpdates.getSkillsRequired() != null) {
            List<String> existingSkills = existingJob.getSkillsRequired();
            if(existingSkills != null){
                jobUpdates.getSkillsRequired().forEach(skill -> {
                    if (!existingSkills.contains(skill)) {
                        existingSkills.add(skill);
                    }
                });
            }else {
                existingJob.setSkillsRequired(jobUpdates.getSkillsRequired());
            }
        }
        if (jobUpdates.getEmployerId() != null) {
            existingJob.setEmployerId(jobUpdates.getEmployerId());
        }
        if (jobUpdates.getRequiredExperience() != null) {
            existingJob.setRequiredExperience(jobUpdates.getRequiredExperience());
        }
        if (jobUpdates.getRequiredEducation() != null) {
            existingJob.setRequiredEducation(jobUpdates.getRequiredEducation());
        }
        if (jobUpdates.getCompanyId() != null) {
            existingJob.setCompanyId(jobUpdates.getCompanyId());
        }
        if (jobUpdates.getPostedAt() != null) {
            existingJob.setPostedAt(jobUpdates.getPostedAt());
        }

        return jobRepository.save(existingJob);
    }

    public List<Job> recommendJobs(String candidateId) {
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        List<Job> allJobs = jobRepository.findAll();
        for(Job job: allJobs){
            System.out.println("job: "+job.getTitle());
        }

        return allJobs.stream()
                .filter(job -> hasMatchingSkills(job, candidate))
                .filter(job -> isExperienceMatching(job.getRequiredExperience(), candidate.getExperience()))
                .collect(Collectors.toList());
    }

    private boolean hasMatchingSkills(Job job, User candidate) {
        Set<String> jobSkills = new HashSet<>(job.getSkillsRequired());
        Set<String> candidateSkills = new HashSet<>(candidate.getSkills());
        jobSkills.retainAll(candidateSkills);
        return !jobSkills.isEmpty();  // Recommend if at least one skill matches
    }

    private boolean isExperienceMatching(String requiredExp, String candidateExp) {
        int candidateExperience = Integer.parseInt(candidateExp);  // assuming experience is already an integer

        String[] experienceRange = requiredExp.split(" - ");
        System.out.println("requiredExp: "+requiredExp);
        System.out.println("candidateExperience: "+candidateExperience);
        System.out.println("Range: " + Arrays.toString(experienceRange));
        if (experienceRange.length == 2) {
            int minExperience = Integer.parseInt(experienceRange[0].trim());
            int maxExperience = Integer.parseInt(experienceRange[1].trim());
            System.out.println("Bool: " + (candidateExperience >= minExperience && candidateExperience <= maxExperience));
            return candidateExperience >= minExperience && candidateExperience <= maxExperience;
        }
        return false;  // If experience range is not valid
    }
}
