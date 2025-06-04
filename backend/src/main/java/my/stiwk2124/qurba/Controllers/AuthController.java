package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.dto.AuthResponse;
import my.stiwk2124.qurba.dto.LoginRequest;
import my.stiwk2124.qurba.dto.RegisterRequest;
import my.stiwk2124.qurba.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
    
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody LoginRequest request) {
        return authService.adminLogin(request);
    }
}