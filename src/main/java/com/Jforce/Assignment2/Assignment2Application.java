package com.Jforce.Assignment2;

import com.Jforce.Assignment2.entity.Roles;
import com.Jforce.Assignment2.entity.User;
import com.Jforce.Assignment2.repository.RolesRepository;
import com.Jforce.Assignment2.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class Assignment2Application {

	public static void main(String[] args) {
		SpringApplication.run(Assignment2Application.class, args);
	}

	@Bean
	CommandLineRunner seedAccounts(RolesRepository rolesRepository,
	                               UserRepository userRepository,
	                               PasswordEncoder passwordEncoder) {
		return args -> {
			Roles userRole = getOrCreateRole(rolesRepository, "USER");
			Roles adminRole = getOrCreateRole(rolesRepository, "ADMIN");
			Roles superAdminRole = getOrCreateRole(rolesRepository, "SUPER_ADMIN");

			createUserIfMissing(userRepository, passwordEncoder,
					"user@example.com", "User@123", "Normal User", userRole);
			createUserIfMissing(userRepository, passwordEncoder,
					"admin@example.com", "Admin@123", "Admin User", adminRole);
			createUserIfMissing(userRepository, passwordEncoder,
					"superadmin@example.com", "SuperAdmin@123", "Super Admin", superAdminRole);
		};
	}

	private Roles getOrCreateRole(RolesRepository rolesRepository, String name) {
		return rolesRepository.findByName(name)
				.orElseGet(() -> rolesRepository.save(new Roles(null, name)));
	}

	private void createUserIfMissing(UserRepository userRepository,
	                                 PasswordEncoder passwordEncoder,
	                                 String email,
	                                 String password,
	                                 String name,
	                                 Roles role) {
		if (userRepository.findByEmail(email).isEmpty()) {
			User user = new User();
			user.setName(name);
			user.setEmail(email);
			user.setPassword(passwordEncoder.encode(password));
			user.setRole(role);
			userRepository.save(user);
		}
	}
}
