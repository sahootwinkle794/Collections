package com.ecom.ecom.service.impl;

import com.ecom.ecom.dto.*;
import com.ecom.ecom.entity.Category;
import com.ecom.ecom.entity.Product;
import com.ecom.ecom.entity.ProductImage;
import com.ecom.ecom.entity.ProductVariant;
import com.ecom.ecom.repository.CategoryRepository;
import com.ecom.ecom.repository.ProductRepository;
import com.ecom.ecom.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ecom.ecom.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .styleId(request.getStyleId())
                .description(request.getDescription())
                .fabric(request.getFabric())
                .sleeveLength(request.getSleeveLength())
                .pattern(request.getPattern())
                .countryOfOrigin(request.getCountryOfOrigin() != null ? request.getCountryOfOrigin() : "India")
                .dispatchSla(request.getDispatchSla())
                .category(category)
                .build();

        List<ProductVariant> variants = request.getVariants().stream()
                .map(v -> ProductVariant.builder()
                        .product(product)
                        .size(v.getSize())
                        .color(v.getColor())
                        .mrp(v.getMrp())
                        .sellingPrice(v.getSellingPrice())
                        .prepaidDiscount(v.getPrepaidDiscount())
                        .stockQuantity(v.getStockQuantity())
                        .sku(v.getSku())
                        .bustSize(v.getBustSize())
                        .shoulderSize(v.getShoulderSize())
                        .waistSize(v.getWaistSize())
                        .sizeLength(v.getSizeLength())
                        .hipSize(v.getHipSize())
                        .build())
                .collect(Collectors.toList());
        product.setVariants(variants);

        if (request.getImages() != null) {
            List<ProductImage> images = request.getImages().stream()
                    .map(i -> ProductImage.builder()
                            .product(product)
                            .imageUrl(i.getImageUrl())
                            .isPrimary(i.isPrimary())
                            .build())
                    .collect(Collectors.toList());
            product.setImages(images);
        }

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setStyleId(request.getStyleId());
        product.setDescription(request.getDescription());
        product.setFabric(request.getFabric());
        product.setSleeveLength(request.getSleeveLength());
        product.setPattern(request.getPattern());
        if (request.getCountryOfOrigin() != null) {
            product.setCountryOfOrigin(request.getCountryOfOrigin());
        }
        product.setDispatchSla(request.getDispatchSla());
        product.setCategory(category);

        // Replace variants entirely (simplest approach for now)
        product.getVariants().clear();
        List<ProductVariant> newVariants = request.getVariants().stream()
                .map(v -> ProductVariant.builder()
                        .product(product)
                        .size(v.getSize())
                        .color(v.getColor())
                        .mrp(v.getMrp())
                        .sellingPrice(v.getSellingPrice())
                        .prepaidDiscount(v.getPrepaidDiscount())
                        .stockQuantity(v.getStockQuantity())
                        .sku(v.getSku())
                        .bustSize(v.getBustSize())
                        .shoulderSize(v.getShoulderSize())
                        .waistSize(v.getWaistSize())
                        .sizeLength(v.getSizeLength())
                        .hipSize(v.getHipSize())
                        .build())
                .collect(Collectors.toList());
        product.getVariants().addAll(newVariants);

        // Replace images entirely
        product.getImages().clear();
        if (request.getImages() != null) {
            List<ProductImage> newImages = request.getImages().stream()
                    .map(i -> ProductImage.builder()
                            .product(product)
                            .imageUrl(i.getImageUrl())
                            .isPrimary(i.isPrimary())
                            .build())
                    .collect(Collectors.toList());
            product.getImages().addAll(newImages);
        }

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse mapToResponse(Product product) {
        List<ProductVariantRequest> variantDtos = product.getVariants().stream()
                .map(v -> new ProductVariantRequest(
                        v.getSize(), v.getColor(), v.getMrp(), v.getSellingPrice(),
                        v.getPrepaidDiscount(), v.getStockQuantity(), v.getSku(),
                        v.getBustSize(), v.getShoulderSize(), v.getWaistSize(),
                        v.getSizeLength(), v.getHipSize()))
                .collect(Collectors.toList());

        List<ProductImageRequest> imageDtos = product.getImages() == null ? new ArrayList<>() :
                product.getImages().stream()
                        .map(i -> new ProductImageRequest(i.getImageUrl(), i.isPrimary()))
                        .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .styleId(product.getStyleId())
                .description(product.getDescription())
                .fabric(product.getFabric())
                .sleeveLength(product.getSleeveLength())
                .pattern(product.getPattern())
                .countryOfOrigin(product.getCountryOfOrigin())
                .dispatchSla(product.getDispatchSla())
                .active(product.isActive())
                .createdAt(product.getCreatedAt())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .variants(variantDtos)
                .images(imageDtos)
                .build();
    }
}