package com.careeros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
@EnableCaching
// Force recompile check
public class CareerOsApplication {
    public static void main(String[] args) {
        SpringApplication.run(CareerOsApplication.class, args);
    }
}