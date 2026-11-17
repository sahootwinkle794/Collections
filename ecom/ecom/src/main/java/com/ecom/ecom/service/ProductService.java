package com.ecom.ecom.service;

import com.ecom.ecom.dto.ProductRequest;
import com.ecom.ecom.dto.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getProductsByCategory(Long categoryId);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}