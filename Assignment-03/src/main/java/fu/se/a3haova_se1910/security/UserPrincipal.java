package fu.se.a3haova_se1910.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final String email;
    private final String password;
    private final String name;
    private final String role;
    private final Integer customerId;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(String email, String password, String name, String role, Integer customerId) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.customerId = customerId;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

