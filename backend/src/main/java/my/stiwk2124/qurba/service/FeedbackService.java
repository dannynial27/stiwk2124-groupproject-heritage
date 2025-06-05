package my.stiwk2124.qurba.service;

import my.stiwk2124.qurba.JPAentities.Feedback;
import my.stiwk2124.qurba.JPAentities.User;
import my.stiwk2124.qurba.repository.FeedbackRepository;
import my.stiwk2124.qurba.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Customer methods
    
    @Transactional
    public Feedback createFeedback(Long userId, String subject, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setSubject(subject);
        feedback.setContent(content);
        feedback.setStatus(Feedback.Status.PENDING);
        feedback.setCreatedAt(LocalDateTime.now());
        
        return feedbackRepository.save(feedback);
    }
    
    @Transactional(readOnly = true)
    public List<Feedback> getUserFeedbacks(Long userId) {
        return feedbackRepository.findByUser_UserId(userId);
    }
    
    @Transactional
    public boolean deleteFeedback(Long feedbackId, Long userId) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        
        if (feedbackOpt.isPresent()) {
            Feedback feedback = feedbackOpt.get();
            
            // Check if the feedback belongs to the user
            if (feedback.getUser().getUserId().equals(userId)) {
                feedbackRepository.delete(feedback);
                return true;
            }
        }
        return false;
    }
    
    // Admin methods
    
    @Transactional(readOnly = true)
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAllOrderedByCreatedAtDesc();
    }
    
    @Transactional(readOnly = true)
    public List<Feedback> getFeedbacksByYearAndMonth(int year, Integer month) {
        if (month != null) {
            return feedbackRepository.findByYearAndMonth(year, month);
        } else {
            return feedbackRepository.findByYear(year);
        }
    }
    
    @Transactional
    public Optional<Feedback> respondToFeedback(Long feedbackId, String adminResponse) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        
        if (feedbackOpt.isPresent()) {
            Feedback feedback = feedbackOpt.get();
            feedback.setAdminResponse(adminResponse);
            feedback.setStatus(Feedback.Status.RESPONDED);
            feedback.setRespondedAt(LocalDateTime.now());
            return Optional.of(feedbackRepository.save(feedback));
        }
        
        return Optional.empty();
    }
    
    @Transactional
    public Optional<Feedback> markFeedbackAsRead(Long feedbackId) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        
        if (feedbackOpt.isPresent()) {
            Feedback feedback = feedbackOpt.get();
            if (feedback.getStatus() == Feedback.Status.PENDING) {
                feedback.setStatus(Feedback.Status.READ);
                return Optional.of(feedbackRepository.save(feedback));
            }
            return Optional.of(feedback);
        }
        
        return Optional.empty();
    }
}