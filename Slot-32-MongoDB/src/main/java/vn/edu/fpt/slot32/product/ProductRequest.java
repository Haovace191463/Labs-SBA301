package vn.edu.fpt.slot32.product;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotBlank @Size(max = 120) String name,
        @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal price,
        Boolean active,
        List<@NotBlank String> tags,
        @Valid SpecsRequest specs,
        @Valid DimensionsRequest dimensions,
        @PositiveOrZero Integer warrantyMonths,
        String categoryId) {

    public record SpecsRequest(
            @PositiveOrZero Integer ports,
            Boolean hdmi,
            @PositiveOrZero Integer powerDeliveryW) {
    }

    public record DimensionsRequest(
            @DecimalMin("0.0") BigDecimal widthCm,
            @DecimalMin("0.0") BigDecimal heightCm) {
    }
}
