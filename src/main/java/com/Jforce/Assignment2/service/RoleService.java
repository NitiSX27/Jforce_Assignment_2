package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Roles;
import com.Jforce.Assignment2.repository.RolesRepository;
import org.springframework.stereotype.Service;
import com.Jforce.Assignment2.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class RoleService {

    private final RolesRepository rolesRepository;

    public RoleService(RolesRepository rolesRepository) {
        this.rolesRepository = rolesRepository;
    }

    public Roles addRole(Roles role) {
        return rolesRepository.save(role);
    }

    public List<Roles> getAllRoles() {
        return rolesRepository.findAll();
    }

    public Roles getRoleById(Long id) {
        return rolesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + id));
    }

    public Roles getRoleByName(String name) {
        return rolesRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + name));
    }

    public Roles updateRole(Long id, Roles role) {
        Roles existingRole = getRoleById(id);
        existingRole.setName(role.getName());
        return rolesRepository.save(existingRole);
    }

    public void deleteRole(Long id) {
        Roles role = getRoleById(id);
        rolesRepository.delete(role);
    }
}
