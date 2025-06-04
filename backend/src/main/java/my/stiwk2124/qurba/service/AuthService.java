package my.stiwk2124.qurba.service;

import my.stiwk2124.qurba.JPAentities.Role;
import my.stiwk2124.qurba.JPAentities.User;
import my.stiwk2124.qurba.dto.AuthResponse;
import my.stiwk2124.qurba.dto.LoginRequest;
import my.stiwk2124.qurba.dto.RegisterRequest;
import my.stiwk2124.qurba.repository.RoleRepository;
import my.stiwk2124.qurba.repository.UserRepository;
import my.stiwk2124.qurba.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) || userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Username or email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Get role from repository
        Role.RoleName roleName = Role.RoleName.valueOf(request.getRole().toUpperCase());
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);
        user.setEnabled(true);

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().getName().name(), user.getUserId());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtil.generateToken(username, user.getRole().getName().name(), user.getUserId());
        return new AuthResponse(token);
    }
    
    public ResponseEntity<AuthResponse> adminLogin(LoginRequest request) {
        try {
            // Authenticate credentials
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            // Get user details
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Check if user has ADMIN role
            if (user.getRole().getName() != Role.RoleName.ADMIN) {
                AuthResponse response = new AuthResponse(null);
                response.setMessage("Access denied. Admin privileges required.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            
            // Generate token for admin
            String token = jwtUtil.generateToken(username, user.getRole().getName().name(), user.getUserId());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(null);
            response.setMessage("Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}