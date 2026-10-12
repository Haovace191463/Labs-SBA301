package fu.se.chapter15api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import fu.se.chapter15api.dto.OrchidResponse;
import fu.se.chapter15api.exception.ApiExceptionHandler;
import fu.se.chapter15api.exception.ResourceNotFoundException;
import fu.se.chapter15api.service.OrchidService;

@WebMvcTest(OrchidController.class)
@Import(ApiExceptionHandler.class)
class OrchidControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrchidService orchidService;

    private OrchidResponse sampleResponse() {
        return new OrchidResponse(
                1,
                "Taichung Beauty",
                true,
                "Popular Cattleya orchid",
                "Cattleya",
                true,
                "https://example.com/orchid1.jpg"
        );
    }

    @Test
    void getAllReturnsOrchidsWithTrailingSlash() throws Exception {
        when(orchidService.findAll()).thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/orchids/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orchidId").value(1))
                .andExpect(jsonPath("$[0].orchidName").value("Taichung Beauty"))
                .andExpect(jsonPath("$[0].isNatural").value(true))
                .andExpect(jsonPath("$[0].natural").value(true))
                .andExpect(jsonPath("$[0].isAttractive").value(true))
                .andExpect(jsonPath("$[0].attractive").value(true))
                .andExpect(jsonPath("$[0].orchidCategory").value("Cattleya"))
                .andExpect(jsonPath("$[0].orchidURL").value("https://example.com/orchid1.jpg"))
                .andExpect(jsonPath("$[0].orchidUrl").value("https://example.com/orchid1.jpg"));
    }

    @Test
    void getAllReturnsOrchidsWithoutTrailingSlash() throws Exception {
        when(orchidService.findAll()).thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/orchids"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orchidId").value(1))
                .andExpect(jsonPath("$[0].orchidName").value("Taichung Beauty"));
    }

    @Test
    void getByIdReturnsOrchid() throws Exception {
        when(orchidService.findById(1)).thenReturn(sampleResponse());

        mockMvc.perform(get("/orchids/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidId").value(1))
                .andExpect(jsonPath("$.orchidName").value("Taichung Beauty"))
                .andExpect(jsonPath("$.isNatural").value(true))
                .andExpect(jsonPath("$.isAttractive").value(true));
    }

    @Test
    void getMissingOrchidReturns404() throws Exception {
        when(orchidService.findById(404))
                .thenThrow(new ResourceNotFoundException("Không tìm thấy hoa lan với id 404"));

        mockMvc.perform(get("/orchids/404"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Không tìm thấy hoa lan với id 404"));
    }

    @Test
    void createReturns201AndLocationWithTrailingSlash() throws Exception {
        when(orchidService.create(any())).thenReturn(sampleResponse());

        mockMvc.perform(post("/orchids/")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Taichung Beauty",
                                  "isNatural": true,
                                  "orchidDescription": "Popular Cattleya orchid",
                                  "orchidCategory": "Cattleya",
                                  "isAttractive": true,
                                  "orchidURL": "https://example.com/orchid1.jpg"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.endsWith("/orchids/1")))
                .andExpect(jsonPath("$.orchidId").value(1))
                .andExpect(jsonPath("$.orchidName").value("Taichung Beauty"));
    }

    @Test
    void createReturns201WithoutTrailingSlash() throws Exception {
        when(orchidService.create(any())).thenReturn(sampleResponse());

        mockMvc.perform(post("/orchids")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Taichung Beauty",
                                  "isNatural": true,
                                  "isAttractive": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orchidId").value(1));
    }

    @Test
    void createSupportsBooleanAliasesAndUrlAliases() throws Exception {
        when(orchidService.create(any())).thenReturn(sampleResponse());

        // Uses "natural", "attractive", and "orchidUrl" instead of "isNatural", "isAttractive", and "orchidURL"
        mockMvc.perform(post("/orchids/")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Taichung Beauty",
                                  "natural": true,
                                  "attractive": true,
                                  "orchidUrl": "https://example.com/orchid1.jpg"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orchidId").value(1));
    }

    @Test
    void createRejectsBlankName() throws Exception {
        mockMvc.perform(post("/orchids/")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "   ",
                                  "isNatural": true,
                                  "isAttractive": true
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Tên hoa lan không được để trống")));
    }

    @Test
    void createRejectsNullNatural() throws Exception {
        mockMvc.perform(post("/orchids/")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Valid Orchid",
                                  "isAttractive": true
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Trạng thái tự nhiên không được để trống")));
    }

    @Test
    void createRejectsNullAttractive() throws Exception {
        mockMvc.perform(post("/orchids/")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Valid Orchid",
                                  "isNatural": true
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Trạng thái thu hút không được để trống")));
    }

    @Test
    void updateReturnsUpdatedOrchid() throws Exception {
        OrchidResponse updated = new OrchidResponse(
                1,
                "Taichung Beauty Updated",
                false,
                "Updated description",
                "Cattleya",
                true,
                "https://example.com/orchid1.jpg"
        );
        when(orchidService.update(eq(1), any())).thenReturn(updated);

        mockMvc.perform(put("/orchids/1")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Taichung Beauty Updated",
                                  "isNatural": false,
                                  "isAttractive": true,
                                  "orchidCategory": "Cattleya"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidName").value("Taichung Beauty Updated"))
                .andExpect(jsonPath("$.isNatural").value(false));
    }

    @Test
    void updateMissingOrchidReturns404() throws Exception {
        when(orchidService.update(eq(999), any()))
                .thenThrow(new ResourceNotFoundException("Không tìm thấy hoa lan với id 999"));

        mockMvc.perform(put("/orchids/999")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Nonexistent",
                                  "isNatural": true,
                                  "isAttractive": true
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void deleteReturns204() throws Exception {
        mockMvc.perform(delete("/orchids/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteMissingOrchidReturns404() throws Exception {
        doThrow(new ResourceNotFoundException("Không tìm thấy hoa lan với id 999"))
                .when(orchidService).delete(999);

        mockMvc.perform(delete("/orchids/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
