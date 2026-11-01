package fu.se.a3haova_se1910.service;

import fu.se.a3haova_se1910.dto.auth.AuthRequest;
import fu.se.a3haova_se1910.dto.auth.AuthResponse;
import fu.se.a3haova_se1910.dto.auth.CustomerRegisterRequest;
import fu.se.a3haova_se1910.dto.customer.CustomerDto;
import fu.se.a3haova_se1910.entity.Customer;
import fu.se.a3haova_se1910.exception.BadRequestException;
import fu.se.a3haova_se1910.exception.UnauthorizedException;
import fu.se.a3haova_se1910.repository.CustomerRepository;
import fu.se.a3haova_se1910.security.JwtTokenProvider;
import fu.se.a3haova_se1910.security.StaffConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private StaffConfig staffConfig;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testStaffLogin_Success() {
        when(staffConfig.getStaffEmail()).thenReturn("staff@fuminihotel.com");
        when(staffConfig.getStaffPassword()).thenReturn("Staff@123");
        when(tokenProvider.generateToken(any())).thenReturn("mock.jwt.token");

        AuthRequest request = new AuthRequest("staff@fuminihotel.com", "Staff@123");
        AuthResponse response = authService.loginStaff(request);

        assertNotNull(response);
        assertEquals("ROLE_STAFF", response.getRole());
        assertEquals("mock.jwt.token", response.getToken());
    }

    @Test
    void testStaffLogin_WrongPassword() {
        when(staffConfig.getStaffEmail()).thenReturn("staff@fuminihotel.com");
        when(staffConfig.getStaffPassword()).thenReturn("Staff@123");

        AuthRequest request = new AuthRequest("staff@fuminihotel.com", "WrongPassword");
        assertThrows(UnauthorizedException.class, () -> authService.loginStaff(request));
    }

    @Test
    void testCustomerLogin_Success() {
        Customer customer = new Customer(1, "Test Customer", "0123456789", "test@hotel.com",
                LocalDate.of(2000, 1, 1), (byte) 1, "encodedPassword");

        when(customerRepository.findByEmailAddress("test@hotel.com")).thenReturn(Optional.of(customer));
        when(passwordEncoder.matches("rawPassword", "encodedPassword")).thenReturn(true);
        when(tokenProvider.generateToken(any())).thenReturn("customer.jwt.token");

        AuthRequest request = new AuthRequest("test@hotel.com", "rawPassword");
        AuthResponse response = authService.loginCustomer(request);

        assertNotNull(response);
        assertEquals("ROLE_CUSTOMER", response.getRole());
        assertEquals(1, response.getCustomerId());
    }

    @Test
    void testCustomerRegister_DuplicateEmail() {
        when(customerRepository.existsByEmailAddress("existing@hotel.com")).thenReturn(true);

        CustomerRegisterRequest request = new CustomerRegisterRequest();
        request.setEmailAddress("existing@hotel.com");
        request.setCustomerFullName("Name");
        request.setPassword("123456");

        assertThrows(BadRequestException.class, () -> authService.registerCustomer(request));
    }
}

