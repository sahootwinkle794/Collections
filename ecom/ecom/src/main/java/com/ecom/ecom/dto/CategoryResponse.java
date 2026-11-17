package com.ecom.ecom.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;
    private String name;

    @Builder.Default
    private List<CategoryResponse> subCategories = new ArrayList<>();
}