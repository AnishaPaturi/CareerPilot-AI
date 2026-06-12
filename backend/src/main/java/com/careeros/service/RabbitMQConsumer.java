package com.careeros.service;

import com.careeros.config.RabbitMQConfig;
import com.careeros.dto.CustomMultipartFile;
import com.careeros.dto.ResumeParseTask;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// @Service
public class RabbitMQConsumer {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ResumeProcessingService resumeProcessingService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_RESUME_PARSE)
    public void consumeResumeParseTask(ResumeParseTask task) {
        System.out.println("Received async resume parsing task: " + task);
        try {
            // 1. Load bytes from disk
            byte[] fileBytes = fileStorageService.loadFileAsBytes(task.getFilePath());

            // 2. Wrap as custom MultipartFile
            CustomMultipartFile multipartFile = new CustomMultipartFile(
                    fileBytes,
                    "file",
                    task.getOriginalFileName(),
                    "application/pdf"
            );

            // 3. Process and save
            resumeProcessingService.processAndSaveResume(task.getStudentId(), multipartFile);
            System.out.println("Successfully processed async resume for student ID: " + task.getStudentId());

        } catch (Exception e) {
            System.err.println("Error processing async resume parse task: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // 4. Clean up stored file
            boolean deleted = fileStorageService.deleteFile(task.getFilePath());
            System.out.println("Temporary file deleted: " + deleted + " (" + task.getFilePath() + ")");
        }
    }
}
