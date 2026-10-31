package vn.edu.fpt.slot32.product;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import vn.edu.fpt.slot32.category.CategoryRepository;
import vn.edu.fpt.slot32.common.NotFoundException;

@Service
public class ProductService {

    private final ProductRepository products;
    private final CategoryRepository categories;

    public ProductService(ProductRepository products, CategoryRepository categories) {
        this.products = products;
        this.categories = categories;
    }

    public List<Product> findAll(Boolean active, Boolean hdmi) {
        if (active != null && hdmi != null) {
            return products.findAll().stream()
                    .filter(product -> active.equals(product.active()))
                    .filter(product -> product.specs() != null && hdmi.equals(product.specs().hdmi()))
                    .toList();
        }
        if (active != null) {
            return products.findByActive(active);
        }
        if (hdmi != null) {
            return products.findBySpecsHdmi(hdmi);
        }
        return products.findAll();
    }

    public Product findById(String id) {
        return products.findById(id).orElseThrow(() -> new NotFoundException("Product not found: " + id));
    }

    public Product create(ProductRequest request) {
        if (request.categoryId() != null && !request.categoryId().isBlank()
                && !categories.existsById(request.categoryId())) {
            throw new NotFoundException("Referenced category not found: " + request.categoryId());
        }

        ProductSpecs specs = request.specs() == null ? null : new ProductSpecs(
                request.specs().ports(), request.specs().hdmi(), request.specs().powerDeliveryW());
        Dimensions dimensions = request.dimensions() == null ? null : new Dimensions(
                request.dimensions().widthCm(), request.dimensions().heightCm());

        return products.save(new Product(
                null,
                request.name().trim(),
                request.price(),
                request.active() == null ? true : request.active(),
                request.tags(),
                specs,
                dimensions,
                request.warrantyMonths(),
                blankToNull(request.categoryId()),
                Instant.now()));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
