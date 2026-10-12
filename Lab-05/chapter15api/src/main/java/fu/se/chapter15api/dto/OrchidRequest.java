package fu.se.chapter15api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrchidRequest(
        @NotBlank(message = "Tên hoa lan không được để trống")
        @Size(max = 100, message = "Tên hoa lan tối đa 100 ký tự")
        String orchidName,

        @NotNull(message = "Trạng thái tự nhiên không được để trống")
        @JsonProperty("isNatural")
        @JsonAlias({"natural", "is_natural"})
        Boolean isNatural,

        @Size(max = 500, message = "Mô tả tối đa 500 ký tự")
        String orchidDescription,

        @Size(max = 100, message = "Danh mục tối đa 100 ký tự")
        String orchidCategory,

        @NotNull(message = "Trạng thái thu hút không được để trống")
        @JsonProperty("isAttractive")
        @JsonAlias({"attractive", "is_attractive"})
        Boolean isAttractive,

        @Size(max = 500, message = "Đường dẫn hình ảnh tối đa 500 ký tự")
        @JsonProperty("orchidURL")
        @JsonAlias({"orchidUrl", "orchid_url"})
        String orchidURL
) {
}
