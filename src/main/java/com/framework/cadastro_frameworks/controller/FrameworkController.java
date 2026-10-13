package com.framework.cadastro_frameworks.controller;

import com.framework.cadastro_frameworks.business.FrameworkService;
import com.framework.cadastro_frameworks.infrastructure.entitys.Framework;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/framework")
@RequiredArgsConstructor
public class FrameworkController {
    private final FrameworkService frameworkService;

    @PostMapping
    public ResponseEntity<Void> saveFramework(@RequestBody Framework framework){
        frameworkService.saveFramework(framework);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Framework> searchFrameworByTecnology(@RequestParam String tecnology){
        return ResponseEntity.ok(frameworkService.searchFrameworByTecnology(tecnology));
    }

    @DeleteMapping
    public  ResponseEntity<Void> deleteFrameworkByTecnolgy(@RequestParam String tecnology){
        frameworkService.deleteFrameworkByTecnology(tecnology);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> updateFrameworkById(@RequestBody Framework framework, @RequestParam Integer id){
        frameworkService.updateFrameworkById(id, framework);
        return ResponseEntity.ok().build();
    }
}
