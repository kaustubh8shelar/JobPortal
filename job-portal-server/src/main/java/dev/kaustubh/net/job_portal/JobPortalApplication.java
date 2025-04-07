package dev.kaustubh.net.job_portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@RestController
public class JobPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobPortalApplication.class, args);
	}

	@GetMapping("/home")
	public String getRoot(){

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String hash = "$2a$10$R9HTTKjjP39N0oA6F9W6LudQxpAOoIHJ3mof7KxiN7iWhp9MLfTMq";
		String plainPassword = "kaustubh@88";
//		System.out.println("plainPassword: " + plainPassword);
		System.out.println("Password matches: " + encoder.matches(plainPassword, hash));

		return "This is a Job Portal!.";
	}

	@GetMapping("/test")
	public ResponseEntity<Resource> getTest(){

		Path filePath = Paths.get("C:/files").resolve("C:\\Ericsson" + "\\").normalize();
		File file = filePath.toFile();
		if (!file.exists()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(null);
		}
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");
		headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");

		Resource resource = new FileSystemResource(file);
		return ResponseEntity.ok()
				.headers(headers)
				.body(resource);
	}


}
