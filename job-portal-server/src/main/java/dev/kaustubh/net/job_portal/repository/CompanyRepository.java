package dev.kaustubh.net.job_portal.repository;

import dev.kaustubh.net.job_portal.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {
//    @Query(value = "{}", fields = "{'name': 1}")
//    List<Company> findDistinctCompanyNames();

}
