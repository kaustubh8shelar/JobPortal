package dev.kaustubh.net.job_portal.repository;

import dev.kaustubh.net.job_portal.model.Job;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByEmployerId(String employerId);

    @Aggregation(pipeline = {
            "{ $unwind: '$skillsRequired' }",
            "{ $group: { _id: '$skillsRequired' } }",
            "{ $project: { _id: 0, skill: '$_id' } }"
    })
    List<String> findDistinctSkills();

    @Query(value = "{}", fields = "{'location': 1}")
    List<Job> findDistinctLocations();
}
