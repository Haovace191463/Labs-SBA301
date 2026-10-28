package com.orchidhouse.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.orchidhouse.dto.OrchidRequest;
import com.orchidhouse.dto.OrchidResponse;
import com.orchidhouse.service.OrchidService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orchids")
public class OrchidController {

    private final OrchidService orchidService;

    public OrchidController(OrchidService orchidService) {
        this.orchidService = orchidService;
    }

    @GetMapping({"", "/"})
    public List<OrchidResponse> getAll() {
        return orchidService.findAll();
    }

    @GetMapping("/{id}")
    public OrchidResponse getById(@PathVariable Long id) {
        return orchidService.findById(id);
    }

    @PostMapping({"", "/"})
    public ResponseEntity<OrchidResponse> create(@Valid @RequestBody OrchidRequest request) {
        OrchidResponse created = orchidService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.orchidId())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public OrchidResponse update(@PathVariable Long id, @Valid @RequestBody OrchidRequest request) {
        return orchidService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orchidService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
