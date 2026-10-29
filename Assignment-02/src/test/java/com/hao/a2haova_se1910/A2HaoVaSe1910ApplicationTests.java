package com.hao.a2haova_se1910;

import com.hao.a2haova_se1910.repository.CategoryRepository;
import com.hao.a2haova_se1910.repository.NewsArticleRepository;
import com.hao.a2haova_se1910.repository.SystemAccountRepository;
import com.hao.a2haova_se1910.repository.TagRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class A2HaoVaSe1910ApplicationTests {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    @Autowired
    private SystemAccountRepository systemAccountRepository;

    @Autowired
    private TagRepository tagRepository;

    @Test
    void contextLoads() {
        assertNotNull(categoryRepository);
        System.out.println(">>> Categories count: " + categoryRepository.count());
        System.out.println(">>> NewsArticles count: " + newsArticleRepository.count());
        System.out.println(">>> SystemAccounts count: " + systemAccountRepository.count());
        System.out.println(">>> Tags count: " + tagRepository.count());
    }

}
