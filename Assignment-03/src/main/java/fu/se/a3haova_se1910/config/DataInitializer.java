package fu.se.a3haova_se1910.config;

import fu.se.a3haova_se1910.entity.Customer;
import fu.se.a3haova_se1910.entity.RoomInformation;
import fu.se.a3haova_se1910.entity.RoomType;
import fu.se.a3haova_se1910.repository.CustomerRepository;
import fu.se.a3haova_se1910.repository.RoomInformationRepository;
import fu.se.a3haova_se1910.repository.RoomTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomInformationRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoomTypeRepository roomTypeRepository,
                           RoomInformationRepository roomRepository,
                           CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder) {
        this.roomTypeRepository = roomTypeRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Initialize Room Types if table is empty
        if (roomTypeRepository.count() == 0) {
            RoomType standard = new RoomType(null, "Standard Single", "Cozy single bed room with essential amenities", "Floors 1-2");
            RoomType deluxe = new RoomType(null, "Deluxe Double", "Spacious room with king bed, balcony and minibar", "Floors 3-4");
            RoomType suite = new RoomType(null, "Executive Suite", "Luxurious suite with private living room and ocean view", "Floor 5 VIP");

            roomTypeRepository.save(standard);
            roomTypeRepository.save(deluxe);
            roomTypeRepository.save(suite);

            // Initialize Sample Rooms
            if (roomRepository.count() == 0) {
                roomRepository.save(new RoomInformation(null, "101", "Standard room near elevator", 1, standard, (byte) 1, BigDecimal.valueOf(50.00)));
                roomRepository.save(new RoomInformation(null, "102", "Quiet standard room with courtyard view", 1, standard, (byte) 1, BigDecimal.valueOf(55.00)));
                roomRepository.save(new RoomInformation(null, "201", "Deluxe double with balcony", 2, deluxe, (byte) 1, BigDecimal.valueOf(90.00)));
                roomRepository.save(new RoomInformation(null, "202", "Deluxe double corner room", 2, deluxe, (byte) 1, BigDecimal.valueOf(95.00)));
                roomRepository.save(new RoomInformation(null, "301", "VIP Presidential Suite", 4, suite, (byte) 1, BigDecimal.valueOf(180.00)));
            }
        }

        // Initialize Sample Customer if table is empty
        if (customerRepository.count() == 0) {
            Customer customer = new Customer();
            customer.setCustomerFullName("Vo Anh Hao");
            customer.setTelephone("0901234567");
            customer.setEmailAddress("haova@fuminihotel.com");
            customer.setCustomerBirthday(LocalDate.of(2003, 5, 15));
            customer.setCustomerStatus((byte) 1);
            customer.setPassword(passwordEncoder.encode("Customer@123"));
            customerRepository.save(customer);
        }
    }
}

