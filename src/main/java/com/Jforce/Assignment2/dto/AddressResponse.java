package com.Jforce.Assignment2.dto;

import com.Jforce.Assignment2.entity.Address;

public record AddressResponse(
        Long id,
        Long userId,
        String addressLine,
        String city,
        String state,
        String country,
        String postalCode
) {
    public static AddressResponse from(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getUser().getId(),
                address.getAddressLine(),
                address.getCity(),
                address.getState(),
                address.getCountry(),
                address.getPostalCode()
        );
    }
}
