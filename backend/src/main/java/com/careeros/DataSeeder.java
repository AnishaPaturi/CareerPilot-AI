package com.careeros;

import com.careeros.model.Company;
import com.careeros.model.Drive;
import com.careeros.repository.CompanyRepository;
import com.careeros.repository.DriveRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Date;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(CompanyRepository companyRepo, DriveRepository driveRepo) {
        return args -> {
            if (companyRepo.count() == 0) {
                List<Company> companies = List.of(
                        createCompany("Google",                "A global technology company known for Android, Search, Cloud, and AI products.",                    "https://careers.google.com"),
                        createCompany("Microsoft",            "A multinational technology corporation developing software, hardware, and cloud services.",          "https://careers.microsoft.com"),
                        createCompany("Amazon Web Services",   "Amazon cloud computing division delivering AWS infrastructure and AI-powered solutions.",          "https://aws.amazon.com/careers"),
                        createCompany("Infosys",                "A leading Indian multinational IT services and consulting company.",                              "https://www.infosys.com/careers"),
                        createCompany("Tata Consultancy Services","The world largest IT services company headquartered in India.",                                 "https://www.tcs.com/careers"),
                        createCompany("Walmart",                "A multinational retail corporation building next-gen e-commerce and supply-chain technology.",   "https://careers.walmart.com")
                );
                companyRepo.saveAll(companies);
                System.out.println(">>> Seed data: " + companies.size() + " companies inserted.");
            }

            if (driveRepo.count() == 0) {
                java.util.Date today  = new java.util.Date();
                java.sql.Date date30  = new java.sql.Date(today.getTime() + 30L  * 86_400_000);
                java.sql.Date date60  = new java.sql.Date(today.getTime() + 60L  * 86_400_000);
                java.sql.Date date90  = new java.sql.Date(today.getTime() + 90L  * 86_400_000);
                java.sql.Date date120 = new java.sql.Date(today.getTime() + 120L * 86_400_000);

                List<Drive> drives = List.of(
                        createDrive(1,  "Google",              "Software Engineer",           25.0, 7.5, "CSE, IT, ECE",                              date30),
                        createDrive(2,  "Microsoft",           "Software Developer (Azure)",  18.0, 7.0, "CSE, IT",                                   date30),
                        createDrive(3,  "Amazon Web Services", "Cloud Engineer",              22.0, 8.0, "CSE, IT, ECE",                              date60),
                        createDrive(4,  "Infosys",             "Data Analyst",                12.0, 6.5, "CSE, IT, ECE",                              date60),
                        createDrive(5,  "TCS",                 "Full Stack Developer",        15.0, 7.0, "CSE, IT",                                   date90),
                        createDrive(6,  "Google",              "Machine Learning Engineer",   35.0, 8.5, "CSE, ECE",                                  date90),
                        createDrive(7,  "Walmart",             "Backend Engineer (Java)",     16.0, 7.0, "CSE, IT",                                   date120),
                        createDrive(8,  "Infosys",             "QA Engineer",                 10.0, 6.0, "CSE, IT, ECE",                              date120),
                        createDrive(9,  "Amazon Web Services", "DevOps Engineer",             20.0, 7.5, "CSE, IT",                                   date120),
                        createDrive(10, "Microsoft",           "Frontend Developer (React)",  14.0, 7.0, "CSE, IT",                                   date120)
                );
                driveRepo.saveAll(drives);
                System.out.println(">>> Seed data: " + drives.size() + " drives inserted.");
            }
        };
    }

    private static Company createCompany(String name, String description, String website) {
        Company c = new Company();
        c.setName(name);
        c.setDescription(description);
        c.setWebsite(website);
        return c;
    }

    private static Drive createDrive(int companyId, String companyName, String role, double pkg, double cgpa,
                                     String branches, java.sql.Date date) {
        Drive d = new Drive();
        d.setCompanyId(companyId);
        d.setCompanyName(companyName);
        d.setRole(role);
        d.setPackageLpa(pkg);
        d.setMinCgpa(cgpa);
        d.setAllowedBranches(branches);
        d.setDriveDate(date);
        return d;
    }
}
