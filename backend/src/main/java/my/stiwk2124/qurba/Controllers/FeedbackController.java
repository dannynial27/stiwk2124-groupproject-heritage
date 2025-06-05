package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Feedback;
import my.stiwk2124.qurba.dto.FeedbackRequest;
import my.stiwk2124.qurba.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @PostMapping("/{userId}")
    public ResponseEntity<?> createFeedback(
            @PathVariable Long userId,
            @RequestBody FeedbackRequest request) {
        try {
            Feedback feedback = feedbackService.createFeedback(
                    userId, request.getSubject(), request.getContent());
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create feedback: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserFeedbacks(@PathVariable Long userId) {
        try {
            List<Feedback> feedbacks = feedbackService.getUserFeedbacks(userId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve feedbacks: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @DeleteMapping("/{userId}/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(
            @PathVariable Long userId,
            @PathVariable Long feedbackId) {
        try {
            boolean deleted = feedbackService.deleteFeedback(feedbackId, userId);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Feedback not found or unauthorized");
                return ResponseEntity.status(404).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete feedback: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
