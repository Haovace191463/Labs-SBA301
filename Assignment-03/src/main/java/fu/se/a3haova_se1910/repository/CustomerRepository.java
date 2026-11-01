package fu.se.a3haova_se1910.repository;

import fu.se.a3haova_se1910.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    Optional<Customer> findByEmailAddress(String emailAddress);

    boolean existsByEmailAddress(String emailAddress);

    boolean existsByEmailAddressAndCustomerIdNot(String emailAddress, Integer customerId);

    List<Customer> findByCustomerFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(String fullName, String email);
}

