// package com.careeros.service;

// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

// @Service
// public class EmailService {

//     private final JavaMailSender mailSender;

//     public EmailService(JavaMailSender mailSender) {
//         this.mailSender = mailSender;
//     }

//     public void sendEmail(String to, String subject, String text) {
//         SimpleMailMessage message = new SimpleMailMessage();
//         message.setTo(to);
//         message.setSubject(subject);
//         message.setText(text);
//         mailSender.send(message);
//     }

//     public void sendApplicationStatusUpdate(String studentEmail, String studentName, String companyName, String status) {
//         String subject = "Application Status Update - " + companyName;
//         String text = "Dear " + studentName + ",\n\n"
//                 + "Your application status with " + companyName + " has been updated to: " + status + "\n\n"
//                 + "Best regards,\nSmart Placement Team";
//         sendEmail(studentEmail, subject, text);
//     }
// }


package com.careeros.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {

        if (mailSender == null) {
            System.out.println("Email disabled: " + subject);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

    public void sendApplicationStatusUpdate(
            String studentEmail,
            String studentName,
            String companyName,
            String status) {

        String subject = "Application Status Update - " + companyName;

        String text =
                "Dear " + studentName + ",\n\n" +
                "Your application status with " + companyName +
                " has been updated to: " + status + "\n\n" +
                "Best regards,\nSmart Placement Team";

        sendEmail(studentEmail, subject, text);
    }
}