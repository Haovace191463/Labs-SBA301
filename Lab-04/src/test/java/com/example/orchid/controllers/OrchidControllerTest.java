package com.example.orchid.controllers;

import com.example.orchid.pojos.Orchid;
import com.example.orchid.pojos.OrchidCategory;
import com.example.orchid.repositories.IOrchidCategoryRepository;
import com.example.orchid.repositories.IOrchidRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class OrchidControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private IOrchidRepository orchidRepository;

    @Autowired
    private IOrchidCategoryRepository categoryRepository;

    private Long cattleyaId;
    private Long dendrobiumId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        orchidRepository.deleteAll();

        // Ensure categories exist
        OrchidCategory cat1 = categoryRepository.findAll().stream()
                .filter(c -> "Cattleya".equalsIgnoreCase(c.getCategoryName()))
                .findFirst()
                .orElseGet(() -> categoryRepository.save(new OrchidCategory("Cattleya")));
        cattleyaId = cat1.getCategoryId();

        OrchidCategory cat2 = categoryRepository.findAll().stream()
                .filter(c -> "Dendrobium".equalsIgnoreCase(c.getCategoryName()))
                .findFirst()
                .orElseGet(() -> categoryRepository.save(new OrchidCategory("Dendrobium")));
        dendrobiumId = cat2.getCategoryId();
    }

    @Test
    void testTC01_GetList_emptyOrExisting() throws Exception {
        mockMvc.perform(get("/api/orchids"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }

    @Test
    void testTC02_TC03_SearchByName() throws Exception {
        Orchid cat = new Orchid();
        cat.setOrchidName("SBA301 TCASE Cattleya Queen 20261007");
        cat.setIsNatural(true);
        cat.setIsAttractive(true);
        cat.setOrchidCategory(categoryRepository.findById(cattleyaId).orElseThrow());
        orchidRepository.save(cat);

        // Case-insensitive search match (TC02)
        mockMvc.perform(get("/api/orchids").param("name", "CATTLEYA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orchidName", containsString("Cattleya Queen")));

        // Partial match
        mockMvc.perform(get("/api/orchids").param("name", "queen"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        // No match (TC03)
        mockMvc.perform(get("/api/orchids").param("name", "NO_MATCH_20261007"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void testTC04_GetMissing() throws Exception {
        mockMvc.perform(get("/api/orchids/99999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testTC05_CreateValid() throws Exception {
        String json = """
                {
                  "orchidName": "SBA301 TCASE Cattleya Queen 20261007",
                  "isNatural": true,
                  "orchidDescription": "Test TC05 create Orchid with valid Cattleya category",
                  "orchidCategory": {
                    "categoryId": %d
                  },
                  "isAttractive": true,
                  "orchidURL": "https://example.com/testcases/tc05-cattleya.jpg"
                }
                """.formatted(cattleyaId);

        mockMvc.perform(post("/api/orchids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orchidID", notNullValue()))
                .andExpect(jsonPath("$.orchidName", is("SBA301 TCASE Cattleya Queen 20261007")))
                .andExpect(jsonPath("$.isNatural", is(true)))
                .andExpect(jsonPath("$.isAttractive", is(true)))
                .andExpect(jsonPath("$.orchidCategory.categoryId", is(cattleyaId.intValue())));
    }

    @Test
    void testTC06_CreateMissingCategory() throws Exception {
        String json = """
                {
                  "orchidName": "SBA301 TCASE Missing Category 20261007",
                  "isNatural": false,
                  "orchidDescription": "Test TC06 category is omitted",
                  "isAttractive": false,
                  "orchidURL": "https://example.com/testcases/tc06-missing-category.jpg"
                }
                """;

        mockMvc.perform(post("/api/orchids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("categoryId is required")));
    }

    @Test
    void testTC07_CreateInvalidCategory() throws Exception {
        String json = """
                {
                  "orchidName": "SBA301 TCASE Invalid Category 20261007",
                  "isNatural": false,
                  "orchidDescription": "Test TC07 references a category that does not exist",
                  "orchidCategory": {
                    "categoryId": 99999999
                  },
                  "isAttractive": false,
                  "orchidURL": "https://example.com/testcases/tc07-invalid-category.jpg"
                }
                """;

        mockMvc.perform(post("/api/orchids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Category not found: 99999999")));
    }

    @Test
    void testTC08_CreateBlankName() throws Exception {
        String json = """
                {
                  "orchidName": "   ",
                  "isNatural": true,
                  "orchidDescription": "Test TC08 blank name",
                  "orchidCategory": {
                    "categoryId": %d
                  },
                  "isAttractive": true,
                  "orchidURL": "https://example.com/testcases/tc08-blank-name.jpg"
                }
                """.formatted(cattleyaId);

        mockMvc.perform(post("/api/orchids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("orchidName")));
    }

    @Test
    void testTC09_MalformedJson() throws Exception {
        mockMvc.perform(post("/api/orchids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Request body must contain valid JSON")));
    }

    @Test
    void testTC10_TC11_UpdateValid() throws Exception {
        Orchid initial = new Orchid();
        initial.setOrchidName("SBA301 TCASE Initial 20261007");
        initial.setIsNatural(true);
        initial.setOrchidCategory(categoryRepository.findById(cattleyaId).orElseThrow());
        initial = orchidRepository.save(initial);
        Long id = initial.getOrchidID();

        String updateJson = """
                {
                  "orchidName": "SBA301 TCASE Cattleya Queen Updated 20261007",
                  "isNatural": false,
                  "orchidDescription": "Test TC10 full update and category replacement",
                  "orchidCategory": {
                    "categoryId": %d
                  },
                  "isAttractive": false,
                  "orchidURL": "https://example.com/testcases/tc10-updated.jpg"
                }
                """.formatted(dendrobiumId);

        mockMvc.perform(put("/api/orchids/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidID", is(id.intValue())))
                .andExpect(jsonPath("$.orchidName", is("SBA301 TCASE Cattleya Queen Updated 20261007")))
                .andExpect(jsonPath("$.isNatural", is(false)))
                .andExpect(jsonPath("$.isAttractive", is(false)))
                .andExpect(jsonPath("$.orchidCategory.categoryId", is(dendrobiumId.intValue())));

        // TC11 verify via GET
        mockMvc.perform(get("/api/orchids/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidName", is("SBA301 TCASE Cattleya Queen Updated 20261007")))
                .andExpect(jsonPath("$.orchidCategory.categoryId", is(dendrobiumId.intValue())));
    }

    @Test
    void testTC12_UpdateInvalidCategory() throws Exception {
        Orchid initial = new Orchid();
        initial.setOrchidName("Initial Name");
        initial.setOrchidCategory(categoryRepository.findById(cattleyaId).orElseThrow());
        initial = orchidRepository.save(initial);
        Long id = initial.getOrchidID();

        String updateJson = """
                {
                  "orchidName": "SBA301 TCASE Must Not Update 20261007",
                  "isNatural": true,
                  "orchidDescription": "Test TC12 invalid category must not persist",
                  "orchidCategory": {
                    "categoryId": 99999999
                  },
                  "isAttractive": true,
                  "orchidURL": "https://example.com/testcases/tc12-invalid-category.jpg"
                }
                """;

        mockMvc.perform(put("/api/orchids/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Category not found: 99999999")));

        // Verify original state unchanged
        mockMvc.perform(get("/api/orchids/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidName", is("Initial Name")));
    }

    @Test
    void testTC13_UpdateMissing() throws Exception {
        String updateJson = """
                {
                  "orchidName": "SBA301 TCASE Missing Orchid Update 20261007",
                  "isNatural": true,
                  "orchidDescription": "Test TC13 update a missing Orchid",
                  "orchidCategory": {
                    "categoryId": %d
                  },
                  "isAttractive": true,
                  "orchidURL": "https://example.com/testcases/tc13-missing-update.jpg"
                }
                """.formatted(cattleyaId);

        mockMvc.perform(put("/api/orchids/99999999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isNotFound());
    }

    @Test
    void testTC14_UpdateBlankName() throws Exception {
        Orchid initial = new Orchid();
        initial.setOrchidName("Initial Name");
        initial.setOrchidCategory(categoryRepository.findById(cattleyaId).orElseThrow());
        initial = orchidRepository.save(initial);
        Long id = initial.getOrchidID();

        String updateJson = """
                {
                  "orchidName": "",
                  "isNatural": true,
                  "orchidDescription": "Test TC14 blank name must not update",
                  "orchidCategory": {
                    "categoryId": %d
                  },
                  "isAttractive": true,
                  "orchidURL": "https://example.com/testcases/tc14-blank-name.jpg"
                }
                """.formatted(cattleyaId);

        mockMvc.perform(put("/api/orchids/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("orchidName")));

        // Verify original state unchanged
        mockMvc.perform(get("/api/orchids/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidName", is("Initial Name")));
    }

    @Test
    void testTC15_TC16_TC17_Delete() throws Exception {
        Orchid initial = new Orchid();
        initial.setOrchidName("To Delete");
        initial.setOrchidCategory(categoryRepository.findById(cattleyaId).orElseThrow());
        initial = orchidRepository.save(initial);
        Long id = initial.getOrchidID();

        // TC15: DELETE existing
        mockMvc.perform(delete("/api/orchids/" + id))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        // TC16: GET deleted
        mockMvc.perform(get("/api/orchids/" + id))
                .andExpect(status().isNotFound());

        // TC17: DELETE missing
        mockMvc.perform(delete("/api/orchids/99999999"))
                .andExpect(status().isNotFound());
    }
}
