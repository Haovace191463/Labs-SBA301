package fu.se.a3haova_se1910.service;

import fu.se.a3haova_se1910.dto.auth.CustomerRegisterRequest;
import fu.se.a3haova_se1910.dto.customer.CustomerDto;
import fu.se.a3haova_se1910.dto.customer.CustomerProfileUpdateRequest;
import fu.se.a3haova_se1910.dto.customer.CustomerUpdateRequest;
import fu.se.a3haova_se1910.entity.Customer;
import fu.se.a3haova_se1910.exception.BadRequestException;
import fu.se.a3haova_se1910.exception.ResourceNotFoundException;
import fu.se.a3haova_se1910.repository.BookingReservationRepository;
import fu.se.a3haova_se1910.repository.CustomerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final BookingReservationRepository bookingReservationRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository,
                           BookingReservationRepository bookingReservationRepository,
                           PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.bookingReservationRepository = bookingReservationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public CustomerDto getProfile(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
        return toDto(customer);
    }

    @Transactional
    public CustomerDto updateProfile(Integer customerId, CustomerProfileUpdateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        customer.setCustomerFullName(request.getCustomerFullName());
        customer.setTelephone(request.getTelephone());
        customer.setCustomerBirthday(request.getCustomerBirthday());

        if (StringUtils.hasText(request.getNewPassword())) {
            customer.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        Customer saved = customerRepository.save(customer);
        return toDto(saved);
    }

    public List<CustomerDto> getAllCustomers(String search) {
        List<Customer> customers;
        if (StringUtils.hasText(search)) {
            customers = customerRepository.findByCustomerFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(search.trim(), search.trim());
        } else {
            customers = customerRepository.findAll();
        }
        return customers.stream().map(this::toDto).collect(Collectors.toList());
    }

    public CustomerDto getCustomerById(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
        return toDto(customer);
    }

    @Transactional
    public CustomerDto createCustomer(CustomerRegisterRequest request) {
        if (customerRepository.existsByEmailAddress(request.getEmailAddress().trim())) {
            throw new BadRequestException("Email address already exists: " + request.getEmailAddress());
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getCustomerFullName());
        customer.setTelephone(request.getTelephone());
        customer.setEmailAddress(request.getEmailAddress().trim());
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus((byte) 1);
        customer.setPassword(passwordEncoder.encode(request.getPassword()));

        Customer saved = customerRepository.save(customer);
        return toDto(saved);
    }

    @Transactional
    public CustomerDto updateCustomer(Integer customerId, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customerRepository.existsByEmailAddressAndCustomerIdNot(request.getEmailAddress().trim(), customerId)) {
            throw new BadRequestException("Email address already in use by another customer: " + request.getEmailAddress());
        }

        customer.setCustomerFullName(request.getCustomerFullName());
        customer.setTelephone(request.getTelephone());
        customer.setEmailAddress(request.getEmailAddress().trim());
        customer.setCustomerBirthday(request.getCustomerBirthday());
        if (request.getCustomerStatus() != null) {
            customer.setCustomerStatus(request.getCustomerStatus());
        }
        if (StringUtils.hasText(request.getPassword())) {
            customer.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Customer saved = customerRepository.save(customer);
        return toDto(saved);
    }

    @Transactional
    public void deleteCustomer(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        // Check if customer has booking history
        boolean hasBookings = !bookingReservationRepository.findByCustomerIdOrderByBookingDateDesc(customerId).isEmpty();
        if (hasBookings) {
            // Safe deactivation to preserve booking integrity
            customer.setCustomerStatus((byte) 0);
            customerRepository.save(customer);
        } else {
            customerRepository.delete(customer);
        }
    }

    public CustomerDto toDto(Customer c) {
        return new CustomerDto(
                c.getCustomerId(),
                c.getCustomerFullName(),
                c.getTelephone(),
                c.getEmailAddress(),
                c.getCustomerBirthday(),
                c.getCustomerStatus()
        );
    }
}

