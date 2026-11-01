package fu.se.a3haova_se1910.security;

import fu.se.a3haova_se1910.entity.Customer;
import fu.se.a3haova_se1910.repository.CustomerRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final StaffConfig staffConfig;

    public CustomUserDetailsService(CustomerRepository customerRepository, StaffConfig staffConfig) {
        this.customerRepository = customerRepository;
        this.staffConfig = staffConfig;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check if email matches Staff credentials loaded from application.properties
        if (staffConfig.getStaffEmail() != null && staffConfig.getStaffEmail().equalsIgnoreCase(email.trim())) {
            return new UserPrincipal(
                    staffConfig.getStaffEmail(),
                    staffConfig.getStaffPassword(),
                    "Hotel Staff",
                    "ROLE_STAFF",
                    null
            );
        }

        // 2. Check Customer table in database
        Customer customer = customerRepository.findByEmailAddress(email.trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new UserPrincipal(
                customer.getEmailAddress(),
                customer.getPassword(),
                customer.getCustomerFullName(),
                "ROLE_CUSTOMER",
                customer.getCustomerId()
        );
    }
}

