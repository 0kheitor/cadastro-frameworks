package com.framework.cadastro_frameworks.infrastructure.repository;

import com.framework.cadastro_frameworks.infrastructure.entitys.Framework;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FrameworkRepository extends JpaRepository<Framework, Integer> {
    Optional<Framework> findByTecnology(String email);

    @Transactional
    void deleteByTecnology(String tecnology);
}
