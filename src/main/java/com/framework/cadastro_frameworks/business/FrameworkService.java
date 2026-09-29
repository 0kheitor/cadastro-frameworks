package com.framework.cadastro_frameworks.business;

import com.framework.cadastro_frameworks.infrastructure.entitys.Framework;
import com.framework.cadastro_frameworks.infrastructure.repository.FrameworkRepository;
import org.springframework.stereotype.Service;

@Service
public class FrameworkService {
    private final FrameworkRepository repository;

    public FrameworkService(FrameworkRepository repository) {
        this.repository = repository;
    }

    public void saveFramework(Framework framework){
        repository.saveAndFlush(framework);
    }

    public Framework searchFrameworByTecnology(String tecnology){
        return repository.findByTecnology(tecnology).orElseThrow(() -> new RuntimeException("tecnology not found"));
    }

    public void deleteByTecnology(String tecnology){
        repository.deleteByTecnology(tecnology);
    }

    public void updateFrameworkById(Integer id, Framework framework){
        Framework frameworkEntity = repository.findById(id).orElseThrow(() -> new RuntimeException("Framework not found"));
        Framework updatedFramework = Framework.builder().tecnology(framework.getTecnology() != null ? framework.getTecnology() : frameworkEntity.getTecnology()).
                name(framework.getName() != null ? framework.getName() : frameworkEntity.getName()).id(frameworkEntity.getId()).
                highestVersion(framework.getHighestVersion() != null ? framework.getHighestVersion() : frameworkEntity.getHighestVersion()).build();
    }

}
