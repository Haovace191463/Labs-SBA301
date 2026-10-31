package vn.edu.fpt.slot32.product;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByActive(Boolean active);
    List<Product> findBySpecsHdmi(Boolean hdmi);
}
