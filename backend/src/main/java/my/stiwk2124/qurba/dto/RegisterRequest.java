package my.stiwk2124.qurba.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role; // "ADMIN" or "CUSTOMER"
}