package com.he187184.mvc.authservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String name;
    private String phone;
    private String address;

    private String identityCard;
    private String avatar;
    private Boolean isActive;
    private String licenseNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int tokenVersion = 0 ;

    // Quan hệ nhiều-nhiều với Role
    @ManyToMany(fetch = FetchType.EAGER) // luôn load role khi load user
    @JoinTable(
            name = "user_roles", // tên bảng trung gian
            joinColumns = @JoinColumn(name = "user_id"), // FK trỏ đến User
            inverseJoinColumns = @JoinColumn(name = "role_id") // FK trỏ đến Role
    )
    private Set<Role> roles = new HashSet<>();
}
