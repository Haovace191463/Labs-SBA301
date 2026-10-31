package vn.edu.fpt.slot32.product;

import java.math.BigDecimal;

import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

public record Dimensions(
        @Field(targetType = FieldType.DECIMAL128) BigDecimal widthCm,
        @Field(targetType = FieldType.DECIMAL128) BigDecimal heightCm) {
}
