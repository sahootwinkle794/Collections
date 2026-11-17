package com.ecom.ecom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantRequest {

    @NotBlank(message = "Size is required")
    private String size;

    private String color;

    @NotNull(message = "MRP is required")
    private BigDecimal mrp;

    @NotNull(message = "Selling price is required")
    private BigDecimal sellingPrice;

    private BigDecimal prepaidDiscount;

    @NotNull(message = "Stock quantity is required")
    private Integer stockQuantity;

    private String sku;

    private Double bustSize;
    private Double shoulderSize;
    private Double waistSize;
    private Double sizeLength;
    private Double hipSize;
}