package vn.edu.fpt.slot32.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank @Pattern(regexp = "[A-Z0-9-]+") String id,
        @NotBlank @Size(max = 80) String name) {
}
