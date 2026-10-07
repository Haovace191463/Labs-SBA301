package com.example.orchid.services;

import com.example.orchid.pojos.Orchid;
import com.example.orchid.pojos.OrchidCategory;
import com.example.orchid.repositories.IOrchidCategoryRepository;
import com.example.orchid.repositories.IOrchidRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class OrchidService implements IOrchidService {

    private final IOrchidRepository orchidRepository;
    private final IOrchidCategoryRepository categoryRepository;

    public OrchidService(IOrchidRepository orchidRepository,
                         IOrchidCategoryRepository categoryRepository) {
        this.orchidRepository = orchidRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Orchid> getAll() {
        return orchidRepository.findAll();
    }

    @Override
    public List<Orchid> searchByName(String name) {
        return orchidRepository.findByOrchidNameContainingIgnoreCase(name);
    }

    @Override
    public Optional<Orchid> getById(Long id) {
        return orchidRepository.findById(id);
    }

    private void validateOrchid(Orchid orchid) {
        if (orchid.getOrchidName() == null || orchid.getOrchidName().trim().isEmpty()) {
            throw new IllegalArgumentException("orchidName must not be blank");
        }
    }

    private OrchidCategory resolveCategory(Orchid orchid) {
        if (orchid.getOrchidCategory() == null || orchid.getOrchidCategory().getCategoryId() == null) {
            throw new IllegalArgumentException("categoryId is required");
        }
        Long categoryId = orchid.getOrchidCategory().getCategoryId();
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + categoryId));
    }

    @Override
    @Transactional
    public Orchid create(Orchid orchid) {
        validateOrchid(orchid);
        OrchidCategory category = resolveCategory(orchid);
        orchid.setOrchidID(null);
        orchid.setOrchidCategory(category);
        return orchidRepository.save(orchid);
    }

    @Override
    @Transactional
    public Optional<Orchid> update(Long id, Orchid input) {
        Optional<Orchid> existingOpt = orchidRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return Optional.empty();
        }
        validateOrchid(input);
        OrchidCategory category = resolveCategory(input);
        Orchid existing = existingOpt.get();
        existing.setOrchidName(input.getOrchidName());
        existing.setIsNatural(input.getIsNatural());
        existing.setOrchidDescription(input.getOrchidDescription());
        existing.setIsAttractive(input.getIsAttractive());
        existing.setOrchidURL(input.getOrchidURL());
        existing.setOrchidCategory(category);
        return Optional.of(orchidRepository.save(existing));
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        if (!orchidRepository.existsById(id)) {
            return false;
        }
        orchidRepository.deleteById(id);
        return true;
    }
}
