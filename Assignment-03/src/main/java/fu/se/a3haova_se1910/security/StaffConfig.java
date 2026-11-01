package fu.se.a3haova_se1910.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StaffConfig {

    @Value("${hotel.staff.email:staff@fuminihotel.com}")
    private String staffEmail;

    @Value("${hotel.staff.password:Staff@123}")
    private String staffPassword;

    public String getStaffEmail() {
        return staffEmail;
    }

    public String getStaffPassword() {
        return staffPassword;
    }
}

