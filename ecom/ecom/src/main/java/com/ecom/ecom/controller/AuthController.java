package com.ecom.ecom.controller;

import com.ecom.ecom.dto.AuthResponse;
import com.ecom.ecom.dto.FirebaseLoginRequest;
import com.ecom.ecom.dto.RefreshRequest;
import com.ecom.ecom.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/firebase")
    public AuthResponse firebaseLogin(@Valid @RequestBody FirebaseLoginRequest request) {
        return authService.loginWithFirebase(request.idToken());
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request.refreshToken());
    }
}