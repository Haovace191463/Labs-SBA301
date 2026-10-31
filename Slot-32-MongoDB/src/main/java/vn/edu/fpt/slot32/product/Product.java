package vn.edu.fpt.slot32.product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@Document("products")
public record Product(
        @Id String id,
        String name,
        @Field(targetType = FieldType.DECIMAL128) BigDecimal price,
        Boolean active,
        List<String> tags,
        ProductSpecs specs,
        Dimensions dimensions,
        Integer warrantyMonths,
        String categoryId,
        Instant createdAt) {
}
