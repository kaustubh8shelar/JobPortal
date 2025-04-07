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

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Job> getJobsByFilter(String title,String location,String salary,String requiredEducation,String companyId,List<String> skillsRequired, String requiredExperience){
        Query query = new Query();
        if(title != null && !title.isEmpty()){
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
        if (requiredExperience != null && !requiredExperience.isEmpty()) {
            query.addCriteria(Criteria.where("requiredExperience").is(requiredExperience));
        }
        return mongoTemplate.find(query, Job.class);
    }

    public Job jobById(String id){
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found!"));
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
        int jobExp = parseExperience(requiredExp);
        int candExp = parseExperience(candidateExp);
        return candExp >= jobExp;
    }

    private int parseExperience(String experience) {
        try {
            return Integer.parseInt(experience);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
