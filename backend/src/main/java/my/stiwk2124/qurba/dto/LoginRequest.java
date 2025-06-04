package my.stiwk2124.qurba.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}