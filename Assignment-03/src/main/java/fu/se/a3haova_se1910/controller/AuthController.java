package fu.se.a3haova_se1910.controller;

import fu.se.a3haova_se1910.dto.auth.AuthRequest;
import fu.se.a3haova_se1910.dto.auth.AuthResponse;
import fu.se.a3haova_se1910.dto.auth.CustomerRegisterRequest;
import fu.se.a3haova_se1910.dto.common.ApiResponse;
import fu.se.a3haova_se1910.dto.customer.CustomerDto;
import fu.se.a3haova_se1910.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/staff/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginStaff(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.loginStaff(request);
        return ResponseEntity.ok(ApiResponse.ok("Staff authentication successful", response));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginCustomer(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.loginCustomer(request);
        return ResponseEntity.ok(ApiResponse.ok("Customer authentication successful", response));
    }

    @PostMapping("/customer/register")
    public ResponseEntity<ApiResponse<CustomerDto>> registerCustomer(@Valid @RequestBody CustomerRegisterRequest request) {
        CustomerDto response = authService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Customer registration successful", response));
    }
}

