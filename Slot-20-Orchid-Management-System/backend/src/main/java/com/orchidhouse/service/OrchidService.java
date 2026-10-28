package com.orchidhouse.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import com.orchidhouse.dto.OrchidRequest;
import com.orchidhouse.dto.OrchidResponse;
import com.orchidhouse.exception.ResourceNotFoundException;
import com.orchidhouse.model.Category;
import com.orchidhouse.model.Orchid;
import com.orchidhouse.repository.CategoryRepository;
import com.orchidhouse.repository.OrchidRepository;

@Service
@Transactional
public class OrchidService {

    private final OrchidRepository orchidRepository;
    private final CategoryRepository categoryRepository;

    public OrchidService(OrchidRepository orchidRepository, CategoryRepository categoryRepository) {
        this.orchidRepository = orchidRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<OrchidResponse> findAll() {
        return orchidRepository.findAll(Sort.by(Sort.Direction.ASC, "orchidId"))
                .stream()
                .map(OrchidResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrchidResponse findById(Long id) {
        return OrchidResponse.from(findOrchid(id));
    }

    public OrchidResponse create(OrchidRequest request) {
        Category category = findCategory(request.categoryId());
        Orchid orchid = new Orchid(
                request.orchidName().trim(),
                request.orchidDescription(),
                request.orchidUrl(),
                request.price(),
                request.isNatural(),
                category);
        return OrchidResponse.from(orchidRepository.save(orchid));
    }

    public OrchidResponse update(Long id, OrchidRequest request) {
        Orchid orchid = findOrchid(id);
        orchid.setOrchidName(request.orchidName().trim());
        orchid.setOrchidDescription(request.orchidDescription());
        orchid.setOrchidUrl(request.orchidUrl());
        orchid.setPrice(request.price());
        orchid.setNatural(request.isNatural());
        orchid.setCategory(findCategory(request.categoryId()));
        return OrchidResponse.from(orchidRepository.save(orchid));
    }

    public void delete(Long id) {
        orchidRepository.delete(findOrchid(id));
    }

    private Orchid findOrchid(Long id) {
        return orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hoa lan với id " + id));
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id " + id));
    }
}
