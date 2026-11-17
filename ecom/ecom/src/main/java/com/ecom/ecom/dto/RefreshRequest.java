package com.ecom.ecom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RefreshRequest(
        @NotBlank(message = "refreshToken is required")
        @Size(max = 256, message = "refreshToken is too long")
        String refreshToken) {
}