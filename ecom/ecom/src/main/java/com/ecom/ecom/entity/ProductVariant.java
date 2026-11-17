package com.ecom.ecom.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String size;
    private String color;

    @Column(nullable = false)
    private BigDecimal mrp;

    @Column(nullable = false)
    private BigDecimal sellingPrice;

    private BigDecimal prepaidDiscount;

    @Column(nullable = false)
    private Integer stockQuantity;

    private String sku;

    private Double bustSize;
    private Double shoulderSize;
    private Double waistSize;
    private Double sizeLength;
    private Double hipSize;
}