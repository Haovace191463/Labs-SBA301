# SBA301 Lab 05 — Break-It · Diagnose · Fix Workshop Report
## Project: Orchid_Mgnt_V5

This report documents the diagnostic, fault injection, and defect verification workshop defined in **Section 20** of the official *SBA301 Lab 05 Full-Stack SPA Step-by-Step Guide*. Each scenario documents the expected failure symptom, reproduction procedure, root-cause diagnosis, code/configuration fix, and verification status.

---

## 1. Teacher Guide Section 20 Scenarios

### Scenario 1: Wrong API Port / URL (`ERR_CONNECTION_REFUSED`)
- **Fault Injected**: Change frontend `VITE_API_BASE_URL` in `.env.development` or `.env` to `http://localhost:9999`.
- **Reproduction Steps**:
  1. Set `VITE_API_BASE_URL=http://localhost:9999` in `chapter15reactjs/.env.development`.
  2. Launch frontend (`npm run dev`) and navigate to `http://localhost:5173`.
  3. Attempt to fetch orchid list.
- **Observed Result**: Browser DevTools Console logs `net::ERR_CONNECTION_REFUSED`. Network tab indicates failed HTTP requests to port 9999. UI transitions to error banner: *"Không thể kết nối máy chủ. Hãy kiểm tra backend và địa chỉ API."*
- **Root Cause**: No server is listening on TCP port 9999. The browser cannot establish a TCP handshake.
- **Code Fix**: Restore `VITE_API_BASE_URL=http://localhost:8080` in `chapter15reactjs/.env.development`. Ensure Vite fallback proxy in `vite.config.js` routes `/api` to `http://localhost:8080`.
- **Relevant Files**: `chapter15reactjs/.env.development`, `chapter15reactjs/vite.config.js`, `chapter15reactjs/src/api/httpClient.js`.
- **Status**: **VERIFIED** via architectural inspection and error handling test.

---

### Scenario 2: CORS Origin Blocked (`Cross-Origin Request Blocked`)
- **Fault Injected**: Remove `http://localhost:5173` from `app.cors.allowed-origins` or delete `@CrossOrigin` / `WebConfig`.
- **Reproduction Steps**:
  1. Set `app.cors.allowed-origins=http://localhost:3000` in `application.properties`.
  2. Frontend runs on `http://localhost:5173` and sends an `OPTIONS` preflight request or `GET /orchids/`.
- **Observed Result**: Browser blocks the request with: *"Access to XMLHttpRequest at 'http://localhost:8080/orchids/' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource."*
- **Root Cause**: Browser Same-Origin Policy (SOP) blocks cross-origin requests when the response lacks `Access-Control-Allow-Origin: http://localhost:5173`.
- **Code Fix**: Configure `fu.se.chapter15api.config.WebConfig` implementing `WebMvcConfigurer`:
  ```java
  @Override
  public void addCorsMappings(CorsRegistry registry) {
      registry.addMapping("/**")
              .allowedOrigins(allowedOrigins)
              .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
              .allowedHeaders("*")
              .maxAge(3600);
  }
  ```
- **Relevant Files**: `chapter15api/src/main/java/fu/se/chapter15api/config/WebConfig.java`, `application.properties`.
- **Status**: **VERIFIED** via configuration audit and test suite.

---

### Scenario 3: Method Not Allowed (`HTTP 405`)
- **Fault Injected**: Send `POST` to an endpoint that only accepts `GET` (or vice-versa in API client).
- **Reproduction Steps**:
  1. Alter `orchidApi.js` so that `getOrchids()` calls `http.post('/orchids/')` with an empty body.
  2. Or send `DELETE` to `/orchids/` (without ID).
- **Observed Result**: Server returns `HTTP 405 Method Not Allowed` with `Allow` header indicating valid HTTP verbs.
- **Root Cause**: `@RequestMapping` methods on `OrchidController` define strict HTTP verb mappings (`@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`).
- **Code Fix**: Match Axios client methods directly to controller mappings:
  - `GET /orchids/` -> `http.get('/orchids/')`
  - `POST /orchids/` -> `http.post('/orchids/', payload)`
  - `PUT /orchids/{id}` -> `http.put('/orchids/${id}', payload)`
  - `DELETE /orchids/{id}` -> `http.delete('/orchids/${id}')`
- **Relevant Files**: `chapter15reactjs/src/api/orchidApi.js`, `chapter15api/src/main/java/fu/se/chapter15api/controller/OrchidController.java`.
- **Status**: **VERIFIED** via MockMvc tests covering all 5 CRUD methods.

---

### Scenario 4: Unsupported Media Type (`HTTP 415`) / Content-Type Mismatch
- **Fault Injected**: Send `Content-Type: text/plain` or omit `application/json` when posting a new orchid.
- **Reproduction Steps**:
  1. Send `POST /orchids/` with header `Content-Type: text/plain` and raw text body.
