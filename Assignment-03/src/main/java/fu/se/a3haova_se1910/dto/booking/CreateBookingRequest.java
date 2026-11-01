package fu.se.a3haova_se1910.dto.booking;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CreateBookingRequest {

    // Customer ID can be supplied by staff when creating offline booking, or inferred from JWT for customer
    private Integer customerId;

    @NotEmpty(message = "At least one room must be selected for booking")
    @Valid
    private List<BookingItemRequest> items;

    public CreateBookingRequest() {
    }

    public CreateBookingRequest(Integer customerId, List<BookingItemRequest> items) {
        this.customerId = customerId;
        this.items = items;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public List<BookingItemRequest> getItems() {
        return items;
    }

    public void setItems(List<BookingItemRequest> items) {
        this.items = items;
    }
}

