package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Roles;
import com.Jforce.Assignment2.service.RoleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public Roles addRole(@RequestBody Roles role) {
        return roleService.addRole(role);
    }

    @GetMapping
    public List<Roles> getAllRoles() {
        return roleService.getAllRoles();
    }
}
