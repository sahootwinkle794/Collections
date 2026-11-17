package com.ecom.ecom.controller;

import com.ecom.ecom.dto.UserProfileResponse;
import com.ecom.ecom.exception.UnauthorizedException;
import com.ecom.ecom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public UserProfileResponse me(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .filter(u -> u.isEnabled())
                .map(u -> new UserProfileResponse(u.getEmail(), u.getFullName(), u.getRole().name()))
                .orElseThrow(() -> new UnauthorizedException("Authentication required"));
    }
}