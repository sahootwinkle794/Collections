package com.ecom.ecom.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String styleId;
    private String description;
    private String fabric;
    private String sleeveLength;
    private String pattern;
    private String countryOfOrigin;
    private String dispatchSla;
    private boolean active;
    private LocalDateTime createdAt;

    private Long categoryId;
    private String categoryName;

    private List<ProductVariantRequest> variants;
    private List<ProductImageRequest> images;
}