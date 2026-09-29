package com.framework.cadastro_frameworks.infrastructure.entitys;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "framework")
@Entity

public class Framework {

    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    private Integer id;

    @Column(name = "tecnology")
    private String tecnology;

    @Column(name = "name")
    private String name;

    @Column(name = "projectType")
    private String projectType;

    @Column(name = "highestVersion")
    private String highestVersion;

}
