package my.stiwk2124.qurba.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // Generates no-args constructor
@AllArgsConstructor // Generates constructor with all fields (token)
public class AuthResponse {
    private String token;
    private String message;
    
    public AuthResponse(String token) {
        this.token = token;
        this.message = null;
    }
}