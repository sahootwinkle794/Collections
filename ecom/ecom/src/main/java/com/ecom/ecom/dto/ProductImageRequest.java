package com.ecom.ecom.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageRequest {

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private boolean isPrimary;
}