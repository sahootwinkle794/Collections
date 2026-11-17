package com.ecom.ecom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FirebaseLoginRequest(
        @NotBlank(message = "idToken is required")
        @Size(max = 4096, message = "idToken is too long")
        String idToken) {
}