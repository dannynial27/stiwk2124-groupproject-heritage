package my.stiwk2124.qurba.JPAentities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", nullable = false, unique = true)
    private RoleName name;
    
    @OneToMany(mappedBy = "role")
    @JsonIgnore // Add this to prevent serializing all users with this role
    private List<User> users;
    
    public enum RoleName {
        ADMIN, CUSTOMER
    }
}
