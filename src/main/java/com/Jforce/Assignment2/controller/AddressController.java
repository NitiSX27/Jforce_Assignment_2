package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Address;
import com.Jforce.Assignment2.service.AddressService;
import com.Jforce.Assignment2.dto.AddressRequest;
import com.Jforce.Assignment2.dto.AddressResponse;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/{userId}")
    public AddressResponse addAddress(@PathVariable Long userId, @Valid @RequestBody AddressRequest request) {
        Address address = new Address();
        address.setAddressLine(request.addressLine());
        address.setCity(request.city());
        address.setState(request.state());
        address.setCountry(request.country());
        address.setPostalCode(request.postalCode());
        return AddressResponse.from(addressService.addAddress(userId, address));
    }

    @GetMapping("/user/{userId}")
    public List<AddressResponse> getAddressesByUser(@PathVariable Long userId) {
        return addressService.getAddressesByUser(userId).stream()
                .map(AddressResponse::from)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
    }
}
