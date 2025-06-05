package my.stiwk2124.qurba.dto;

import lombok.Data;

@Data
public class FeedbackRequest {
    private String subject;
    private String content;
    
    // Getters and setters
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
}