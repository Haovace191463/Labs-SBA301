package com.orchidhouse.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.orchidhouse.dto.OrchidResponse;
import com.orchidhouse.exception.ApiExceptionHandler;
import com.orchidhouse.exception.ResourceNotFoundException;
import com.orchidhouse.service.OrchidService;

@WebMvcTest(OrchidController.class)
@Import(ApiExceptionHandler.class)
class OrchidControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrchidService orchidService;

    @Test
    void getAllReturnsOrchidCollection() throws Exception {
        when(orchidService.findAll()).thenReturn(List.of(
                new OrchidResponse(17L, "Hồ điệp trắng", "Mô tả", null,
                        new BigDecimal("450000"), true, 3L, "Hồ điệp")));

        mockMvc.perform(get("/orchids/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orchidId").value(17))
                .andExpect(jsonPath("$[0].orchidName").value("Hồ điệp trắng"))
                .andExpect(jsonPath("$[0].isNatural").value(true))
                .andExpect(jsonPath("$[0].categoryName").value("Hồ điệp"));
    }

    @Test
    void createReturns201AndLocation() throws Exception {
        when(orchidService.create(any())).thenReturn(
                new OrchidResponse(17L, "Hồ điệp trắng", null, null,
                        new BigDecimal("450000"), true, 3L, "Hồ điệp"));

        mockMvc.perform(post("/orchids/")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Hồ điệp trắng",
                                  "orchidDescription": "",
                                  "orchidUrl": "",
                                  "price": 450000,
                                  "isNatural": true,
                                  "categoryId": 3
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.endsWith("/orchids/17")))
                .andExpect(jsonPath("$.orchidId").value(17));
    }

    @Test
    void createRejectsBlankName() throws Exception {
        mockMvc.perform(post("/orchids/")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": " ",
                                  "price": 450000,
                                  "isNatural": true,
                                  "categoryId": 3
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Tên hoa lan không được để trống"));
    }

    @Test
    void getMissingOrchidReturns404() throws Exception {
        when(orchidService.findById(404L))
                .thenThrow(new ResourceNotFoundException("Không tìm thấy hoa lan với id 404"));

        mockMvc.perform(get("/orchids/404"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Không tìm thấy hoa lan với id 404"));
    }

    @Test
    void updateReturnsUpdatedOrchid() throws Exception {
        when(orchidService.update(org.mockito.ArgumentMatchers.eq(17L), any())).thenReturn(
                new OrchidResponse(17L, "Hồ điệp tím", null, null,
                        new BigDecimal("500000"), false, 3L, "Hồ điệp"));

        mockMvc.perform(put("/orchids/17")
                        .contentType("application/json")
                        .content("""
                                {
                                  "orchidName": "Hồ điệp tím",
                                  "price": 500000,
                                  "isNatural": false,
                                  "categoryId": 3
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidName").value("Hồ điệp tím"))
                .andExpect(jsonPath("$.isNatural").value(false));
    }

    @Test
    void deleteReturns204() throws Exception {
        mockMvc.perform(delete("/orchids/17"))
                .andExpect(status().isNoContent());
    }
}
