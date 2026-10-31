package vn.edu.fpt.slot32.product;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;

import vn.edu.fpt.slot32.category.CategoryRepository;
import vn.edu.fpt.slot32.common.NotFoundException;

class ProductServiceTest {

    private final ProductRepository products = mock(ProductRepository.class);
    private final CategoryRepository categories = mock(CategoryRepository.class);
    private final ProductService service = new ProductService(products, categories);

    @Test
    void filtersNestedHdmiWithRepositoryDerivedQuery() {
        Product hub = new Product("1", "Hub", new BigDecimal("49.5"), true, List.of("usb-c"),
                new ProductSpecs(7, true, 100), null, null, null, null);
        when(products.findBySpecsHdmi(true)).thenReturn(List.of(hub));

        assertThat(service.findAll(null, true)).containsExactly(hub);
        verify(products).findBySpecsHdmi(true);
    }

    @Test
    void rejectsMissingReferencedCategory() {
        ProductRequest request = new ProductRequest("Mouse Pad", new BigDecimal("9.5"), true,
                List.of("desk"), null, null, null, "CAT-MISSING");
        when(categories.existsById("CAT-MISSING")).thenReturn(false);

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("CAT-MISSING");
    }
}
