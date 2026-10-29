package com.hao.a2haova_se1910.service;

import com.hao.a2haova_se1910.dto.TagRequest;
import com.hao.a2haova_se1910.dto.TagResponse;
import com.hao.a2haova_se1910.entity.Tag;
import com.hao.a2haova_se1910.exception.DuplicateResourceException;
import com.hao.a2haova_se1910.exception.ResourceNotFoundException;
import com.hao.a2haova_se1910.repository.NewsTagRepository;
import com.hao.a2haova_se1910.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final NewsTagRepository newsTagRepository;

    public TagService(TagRepository tagRepository, NewsTagRepository newsTagRepository) {
        this.tagRepository = tagRepository;
        this.newsTagRepository = newsTagRepository;
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(TagResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TagResponse getTagById(Integer id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + id));
        return TagResponse.from(tag);
    }

    @Transactional
    public TagResponse createTag(TagRequest request) {
        if (request.tagName() == null || request.tagName().isBlank()) {
            throw new IllegalArgumentException("Tag name is required");
        }

        String trimmedName = request.tagName().trim();
        if (tagRepository.existsByTagNameIgnoreCase(trimmedName)) {
            throw new DuplicateResourceException("Tag name already exists: " + trimmedName);
        }

        Tag tag = new Tag();
        Integer id = request.id();
        if (id == null) {
            id = tagRepository.getNextTagId();
        }
        tag.setId(id);
        tag.setTagName(trimmedName);
        tag.setNote(request.note());

        return TagResponse.from(tagRepository.save(tag));
    }

    @Transactional
    public TagResponse updateTag(Integer id, TagRequest request) {
        Tag existing = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + id));

        if (request.tagName() == null || request.tagName().isBlank()) {
            throw new IllegalArgumentException("Tag name is required");
        }

        String trimmedName = request.tagName().trim();
        if (tagRepository.existsByTagNameIgnoreCaseAndIdNot(trimmedName, id)) {
            throw new DuplicateResourceException("Tag name already exists: " + trimmedName);
        }

        existing.setTagName(trimmedName);
        existing.setNote(request.note());

        return TagResponse.from(tagRepository.save(existing));
    }

    @Transactional
    public void deleteTag(Integer id) {
        Tag existing = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + id));

        newsTagRepository.deleteByIdTagID(id);
        tagRepository.delete(existing);
    }
}

