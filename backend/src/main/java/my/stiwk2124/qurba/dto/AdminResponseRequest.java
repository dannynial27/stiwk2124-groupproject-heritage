package my.stiwk2124.qurba.dto;

import lombok.Data;

@Data
public class AdminResponseRequest {
    private String response;
    
    // Getter and setter
    public String getResponse() {
        return response;
    }
    
    public void setResponse(String response) {
        this.response = response;
    }
}