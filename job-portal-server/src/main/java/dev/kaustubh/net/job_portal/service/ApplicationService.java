package dev.kaustubh.net.job_portal.service;

import dev.kaustubh.net.job_portal.model.Application;
import dev.kaustubh.net.job_portal.model.User;
import dev.kaustubh.net.job_portal.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Application> getApplications(String userId, String jobId, String status){
        Query query = new Query();
        if(userId != null && !userId.isEmpty()){
            query.addCriteria(Criteria.where("userId").is(userId));
        }
        if (jobId != null && !jobId.isEmpty()) {
            query.addCriteria(Criteria.where("jobId").is(jobId));
        }
        if (status != null && !status.isEmpty()) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        return mongoTemplate.find(query, Application.class);
    }

    public List<Application> allApplications(){
        return applicationRepository.findAll();
    }

    public Application applicationById(String id){
        return applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found!"));
    }

    public List<Application> applicationByJobId(String jobId){
        return applicationRepository.findByJobId(jobId).orElseThrow(() -> new RuntimeException("Application not found!"));
    }

    public void deleteApplication(String id) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application with ID " + id + " not found.");
        }
        applicationRepository.deleteById(id);
    }

    public Application createApplication(Application application, String userId){
        application.setUserId(userId);
        return applicationRepository.save(application);
    }

    public Application updateApplicationStatus(Application application, String status){
        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
