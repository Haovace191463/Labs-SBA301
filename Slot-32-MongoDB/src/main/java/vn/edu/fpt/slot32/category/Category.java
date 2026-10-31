package vn.edu.fpt.slot32.category;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("categories")
public record Category(@Id String id, String name) {
}
