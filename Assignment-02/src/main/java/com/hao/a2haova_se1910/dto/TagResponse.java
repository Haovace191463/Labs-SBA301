package com.hao.a2haova_se1910.dto;

import com.hao.a2haova_se1910.entity.Tag;

public record TagResponse(
        Integer id,
        String tagName,
        String note
) {
    public static TagResponse from(Tag tag) {
        if (tag == null) return null;
        return new TagResponse(tag.getId(), tag.getTagName(), tag.getNote());
    }
}

