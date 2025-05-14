package dev.kaustubh.net.job_portal.service;

import dev.kaustubh.net.job_portal.model.Company;
import dev.kaustubh.net.job_portal.model.Job;
import dev.kaustubh.net.job_portal.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Company> getCompanyByFilter(String name, String industry, String location, Integer size,
                                            String foundedYear, String createdBy, String createdAt, String updatedAt) {
        Query query = new Query();
        if(name != null && !name.isEmpty()) {
            query.addCriteria(Criteria.where("name").is(name));
        }
        if(industry != null && !industry.isEmpty()) {
            query.addCriteria(Criteria.where("industry").is(industry));
        }
        if(location != null && !location.isEmpty()) {
            query.addCriteria(Criteria.where("location").is(location));
        }
        if(size != null) {
            query.addCriteria(Criteria.where("size").is(size));
        }
        if(foundedYear != null && !foundedYear.isEmpty()) {
            query.addCriteria(Criteria.where("foundedYear").is(foundedYear));
        }
        if(createdBy != null && !createdBy.isEmpty()) {
            query.addCriteria(Criteria.where("createdBy").is(createdBy));
        }
        if(createdAt != null && !createdAt.isEmpty()) {
            query.addCriteria(Criteria.where("createdAt").is(createdAt));
        }
        if(updatedAt != null && !updatedAt.isEmpty()) {
            query.addCriteria(Criteria.where("updatedAt").is(updatedAt));
        }
        return mongoTemplate.find(query, Company.class);
    }

    public Company getCompanyById(String id) {
        return companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Company not found!"));
    }

    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }

    public Company updateCompany(String id, Company companyUpdates) {
        Company existingCompany = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (companyUpdates.getName() != null) {
            existingCompany.setName(companyUpdates.getName());
        }

        if (companyUpdates.getIndustry() != null) {
            existingCompany.setIndustry(companyUpdates.getIndustry());
        }

        if (companyUpdates.getLocation() != null) {
            existingCompany.setLocation(companyUpdates.getLocation());
        }

        if (companyUpdates.getWebsite() != null) {
            existingCompany.setWebsite(companyUpdates.getWebsite());
        }

        if (companyUpdates.getSize() != 0) {
            existingCompany.setSize(companyUpdates.getSize());
        }

        if (companyUpdates.getFoundedYear() != null) {
            existingCompany.setFoundedYear(companyUpdates.getFoundedYear());
        }

        if (companyUpdates.getDescription() != null) {
            existingCompany.setDescription(companyUpdates.getDescription());
        }

        if (companyUpdates.getLogoUrl() != null) {
            existingCompany.setLogoUrl(companyUpdates.getLogoUrl());
        }

        if (companyUpdates.getCreatedBy() != null) {
            existingCompany.setCreatedBy(companyUpdates.getCreatedBy());
        }

        if (companyUpdates.getCreatedAt() != null) {
            existingCompany.setCreatedAt(companyUpdates.getCreatedAt());
        }

        if (companyUpdates.getUpdatedAt() != null) {
            existingCompany.setUpdatedAt(companyUpdates.getUpdatedAt());
        }

        if (companyUpdates.getJobsPosted() != null) {
            List<String> existingJobs = existingCompany.getJobsPosted();
            if (existingJobs != null) {
                companyUpdates.getJobsPosted().forEach(job -> {
                    if (!existingJobs.contains(job)) {
                        existingJobs.add(job);
                    }
                });
            } else {
                existingCompany.setJobsPosted(companyUpdates.getJobsPosted());
            }
        }
        return companyRepository.save(existingCompany);
    }

    public List<String> getAllCompanyNames() {
        return mongoTemplate
                .getCollection("companies")
                .distinct("name", String.class)
                .into(new ArrayList<>());
    }
}
