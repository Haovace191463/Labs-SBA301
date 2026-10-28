package com.orchidhouse.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrchidRequest(
        @NotBlank(message = "Tên hoa lan không được để trống")
        @Size(max = 120, message = "Tên hoa lan tối đa 120 ký tự")
        String orchidName,
        @Size(max = 1000, message = "Mô tả tối đa 1000 ký tự")
        String orchidDescription,
        @Size(max = 500, message = "Đường dẫn hình ảnh tối đa 500 ký tự")
        String orchidUrl,
        @NotNull(message = "Giá không được để trống")
        @DecimalMin(value = "0.01", message = "Giá phải lớn hơn 0")
        @Digits(integer = 10, fraction = 2, message = "Giá tối đa 10 chữ số nguyên và 2 chữ số thập phân")
        BigDecimal price,
        boolean isNatural,
        @NotNull(message = "Danh mục không được để trống")
        Long categoryId) {
}
