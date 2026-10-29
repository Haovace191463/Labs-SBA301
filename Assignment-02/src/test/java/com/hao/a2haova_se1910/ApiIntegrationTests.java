package com.hao.a2haova_se1910;

import com.hao.a2haova_se1910.dto.*;
import com.hao.a2haova_se1910.entity.Category;
import com.hao.a2haova_se1910.security.SessionTokenManager;
import com.hao.a2haova_se1910.service.CategoryService;
import com.hao.a2haova_se1910.service.NewsArticleService;
import com.hao.a2haova_se1910.service.SystemAccountService;
import com.hao.a2haova_se1910.service.TagService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class ApiIntegrationTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private NewsArticleService newsArticleService;

    @Autowired
    private SystemAccountService accountService;

    @Autowired
    private TagService tagService;

    @Autowired
    private SessionTokenManager sessionTokenManager;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    private String loginAndGetToken(String email, String password) {
        LoginResponse response = accountService.login(new LoginRequest(email, password));
        assertNotNull(response.token());
        return response.token();
    }

    // ==================== AUTHENTICATION TESTS ====================

    @Test
    @DisplayName("POST /api/auth/login - Success for Staff returns 256-bit secure session token")
    void testLoginSuccessStaff() throws Exception {
        String json = "{\"email\":\"EmmaWilliam@FUNewsManagement.org\",\"password\":\"@1\"}";
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountEmail", is("EmmaWilliam@FUNewsManagement.org")))
                .andExpect(jsonPath("$.accountRole", is(2)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.accountPassword").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - Success for Admin returns 256-bit secure session token")
    void testLoginSuccessAdmin() throws Exception {
        String json = "{\"email\":\"SteveParis@FUNewsManagement.org\",\"password\":\"@1\"}";
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountEmail", is("SteveParis@FUNewsManagement.org")))
                .andExpect(jsonPath("$.accountRole", is(1)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.accountPassword").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - Invalid credentials fails with 400")
    void testLoginInvalidCredentials() throws Exception {
        String json = "{\"email\":\"SteveParis@FUNewsManagement.org\",\"password\":\"wrongPassword\"}";
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/logout - Revokes session token on backend")
    void testLogoutRevokesToken() throws Exception {
        String token = loginAndGetToken("SteveParis@FUNewsManagement.org", "@1");

        // Verify token is active
        mockMvc.perform(get("/api/accounts")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());

        // Perform logout
        mockMvc.perform(post("/api/auth/logout")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isNoContent());

        // Verify token is now revoked and returns 401
        mockMvc.perform(get("/api/accounts")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    // ==================== AUTHENTICATION & HEADER SPOOFING SECURITY TESTS ====================

    @Test
    @DisplayName("Missing Authorization token on protected account endpoints returns 401")
    void testProtectedAccount_MissingToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/accounts"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Forged X-User-Role: 1 and X-User-Id without Bearer token returns 401")
    void testProtectedAccount_ForgedHeaderWithoutToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/accounts")
                        .header("X-User-Role", 1)
                        .header("X-User-Id", 5))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Invalid or nonexistent Bearer token returns 401")
    void testProtectedAccount_InvalidBearerToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/accounts")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer invalid-forged-token-12345"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Staff cannot access Admin account management (returns 403 Forbidden)")
    void testStaffCannotAccessAdminAccounts_Returns403() throws Exception {
        String staffToken = loginAndGetToken("EmmaWilliam@FUNewsManagement.org", "@1");
        mockMvc.perform(get("/api/accounts")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Staff cannot perform Admin-only account operations like create or delete (returns 403)")
    void testStaffCannotPerformAccountOperations_Returns403() throws Exception {
        String staffToken = loginAndGetToken("EmmaWilliam@FUNewsManagement.org", "@1");
        mockMvc.perform(delete("/api/accounts/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Staff cannot update another user's profile (returns 403 Forbidden)")
    void testStaffCannotUpdateOtherProfile_Returns403() throws Exception {
        String staffToken = loginAndGetToken("EmmaWilliam@FUNewsManagement.org", "@1"); // accountId = 1
        String json = "{\"accountName\":\"Hacked Name\",\"accountEmail\":\"hacked@test.org\"}";
        // Attempt to update account 2 with staff 1 token
        mockMvc.perform(put("/api/accounts/profile/2")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Staff can update their own profile (returns 200 OK)")
    void testStaffCanUpdateOwnProfile_Returns200() throws Exception {
        String staffToken = loginAndGetToken("EmmaWilliam@FUNewsManagement.org", "@1"); // accountId = 1
        String json = "{\"accountName\":\"Emma William Updated\",\"accountEmail\":\"EmmaWilliam@FUNewsManagement.org\"}";
        mockMvc.perform(put("/api/accounts/profile/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountName", is("Emma William Updated")));
    }

    @Test
    @DisplayName("Staff cannot access another Staff member's news history (returns 403 Forbidden)")
    void testStaffCannotAccessOtherStaffNewsHistory_Returns403() throws Exception {
        String staffToken = loginAndGetToken("EmmaWilliam@FUNewsManagement.org", "@1"); // accountId = 1
        mockMvc.perform(get("/api/news-articles")
                        .param("createdById", "2")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin cannot perform Staff-only Category operations (returns 403 Forbidden)")
    void testAdminCannotPerformStaffCategoryOperations_Returns403() throws Exception {
        String adminToken = loginAndGetToken("SteveParis@FUNewsManagement.org", "@1");
        mockMvc.perform(delete("/api/categories/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin cannot perform Staff-only News operations (returns 403 Forbidden)")
    void testAdminCannotPerformStaffNewsOperations_Returns403() throws Exception {
        String adminToken = loginAndGetToken("SteveParis@FUNewsManagement.org", "@1");
        mockMvc.perform(delete("/api/news-articles/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isForbidden());
    }

    // ==================== PUBLIC NEWS BROWSING TESTS ====================

    @Test
    @DisplayName("Public user browsing news without authentication - Only active articles returned")
    void testPublicBrowsing_WithoutAuthentication_ReturnsOnlyActiveNews() throws Exception {
        mockMvc.perform(get("/api/news-articles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].newsStatus", everyItem(is(true))));
    }

    @Test
    @DisplayName("Public user cannot perform Category management operations (returns 401)")
    void testPublicCategoryManagement_Returns401() throws Exception {
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Public user cannot perform News management operations (returns 401)")
    void testPublicNewsManagement_Returns401() throws Exception {
        mockMvc.perform(delete("/api/news-articles/1"))
                .andExpect(status().isUnauthorized());
    }

    // ==================== CRUD & BUSINESS CONSTRAINTS TESTS ====================

    @Test
    @DisplayName("GET /api/categories - Returns existing categories for authenticated Staff")
    void testGetAllCategories() throws Exception {
        String staffToken = loginAndGetToken("EmmaWilliam@FUNewsManagement.org", "@1");
        mockMvc.perform(get("/api/categories")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].categoryName", notNullValue()));
    }

    @Test
    @DisplayName("DELETE /api/categories/1 - Cannot delete category with associated news articles (409 Conflict)")
    void testDeleteCategoryConflict() throws Exception {
        String staffToken = loginAndGetToken("EmmaWilliam@FUNewsManagement.org", "@1");
        mockMvc.perform(delete("/api/categories/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("associated with existing news articles")));
    }

    @Test
    @DisplayName("Category CRUD - Service and API level workflow")
    void testCategoryCrudWorkflow() {
        Category newCat = new Category();
        newCat.setCategoryName("Integration Test Category");
        newCat.setCategoryDesciption("Description for integration test");
        newCat.setIsActive(true);

        Category created = categoryService.createCategory(newCat);
        assertNotNull(created.getId());
        assertEquals("Integration Test Category", created.getCategoryName());

        created.setCategoryName("Updated Integration Test Category");
        Category updated = categoryService.updateCategory(created.getId(), created);
        assertEquals("Updated Integration Test Category", updated.getCategoryName());

        categoryService.deleteCategory(created.getId());
        assertThrows(RuntimeException.class, () -> categoryService.getCategoryById(created.getId()));
    }

    @Test
    @DisplayName("News Article CRUD with Tag association and author derivation")
    void testNewsArticleCrudWorkflow() throws Exception {
        String staffToken = loginAndGetToken("EmmaWilliam@FUNewsManagement.org", "@1");
        String testArticleId = "TEST-ART-TOKEN-99";
        String createJson = """
                {
                    "newsArticleID": "%s",
                    "newsTitle": "Token Auth Test Article",
                    "headline": "Token Headline",
                    "newsContent": "Content for token authentication testing",
                    "newsSource": "Test University",
                    "categoryID": 2,
                    "newsStatus": true,
                    "tagIds": [1, 2]
                }
                """.formatted(testArticleId);

        // Create article via API; author should be derived from session (Emma William id = 1)
        mockMvc.perform(post("/api/news-articles")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.newsArticleID", is(testArticleId)))
                .andExpect(jsonPath("$.createdByID", is(1)))
                .andExpect(jsonPath("$.tagIds", hasSize(2)));

        // Delete article
        mockMvc.perform(delete("/api/news-articles/" + testArticleId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + staffToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("GET /api/accounts - Returns safe accounts without passwords for Admin")
    void testGetAllAccounts() throws Exception {
        String adminToken = loginAndGetToken("SteveParis@FUNewsManagement.org", "@1");
        mockMvc.perform(get("/api/accounts")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].accountPassword").doesNotExist())
                .andExpect(jsonPath("$[0].accountEmail", notNullValue()));
    }

    @Test
    @DisplayName("DELETE /api/accounts/1 - Cannot delete account that has created news articles (409 Conflict)")
    void testDeleteAccountConflict() throws Exception {
        String adminToken = loginAndGetToken("SteveParis@FUNewsManagement.org", "@1");
        mockMvc.perform(delete("/api/accounts/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("created news articles")));
    }

    @Test
    @DisplayName("Account CRUD - Service level workflow")
    void testAccountCrudWorkflow() {
        SystemAccountRequest req = new SystemAccountRequest(
                null,
                "Test User",
                "testuser_token@fpt.edu.vn",
                2,
                "testPass123"
        );

        SystemAccountResponse created = accountService.createAccount(req);
        assertNotNull(created.id());
        assertEquals("testuser_token@fpt.edu.vn", created.accountEmail());

        accountService.deleteAccount(created.id());
        assertThrows(RuntimeException.class, () -> accountService.getAccountById(created.id()));
    }

    @Test
    @DisplayName("GET /api/tags - Returns tags")
    void testGetAllTags() throws Exception {
        mockMvc.perform(get("/api/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(9))))
                .andExpect(jsonPath("$[0].tagName", notNullValue()));
    }

    @Test
    @DisplayName("Tag CRUD - Service level workflow")
    void testTagCrudWorkflow() {
        TagRequest req = new TagRequest(null, "TestTagToken99", "Test Tag Note");

        TagResponse created = tagService.createTag(req);
        assertNotNull(created.id());
        assertEquals("TestTagToken99", created.tagName());

        tagService.deleteTag(created.id());
        assertThrows(RuntimeException.class, () -> tagService.getTagById(created.id()));
    }
}
