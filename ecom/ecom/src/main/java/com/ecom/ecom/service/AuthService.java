package com.ecom.ecom.service;

import com.ecom.ecom.dto.AuthResponse;

public interface AuthService {
    AuthResponse loginWithFirebase(String idToken);
    AuthResponse refresh(String refreshToken);
    void logout(String refreshToken);
}