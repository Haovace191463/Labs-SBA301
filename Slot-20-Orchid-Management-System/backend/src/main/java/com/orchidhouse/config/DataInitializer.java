package com.orchidhouse.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.orchidhouse.model.Category;
import com.orchidhouse.model.Orchid;
import com.orchidhouse.repository.CategoryRepository;
import com.orchidhouse.repository.OrchidRepository;

@Configuration
@Profile("!prod")
public class DataInitializer {

    @Bean
    CommandLineRunner seedInitialData(CategoryRepository categories, OrchidRepository orchids) {
        return args -> {
            if (categories.count() > 0) {
                return;
            }
            List<Category> savedCategories = categories.saveAll(List.of(
                    new Category("Hồ điệp"),
                    new Category("Lan vũ nữ"),
                    new Category("Địa lan")));
            orchids.saveAll(List.of(
                    new Orchid("Hồ điệp trắng", "Sắc trắng thanh tao, cánh hoa bền đẹp và dễ chăm sóc.", "https://images.unsplash.com/photo-1566958769312-82cef41d19ef?auto=format&fit=crop&w=900&q=85", new BigDecimal("450000"), true, savedCategories.get(0)),
                    new Orchid("Hồ điệp hồng", "Sắc hồng dịu dàng mang đến nét duyên dáng cho không gian.", "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?auto=format&fit=crop&w=900&q=85", new BigDecimal("520000"), false, savedCategories.get(0)),
                    new Orchid("Vũ nữ vàng", "Chùm hoa vàng rực rỡ, lay động như những vũ công nhỏ.", "https://images.unsplash.com/photo-1566860929719-45b1d4c8c96d?auto=format&fit=crop&w=900&q=85", new BigDecimal("680000"), true, savedCategories.get(1)),
                    new Orchid("Địa lan thanh ngọc", "Dáng lá thanh thoát cùng hương thơm nhẹ nhàng.", "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=900&q=85", new BigDecimal("890000"), true, savedCategories.get(2)),
                    new Orchid("Hồ điệp tím", "Màu tím sang trọng dành cho những góc nhà nhiều ánh sáng.", "https://images.unsplash.com/photo-1570116593287-24c3d6c4fba7?auto=format&fit=crop&w=900&q=85", new BigDecimal("750000"), false, savedCategories.get(0)),
                    new Orchid("Vũ nữ mini", "Giống lan nhỏ nhắn, phù hợp trang trí bàn làm việc.", "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85", new BigDecimal("390000"), true, savedCategories.get(1))));
        };
    }
}
