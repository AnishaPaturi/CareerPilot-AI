package com.careeros.controller;

import com.careeros.model.Notification;
import com.careeros.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(@PathVariable int userId) {
        return notificationRepository.findByUserId(userId);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable int id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok("Notification marked as read");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        try {
            Notification saved = notificationRepository.save(notification);
            if (messagingTemplate != null) {
                try {
                    messagingTemplate.convertAndSend("/topic/notifications/" + notification.getUserId(), saved);
                } catch (Exception wsEx) {
                    System.err.println("Could not send WebSocket notification: " + wsEx.getMessage());
                }
            }
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
