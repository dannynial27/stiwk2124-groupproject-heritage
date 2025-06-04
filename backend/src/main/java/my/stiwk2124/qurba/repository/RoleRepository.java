package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {  
    Optional<Role> findByName(Role.RoleName name);
}