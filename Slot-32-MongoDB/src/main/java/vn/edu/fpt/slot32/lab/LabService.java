package vn.edu.fpt.slot32.lab;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import vn.edu.fpt.slot32.category.Category;
import vn.edu.fpt.slot32.category.CategoryRepository;
import vn.edu.fpt.slot32.product.Dimensions;
import vn.edu.fpt.slot32.product.Product;
import vn.edu.fpt.slot32.product.ProductRepository;
import vn.edu.fpt.slot32.product.ProductSpecs;

@Service
public class LabService {

    private final MongoTemplate mongoTemplate;
    private final ProductRepository products;
    private final CategoryRepository categories;

    public LabService(MongoTemplate mongoTemplate, ProductRepository products, CategoryRepository categories) {
        this.mongoTemplate = mongoTemplate;
        this.products = products;
        this.categories = categories;
    }

    public Map<String, Object> status() {
        Document ping = mongoTemplate.executeCommand(new Document("ping", 1));
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("connected", ping.getDouble("ok") == 1.0);
        response.put("database", mongoTemplate.getDb().getName());
        response.put("collections", mongoTemplate.getCollectionNames());
        response.put("mentalModel", "Spring driver -> mongod/Atlas -> database -> collection -> BSON document");
        response.put("compassReminder", "Compass is a client, not the database server");
        return response;
    }

    public SeedResult seed() {
        Category category = categories.findById("CAT-ACC")
                .orElseGet(() -> categories.save(new Category("CAT-ACC", "Accessories")));

        if (products.count() == 0) {
            products.saveAll(List.of(
                    new Product(null, "Mechanical Keyboard", new BigDecimal("79.90"), true,
                            List.of("keyboard", "office"), null, null, null, category.id(), Instant.now()),
                    new Product(null, "USB-C Hub", new BigDecimal("49.50"), true,
                            List.of("usb-c", "accessory"), new ProductSpecs(7, true, 100), null, null,
                            category.id(), Instant.now()),
                    new Product(null, "Wireless Mouse", new BigDecimal("25.00"), true,
                            null, null, null, 12, category.id(), Instant.now()),
                    new Product(null, "Monitor", new BigDecimal("199.00"), true,
                            List.of("display", "office"), null,
                            new Dimensions(new BigDecimal("61.2"), new BigDecimal("45.0")), null, null,
                            Instant.now()),
                    new Product(null, "Mouse Pad", new BigDecimal("9.50"), true,
                            List.of("desk"), null, null, null, category.id(), Instant.now())));
        }

        return new SeedResult(categories.count(), products.count(), "Existing data is preserved; samples insert only when products is empty");
    }

    public record SeedResult(long categories, long products, String behavior) {
    }
}