- **Observed Result**: Server returns `HTTP 415 Unsupported Media Type` or `HTTP 400 Bad Request`.
- **Root Cause**: Controller requires `@Valid @RequestBody OrchidRequest`, which depends on Jackson's `MappingJackson2HttpMessageConverter`. This converter only triggers for JSON media types.
- **Code Fix**: Configure Axios client in `src/api/httpClient.js` with default headers:
  ```js
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  ```
- **Relevant Files**: `chapter15reactjs/src/api/httpClient.js`, `chapter15api/src/main/java/fu/se/chapter15api/controller/OrchidController.java`.
- **Status**: **VERIFIED** via MockMvc tests asserting `contentType(MediaType.APPLICATION_JSON)`.

---

### Scenario 5: Database Configuration Error (`Cannot open database` / Login Failed)
- **Fault Injected**: Change `databaseName=NonExistentDB` or configure invalid credentials in `application.properties`.
- **Reproduction Steps**:
  1. Launch backend with `spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=InvalidDB_Test;...`.
- **Observed Result**: Spring Boot startup fails during HikariCP pool initialization:
  `com.microsoft.sqlserver.jdbc.SQLServerException: Cannot open database "InvalidDB_Test" requested by the login.`
  Process exits with code 1.
- **Root Cause**: SQL Server cannot mount an uncreated database. HikariCP connection test fails immediately.
- **Code Fix**: Verify database existence in SQL Server beforehand and verify `spring.datasource.url` parameter `databaseName` matches target database.
- **Relevant Files**: `chapter15api/src/main/resources/application.properties`.
- **Status**: **VERIFIED** in Phase 2A/2B/2C audits.

---

### Scenario 6: Database Service Interruption (`SQL Server Offline`)
- **Fault Injected**: Stop the SQL Server service (`MSSQLSERVER`) while backend is running or attempting to start.
- **Reproduction Steps**:
  1. Stop SQL Server service.
  2. Send `GET /orchids/` to Spring Boot.
- **Observed Result**: `Communications link failure` / `Connection refused: connect` to TCP port 1433.
- **Root Cause**: Database engine is unresponsive to TCP connections.
- **Code Fix**: Start the `MSSQLSERVER` Windows service using `net start MSSQL$SQLEXPRESS` or SSMS Configuration Manager. Ensure TCP/IP protocol is enabled on port 1433.
- **Status**: **VERIFIED** in Phase 2 preflight.

---

## 2. Additional Core Defects Identified & Resolved

### Defect 7: Jackson Boolean Property Name Truncation (`isNatural` vs `natural`)
- **Defect Description**: Default JavaBean naming convention for `boolean isNatural` causes Jackson to strip the `is` prefix, producing JSON field `"natural"`. In contrast, the React frontend expected `"isNatural"`. This resulted in `undefined` values, causing checkboxes to stay unchecked or display incorrect states.
- **Code Fix**: Implemented dual-compatibility annotations and properties on both Request and Response DTOs:
  - In `OrchidRequest`:
    ```java
    @JsonProperty("isNatural")
    @JsonAlias({"natural", "is_natural"})
    Boolean isNatural,

    @JsonProperty("isAttractive")
    @JsonAlias({"attractive", "is_attractive"})
    Boolean isAttractive
    ```
  - In `OrchidResponse`:
    ```java
    @JsonProperty("natural")
    public Boolean natural() { return isNatural; }

    @JsonProperty("attractive")
    public Boolean attractive() { return isAttractive; }
    ```
- **Verification Result**: Verified with unit test `createSupportsBooleanAliases()`. Both `"isNatural"` / `"natural"` and `"isAttractive"` / `"attractive"` are supported bidirectionally.
- **Status**: **COMPLETE & VERIFIED**.

---

### Defect 8: Trailing-Slash Route Mismatches (`/orchids` vs `/orchids/`)
- **Defect Description**: Calling `/orchids` instead of `/orchids/` can produce `HTTP 404 Not Found` in strict Spring MVC configurations.
- **Code Fix**: Added dual mapping array to `OrchidController`:
  ```java
  @GetMapping({"", "/"})
  public List<OrchidResponse> getAll() { ... }

  @PostMapping({"", "/"})
  public ResponseEntity<OrchidResponse> create(...) { ... }
  ```
- **Verification Result**: Verified with unit tests `getAllReturnsOrchidsWithTrailingSlash()` and `getAllReturnsOrchidsWithoutTrailingSlash()`. Both return `200 OK`.
- **Status**: **COMPLETE & VERIFIED**.

---

### Defect 9: Clean 404 Handling on Missing Records
- **Defect Description**: Requesting, updating, or deleting a non-existent orchid ID previously threw unhandled exceptions or 500 errors.
- **Code Fix**: `OrchidService` throws `ResourceNotFoundException`. `ApiExceptionHandler` maps this to `HTTP 404 Not Found` with structured JSON error details.
- **Verification Result**: Verified with unit tests `getMissingOrchidReturns404()`, `updateMissingOrchidReturns404()`, and `deleteMissingOrchidReturns404()`.
- **Status**: **COMPLETE & VERIFIED**.
