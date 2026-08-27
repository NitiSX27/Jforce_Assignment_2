package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Address;
import com.Jforce.Assignment2.entity.User;
import com.Jforce.Assignment2.repository.AddressRepository;
import com.Jforce.Assignment2.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository){
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public Address addAddress(Long userId, Address address){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        address.setUser(user);

        return addressRepository.save(address);
    }

    public List<Address> getAddressesByUser(Long userId){
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return addressRepository.findByUser_Id(userId);
    }

    public Address getAddressById(Long id){
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address Not Found"));
    }

    public void deleteAddress(Long id){
        Address address = getAddressById(id);
        addressRepository.delete(address);
    }
}
