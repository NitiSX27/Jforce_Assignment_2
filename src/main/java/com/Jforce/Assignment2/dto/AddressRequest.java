package com.Jforce.Assignment2.dto;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        @NotBlank String addressLine,
        @NotBlank String city,
        @NotBlank String state,
        @NotBlank String country,
        @NotBlank String postalCode
) {
}
