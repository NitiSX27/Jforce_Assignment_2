package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Address;
import com.Jforce.Assignment2.service.AddressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/{userId}")
    public Address addAddress(@PathVariable Long userId,
                              @RequestBody Address address) {
        return addressService.addAddress(userId, address);
    }

    @GetMapping("/user/{userId}")
    public List<Address> getAddressesByUser(@PathVariable Long userId) {
        return addressService.getAddressesByUser(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
    }
}
