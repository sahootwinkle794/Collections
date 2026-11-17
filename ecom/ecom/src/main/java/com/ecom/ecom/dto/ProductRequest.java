package com.ecom.ecom.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String styleId;

    @NotBlank(message = "Description is required")
    private String description;

    private String fabric;
    private String sleeveLength;
    private String pattern;
    private String countryOfOrigin;
    private String dispatchSla;

    @NotNull(message = "Category id is required")
    private Long categoryId;

    @NotEmpty(message = "At least one variant is required")
    @Valid
    private List<ProductVariantRequest> variants;

    @Valid
    private List<ProductImageRequest> images;
}