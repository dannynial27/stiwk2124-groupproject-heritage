package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Feedback;
import my.stiwk2124.qurba.dto.AdminResponseRequest;
import my.stiwk2124.qurba.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/feedback")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @GetMapping
    public ResponseEntity<?> getAllFeedbacks() {
        try {
            List<Feedback> feedbacks = feedbackService.getAllFeedbacks();
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve feedbacks: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/filter")
    public ResponseEntity<?> filterFeedbacks(
            @RequestParam int year,
            @RequestParam(required = false) Integer month) {
        try {
            List<Feedback> feedbacks = feedbackService.getFeedbacksByYearAndMonth(year, month);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to filter feedbacks: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @PatchMapping("/{feedbackId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long feedbackId) {
        try {
            Optional<Feedback> feedback = feedbackService.markFeedbackAsRead(feedbackId);
            if (feedback.isPresent()) {
                return ResponseEntity.ok(feedback.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Feedback not found");
                return ResponseEntity.status(404).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to mark feedback as read: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @PostMapping("/{feedbackId}/respond")
    public ResponseEntity<?> respondToFeedback(
            @PathVariable Long feedbackId,
            @RequestBody AdminResponseRequest request) {
        try {
            Optional<Feedback> feedback = feedbackService.respondToFeedback(
                    feedbackId, request.getResponse());
            if (feedback.isPresent()) {
                return ResponseEntity.ok(feedback.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Feedback not found");
                return ResponseEntity.status(404).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to respond to feedback: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
