# Chapter 16 â€“ Securing REST Services with Spring Boot
## Part B: Authentication, Authorization vÃ  JWT Implementation in Spring REST

**Workbook thá»±c hÃ nh:** SBA301 â€“ Slot 25
**PhiÃªn báº£n:** Spring Boot 3.4.5, Java 21, Maven, Spring Security, Spring Data JPA, Microsoft SQL Server, JJWT 0.12.6.

## 1. Má»¥c tiÃªu vÃ  pháº¡m vi dá»± Ã¡n

ÄÃ¢y lÃ  REST API há»c táº­p Ä‘á»ƒ láº§n theo toÃ n bá»™ vÃ²ng Ä‘á»i xÃ¡c thá»±c báº±ng JWT, tá»« lÃºc Ä‘Äƒng kÃ½ cho Ä‘áº¿n khi request cÃ³ bearer token truy cáº­p tÃ i nguyÃªn Ä‘Æ°á»£c báº£o vá»‡. HoÃ n thÃ nh bÃ i táº­p, ngÆ°á»i há»c cÃ³ thá»ƒ:

1. PhÃ¢n biá»‡t Authentication (xÃ¡c thá»±c danh tÃ­nh), Principal (danh tÃ­nh), GrantedAuthority (quyá»n), Role (nhÃ³m authority) vÃ  Authorization (quyáº¿t Ä‘á»‹nh cho phÃ©p truy cáº­p).
2. Giáº£i thÃ­ch quan há»‡ giá»¯a `SecurityContextHolder`, `SecurityContext` vÃ  `Authentication` trong vÃ²ng Ä‘á»i request.
3. Trace `AuthenticationManager` â†’ `AuthenticationProvider` â†’ `UserDetailsService` â†’ `PasswordEncoder`.
4. LÆ°u password dáº¡ng BCrypt hash, khÃ´ng bao giá» lÆ°u/tráº£ password plaintext.
5. Thá»±c hiá»‡n signup vÃ  login qua Ä‘Ãºng Spring Security flow.
6. Táº¡o JWT cÃ³ subject/email, issued-at, expiration vÃ  chá»¯ kÃ½; kiá»ƒm tra chá»¯ kÃ½ vÃ  claims á»Ÿ request káº¿ tiáº¿p.
7. Äáº·t Authentication vÃ o SecurityContext báº±ng JWT filter trÆ°á»›c bÆ°á»›c authorization.
8. Cáº¥u hÃ¬nh `/auth/**` public vÃ  báº£o vá»‡ cÃ¡c endpoint cÃ²n láº¡i theo stateless policy.
9. Gá»i `/users/me` báº±ng principal hiá»‡n táº¡i vÃ  `/users` báº±ng token há»£p lá»‡.
10. Kiá»ƒm chá»©ng hÃ nh vi qua integration test, Postman/HTTP client, SQL Server vÃ  debugger.

**Trong pháº¡m vi:** signup/login, BCrypt, JWT access token, JSON lá»—i cÆ¡ báº£n, hai endpoint protected vÃ  test tÃ­ch há»£p. ÄÃ¢y lÃ  baseline cho lab, khÃ´ng pháº£i bá»™ khung production hoÃ n chá»‰nh. Role-based access policy, CORS, refresh/revoke token, rate limit vÃ  exhaustive security matrix Ä‘á»ƒ dÃ nh cho pháº§n tiáº¿p theo.

## 2. CÃ´ng nghá»‡ vÃ  vai trÃ²

| CÃ´ng nghá»‡ | PhiÃªn báº£n/pháº¡m vi | Vai trÃ² |
|---|---|---|
| Java | 21 | NgÃ´n ngá»¯ cháº¡y á»©ng dá»¥ng |
| Spring Boot | 3.4.5 | Auto-configuration, application runtime |
| Spring Web | Boot-managed | REST controllers, JSON/HTTP |
| Spring Security | Boot-managed | Authentication, filter chain, authorization |
| Spring Data JPA / Hibernate | Boot-managed | Repository vÃ  Ã¡nh xáº¡ entity |
| Microsoft SQL Server JDBC | Boot-managed | Database runtime máº·c Ä‘á»‹nh |
| JJWT | 0.12.6 | Táº¡o vÃ  validate signed JWT |
| Jakarta Bean Validation | Boot-managed | Validate DTO qua `@Valid` |
| H2 | Test scope | Database táº¡m cho test; khÃ´ng dÃ¹ng lÃ m runtime database |
| Spring Boot Test / MockMvc | Test scope | Integration test qua HTTP/security/JPA |
| Maven | 3.9+ khuyáº¿n nghá»‹ | Dependency resolution, build, test, cháº¡y á»©ng dá»¥ng |

### Security flow tá»•ng quan

**Signup:** Controller â†’ validation â†’ AuthService â†’ BCrypt encode â†’ JPA repository â†’ SQL Server.
**Login:** Controller â†’ AuthService â†’ AuthenticationManager â†’ DaoAuthenticationProvider â†’ UserDetailsService â†’ repository â†’ BCrypt `matches` â†’ JwtService kÃ½ JWT.
**Protected request:** HTTP Bearer header â†’ SecurityFilterChain â†’ JwtAuthenticationFilter â†’ validate chá»¯ kÃ½/expiration â†’ load UserDetails â†’ set Authentication vÃ o SecurityContext â†’ authorization â†’ controller.

Role `USER` Ä‘Æ°á»£c chuyá»ƒn thÃ nh authority `ROLE_USER`. Trong baseline nÃ y `/users` vÃ  `/users/me` Ä‘á»u yÃªu cáº§u authenticated user nhÆ°ng chÆ°a giá»›i háº¡n role cá»¥ thá»ƒ.

## 3. API vÃ  contract

| Method | Endpoint | Truy cáº­p | ThÃ nh cÃ´ng | Lá»—i chÃ­nh |
|---|---|---|---|---|
| `POST` | `/auth/signup` | Public | `201`, id/email/role | `400 INVALID_REQUEST`, `409 EMAIL_EXISTS` |
| `POST` | `/auth/login` | Public | `200`, accessToken/tokenType/expiresIn | `400 INVALID_REQUEST`, `401 UNAUTHORIZED` |
| `GET` | `/users/me` | Bearer token | `200`, username/authorities | `401 UNAUTHORIZED` |
| `GET` | `/users` | Bearer token | `200`, danh sÃ¡ch id/email/role | `401 UNAUTHORIZED` |

Request signup/login:

```json
{
  "email": "slot25.student@example.com",
  "password": "Sba301@2026"
}
```

VÃ­ dá»¥ response signup:

```json
{
  "id": 1,
  "email": "slot25.student@example.com",
  "role": "USER"
}
```

VÃ­ dá»¥ response login:

```json
{
  "accessToken": "<JWT>",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

DÃ¹ng token trong header `Authorization: Bearer <JWT>` cho `/users/me` vÃ  `/users`. KhÃ´ng gá»­i user id Ä‘á»ƒ xÃ¡c Ä‘á»‹nh endpoint `/users/me`; endpoint nÃ y láº¥y danh tÃ­nh tá»« Authentication hiá»‡n táº¡i.

## 4. Kiáº¿n trÃºc thÆ° má»¥c

```text
.
â”œâ”€â”€ pom.xml
â”œâ”€â”€ README.md
â”œâ”€â”€ .gitignore
â”œâ”€â”€ database
â”‚   â”œâ”€â”€ 01-create-database.sql
â”‚   â””â”€â”€ 02-verify-app-user.sql
â”œâ”€â”€ scripts
â”‚   â””â”€â”€ run-local.ps1
â””â”€â”€ src
    â”œâ”€â”€ main
    â”‚   â”œâ”€â”€ java/edu/slot25/security
    â”‚   â”‚   â”œâ”€â”€ SecurityJwtApplication.java
    â”‚   â”‚   â”œâ”€â”€ auth
    â”‚   â”‚   â”‚   â”œâ”€â”€ AuthResponse.java
    â”‚   â”‚   â”‚   â”œâ”€â”€ AuthService.java
    â”‚   â”‚   â”‚   â”œâ”€â”€ AuthenticationController.java
    â”‚   â”‚   â”‚   â”œâ”€â”€ LoginRequest.java
    â”‚   â”‚   â”‚   â””â”€â”€ SignupRequest.java
    â”‚   â”‚   â”œâ”€â”€ error
    â”‚   â”‚   â”‚   â”œâ”€â”€ ApiError.java
    â”‚   â”‚   â”‚   â”œâ”€â”€ EmailAlreadyExistsException.java
    â”‚   â”‚   â”‚   â””â”€â”€ RestExceptionHandler.java
    â”‚   â”‚   â”œâ”€â”€ jwt
    â”‚   â”‚   â”‚   â”œâ”€â”€ JwtAuthenticationFilter.java
    â”‚   â”‚   â”‚   â””â”€â”€ JwtService.java
    â”‚   â”‚   â”œâ”€â”€ security
    â”‚   â”‚   â”‚   â”œâ”€â”€ RestAuthenticationEntryPoint.java
    â”‚   â”‚   â”‚   â””â”€â”€ SecurityConfiguration.java
    â”‚   â”‚   â””â”€â”€ user
    â”‚   â”‚       â”œâ”€â”€ AppUser.java
    â”‚   â”‚       â”œâ”€â”€ AppUserRepository.java
    â”‚   â”‚       â”œâ”€â”€ UserController.java
    â”‚   â”‚       â””â”€â”€ UserResponse.java
    â”‚   â””â”€â”€ resources/application.properties
    â””â”€â”€ test
        â”œâ”€â”€ java/edu/slot25/security/auth/AuthFlowIntegrationTest.java
        â””â”€â”€ resources/application.properties
```

**Ranh giá»›i trÃ¡ch nhiá»‡m:** `auth` xá»­ lÃ½ API vÃ  use case signup/login; `user` chá»©a entity, repository, response vÃ  protected controller; `jwt` kÃ½/Ä‘á»c token vÃ  gáº¯n danh tÃ­nh vÃ o request; `security` khai bÃ¡o provider/filter chain/401 entry point; `error` chuáº©n hÃ³a REST errors. `database` chá»©a script táº¡o database vÃ  script kiá»ƒm chá»©ng; Hibernate táº¡o/migrate báº£ng theo entity trong mÃ´i trÆ°á»ng lab.

## 5. CÃ i Ä‘áº·t vÃ  cáº¥u hÃ¬nh mÃ´i trÆ°á»ng

### 5.1. CÃ i prerequisites

1. **JDK 21:** CÃ i JDK 21 vÃ  thiáº¿t láº­p `JAVA_HOME`, thÃªm `%JAVA_HOME%\bin` vÃ o `PATH`.
2. **Maven 3.9 trá»Ÿ lÃªn:** CÃ i Maven vÃ  thÃªm thÆ° má»¥c `bin` vÃ o `PATH`. CÃ³ thá»ƒ dÃ¹ng Maven Wrapper náº¿u Ä‘Æ°á»£c thÃªm vÃ o project sau nÃ y; workspace hiá»‡n dÃ¹ng Maven cÃ i trÃªn mÃ¡y.
3. **SQL Server:** CÃ i SQL Server Developer/Express hoáº·c dÃ¹ng SQL Server instance cÃ³ thá»ƒ truy cáº­p. Báº­t TCP/IP, cáº¥u hÃ¬nh port `1433`, báº­t SQL Server authentication (Mixed Mode), vÃ  khá»Ÿi Ä‘á»™ng service.
4. **SQL client:** CÃ i SSMS hoáº·c `sqlcmd` Ä‘á»ƒ cháº¡y script vÃ  xem dá»¯ liá»‡u.
5. **IDE/API client (khuyáº¿n nghá»‹):** IntelliJ IDEA hoáº·c VS Code; Postman Ä‘á»ƒ gá»­i REST request.

Kiá»ƒm tra Java vÃ  Maven trong PowerShell:

```powershell
java -version
mvn -version
```

**Káº¿t quáº£ mong Ä‘á»£i:** Java 21 vÃ  Maven 3.9+ Ä‘Æ°á»£c in ra; Maven sá»­ dá»¥ng Ä‘Ãºng JDK. Náº¿u lá»‡nh khÃ´ng nháº­n diá»‡n, sá»­a `PATH`/`JAVA_HOME`, Ä‘Ã³ng vÃ  má»Ÿ láº¡i terminal.

### 5.2. Táº¡o database

Tá»« thÆ° má»¥c gá»‘c project, cháº¡y script báº±ng `sqlcmd`:

```powershell
sqlcmd -S localhost,1433 -U sa -C -i database\01-create-database.sql
```

`sqlcmd` sáº½ há»i password tÆ°Æ¡ng tÃ¡c; khÃ´ng thÃªm password báº±ng `-P` Ä‘á»ƒ trÃ¡nh lÆ°u credential vÃ o shell history/process arguments. `-C` cháº¥p nháº­n certificate server trong mÃ´i trÆ°á»ng local há»c táº­p. Náº¿u dÃ¹ng SSMS, má»Ÿ `database/01-create-database.sql`, káº¿t ná»‘i Ä‘Ãºng instance rá»“i Execute.

**Verification:** cháº¡y truy váº¥n:

```sql
SELECT name FROM sys.databases WHERE name = N'OrchidManagementDB';
```

Pháº£i cÃ³ Ä‘Ãºng má»™t dÃ²ng `OrchidManagementDB`. Script chá»‰ táº¡o database khi chÆ°a tá»“n táº¡i, khÃ´ng xÃ³a database hiá»‡n táº¡i.

### 5.3. Äáº·t biáº¿n mÃ´i trÆ°á»ng an toÃ n

á»¨ng dá»¥ng cáº§n:

- `DB_PASSWORD`: password cá»§a SQL Server login `sa` (hoáº·c Ä‘á»•i username trong `application.properties` sang DB login phÃ¹ há»£p).
- `JWT_SECRET`: Base64 cá»§a tá»‘i thiá»ƒu 32 byte ngáº«u nhiÃªn cho HMAC signing key. Táº¡o má»™t key riÃªng cho mÃ´i trÆ°á»ng; khÃ´ng dÃ¹ng key test bÃªn dÆ°á»›i.

#### CÃ¡ch khuyáº¿n nghá»‹: cháº¡y Maven báº±ng script local

```powershell
.\scripts\run-local.ps1
```

Script há»i password SQL Server báº±ng secure prompt, sinh JWT key ngáº«u nhiÃªn trong bá»™ nhá»›, Ä‘áº·t hai giÃ¡ trá»‹ lÃ m environment variables cho tiáº¿n trÃ¬nh Maven, rá»“i xÃ³a chÃºng khi tiáº¿n trÃ¬nh dá»«ng. Key Ä‘Æ°á»£c táº¡o má»›i má»—i láº§n cháº¡y; vÃ¬ váº­y token tá»« láº§n cháº¡y trÆ°á»›c khÃ´ng cÃ²n há»£p lá»‡ sau khi restart. Script khÃ´ng ghi password/key vÃ o file.

Náº¿u muá»‘n cháº¡y lá»‡nh Maven trá»±c tiáº¿p thay vÃ¬ script, Ä‘áº·t biáº¿n trong cÃ¹ng cá»­a sá»• PowerShell:

```powershell
$securePassword = Read-Host "SQL Server password" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}

$keyBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($keyBytes)
$env:JWT_SECRET = [Convert]::ToBase64String($keyBytes)
```

Sau Ä‘Ã³ cháº¡y `mvn spring-boot:run` ngay trong cá»­a sá»• Ä‘Ã³. JWT secret má»›i Ä‘Æ°á»£c táº¡o má»—i láº§n thá»±c hiá»‡n block; token cÅ© sáº½ khÃ´ng xÃ¡c thá»±c sau khi khá»Ÿi Ä‘á»™ng láº¡i vá»›i key khÃ¡c. Khi cáº§n giá»¯ token qua restart, lÆ°u key trong secret manager/OS environment Ä‘Æ°á»£c báº£o vá»‡ vÃ  tÃ¡i sá»­ dá»¥ng, khÃ´ng ghi key vÃ o repository.

#### Cáº¥u hÃ¬nh IntelliJ Ä‘á»ƒ cháº¡y `main()`

1. Má»Ÿ **Run â†’ Edit Configurationsâ€¦**, thÃªm cáº¥u hÃ¬nh **Spring Boot** (hoáº·c **Application**) vÃ  chá»n main class `edu.slot25.security.SecurityJwtApplication`.
2. á»ž **Environment variables**, khai bÃ¡o `DB_PASSWORD` vá»›i Ä‘Ãºng password SQL Server `sa` vÃ  `JWT_SECRET` lÃ  Base64 cá»§a 32 byte ngáº«u nhiÃªn. KhÃ´ng nháº­p literal placeholder nhÆ° `${DB_PASSWORD}` vÃ o trÆ°á»ng giÃ¡ trá»‹.
3. Äá»ƒ táº¡o signing key cho cáº¥u hÃ¬nh local, má»Ÿ PowerShell:

   ```powershell
   $keyBytes = New-Object byte[] 32
   $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
   try { $rng.GetBytes($keyBytes); [Convert]::ToBase64String($keyBytes) }
   finally { $rng.Dispose(); [Array]::Clear($keyBytes, 0, $keyBytes.Length) }
   ```

   Copy chuá»—i Base64 Ä‘Æ°á»£c in ra vÃ o `JWT_SECRET` trong Run Configuration. Cáº¥u hÃ¬nh nÃ y náº±m local trong IDE; khÃ´ng chia sáº» mÃ n hÃ¬nh/log chá»©a secret vÃ  khÃ´ng commit `.idea`.
4. Chá»n JDK 21 vÃ  module/classpath cá»§a project, Apply rá»“i Run/Debug.

Náº¿u app bÃ¡o thiáº¿u `DB_PASSWORD`/`JWT_SECRET`, kiá»ƒm tra **Run Configuration cá»§a chÃ­nh process Java**; biáº¿n chá»‰ Ä‘áº·t trong má»™t terminal khÃ´ng tá»± Ä‘Æ°á»£c truyá»n cho IntelliJ Ä‘Ã£ má»Ÿ trÆ°á»›c Ä‘Ã³.

### 5.4. Cáº¥u hÃ¬nh á»©ng dá»¥ng

`src/main/resources/application.properties` dÃ¹ng SQL Server táº¡i `localhost:1433`, database `OrchidManagementDB`, `ddl-auto=update`, SQL logging cho má»¥c Ä‘Ã­ch há»c táº­p, JWT expiration 900000 ms (15 phÃºt). Password vÃ  signing secret Ä‘Æ°á»£c tham chiáº¿u qua environment variables.

Náº¿u instance/database/user/port khÃ¡c mÃ¡y máº«u, chá»‰nh JDBC URL vÃ  `spring.datasource.username` cho phÃ¹ há»£p. Äáº£m báº£o SQL Server cho phÃ©p TCP/IP vÃ  database login cÃ³ quyá»n táº¡o/alter báº£ng cho Hibernate trong mÃ´i trÆ°á»ng lab.

### 5.5. CÃ i dependency vÃ  cháº¡y test ban Ä‘áº§u

```powershell
mvn dependency:tree | Select-String -Pattern "security|data-jpa|mssql|jjwt"
mvn test
```

**Káº¿t quáº£ mong Ä‘á»£i:** dependency tree gá»“m Spring Security, JPA, `mssql-jdbc`, `jjwt-api`, `jjwt-impl`, `jjwt-jackson`; test dÃ¹ng database H2 trong bá»™ nhá»› vÃ  khÃ´ng cáº§n SQL Server. Build cuá»‘i cÃ³ `BUILD SUCCESS`.

## 6. Workbook â€“ step by step thá»±c hiá»‡n

Má»—i bÆ°á»›c gá»“m **Má»¥c tiÃªu â†’ thao tÃ¡c â†’ code/config â†’ lá»‡nh cháº¡y â†’ verification â†’ PASS/FAIL**. CÃ¡c lá»‡nh PowerShell cháº¡y á»Ÿ thÆ° má»¥c gá»‘c project. Vá»›i bÆ°á»›c API, á»©ng dá»¥ng pháº£i Ä‘ang cháº¡y, trá»« khi bÆ°á»›c ghi rÃµ chá»‰ cháº¡y test.

### Step 1 â€“ Kiá»ƒm tra project dependencies

- **Má»¥c tiÃªu:** Project cÃ³ Ä‘Ãºng Web/Security/JPA/SQL Server/Test/JWT.
- **Thao tÃ¡c:** Resolve vÃ  xem dependency graph.
- **Code/config:** `pom.xml` khai bÃ¡o Spring Boot Web, Security, Data JPA, Validation, SQL Server JDBC, JJWT vÃ  test dependencies.
- **Lá»‡nh cháº¡y:** `mvn dependency:tree | Select-String -Pattern "spring-boot-starter-security|spring-boot-starter-data-jpa|mssql-jdbc|jjwt"`
- **Verification:** Output cÃ³ `spring-boot-starter-security`, `spring-boot-starter-data-jpa`, `mssql-jdbc` vÃ  Ä‘á»§ ba JJWT module.
- **PASS/FAIL:** PASS náº¿u táº¥t cáº£ xuáº¥t hiá»‡n vÃ  Maven káº¿t thÃºc thÃ nh cÃ´ng; FAIL náº¿u dependency resolve lá»—i hoáº·c thiáº¿u module.

### Step 2 â€“ Cáº¥u hÃ¬nh datasource vÃ  JWT settings

- **Má»¥c tiÃªu:** á»¨ng dá»¥ng káº¿t ná»‘i SQL Server vÃ  cÃ³ HMAC key an toÃ n.
- **Thao tÃ¡c:** CÃ i/start SQL Server, cháº¡y `database/01-create-database.sql`, khai bÃ¡o hai environment variables.
- **Code/config:** `application.properties` tham chiáº¿u `${DB_PASSWORD}`/`${JWT_SECRET}`; `security.jwt.expiration-ms=900000`.
- **Lá»‡nh cháº¡y:** Khuyáº¿n nghá»‹ `.\scripts\run-local.ps1`; cÃ¡ch khÃ¡c: Ä‘áº·t env theo má»¥c 5.3 rá»“i cháº¡y `mvn spring-boot:run` trong cÃ¹ng PowerShell. Trong IntelliJ dÃ¹ng Run Configuration theo má»¥c 5.3.
- **Verification:** Log cÃ³ Hikari pool káº¿t ná»‘i thÃ nh cÃ´ng, Hibernate khá»Ÿi Ä‘á»™ng vÃ  Tomcat láº¯ng nghe port 8080. `DB_PASSWORD` sai, database chÆ°a táº¡o hoáº·c SQL Server chÆ°a cháº¡y sáº½ khiáº¿n startup tháº¥t báº¡i; sá»­a nguyÃªn nhÃ¢n trÆ°á»›c khi tiáº¿p tá»¥c.
- **PASS/FAIL:** PASS khi startup hoÃ n táº¥t vÃ  datasource connected; FAIL khi unresolved property, login DB hoáº·c JDBC connection lá»—i.

### Step 3 â€“ Táº¡o User entity/schema

- **Má»¥c tiÃªu:** Biá»ƒu diá»…n user vá»›i password hash, role, enabled.
- **Thao tÃ¡c:** Khá»Ÿi Ä‘á»™ng app láº§n Ä‘áº§u trÃªn database má»›i; Hibernate táº¡o báº£ng theo entity.
- **Code/config:** `AppUser` map `dbo.AppUser`; `email` unique/required, `password` required, `role` máº·c Ä‘á»‹nh `USER`, `enabled` máº·c Ä‘á»‹nh true. Entity khÃ´ng implement `UserDetails`; security mapping tÃ¡ch á»Ÿ UserDetailsService.
- **Lá»‡nh cháº¡y:** Sau startup, cháº¡y `sqlcmd -S localhost,1433 -U sa -P "<SQL_SERVER_PASSWORD>" -C -i database\02-verify-app-user.sql` hoáº·c má»Ÿ script báº±ng SSMS.
- **Verification:** Script hiá»ƒn thá»‹ Ä‘á»‹nh nghÄ©a cá»™t `id`, `email`, `password`, `role`, `enabled`; báº£ng trá»‘ng lÃ  bÃ¬nh thÆ°á»ng trÆ°á»›c signup.
- **PASS/FAIL:** PASS náº¿u báº£ng/cá»™t Ä‘Æ°á»£c táº¡o vÃ  entity mapping khÃ´ng bÃ¡o lá»—i; FAIL náº¿u database context/schema sai hoáº·c Hibernate lá»—i.

### Step 4 â€“ Táº¡o UserRepository

- **Má»¥c tiÃªu:** TÃ¬m user theo email vÃ  kiá»ƒm tra trÃ¹ng láº·p báº±ng Spring Data.
- **Thao tÃ¡c:** Cháº¡y integration test; theo dÃµi `findByEmail` trong lÃºc login.
- **Code/config:** `AppUserRepository extends JpaRepository<AppUser, Long>` cÃ³ `findByEmail` vÃ  `existsByEmail`.
- **Lá»‡nh cháº¡y:** `mvn -Dtest=AuthFlowIntegrationTest test`
- **Verification:** Spring context khá»Ÿi Ä‘á»™ng repository; signup/login test Ä‘i qua JPA repository.
- **PASS/FAIL:** PASS náº¿u test xanh; FAIL náº¿u repository query/wiring lá»—i.

### Step 5 â€“ Táº¡o DTO vÃ  response classes

- **Má»¥c tiÃªu:** Validate request vÃ  tÃ¡ch API contract khá»i entity.
- **Thao tÃ¡c:** Gá»­i payload signup/login há»£p lá»‡ vÃ  payload thiáº¿u/sai email.
- **Code/config:** `SignupRequest`, `LoginRequest` lÃ  records cÃ³ Jakarta validation; `AuthResponse` chá»‰ chá»©a access token/type/expiry; `UserResponse` khÃ´ng chá»©a password/hash.
- **Lá»‡nh cháº¡y:** Gá»­i request tá»« Postman hoáº·c PowerShell; xem vÃ­ dá»¥ á»Ÿ má»¥c 7.1.
- **Verification:** Payload há»£p lá»‡ Ä‘Æ°á»£c xá»­ lÃ½; email sai hoáº·c password thiáº¿u/ngáº¯n tráº£ `400 {"error":"INVALID_REQUEST"}`.
- **PASS/FAIL:** PASS náº¿u response khÃ´ng chá»©a password vÃ  invalid input bá»‹ reject; FAIL náº¿u validation khÃ´ng cháº¡y hoáº·c credential bá»‹ expose.

### Step 6 â€“ Cáº¥u hÃ¬nh PasswordEncoder

- **Má»¥c tiÃªu:** BCrypt hash password trÆ°á»›c khi lÆ°u.
- **Thao tÃ¡c:** Signup má»™t user vÃ  so sÃ¡nh row vá»›i password gá»‘c.
- **Code/config:** Bean `BCryptPasswordEncoder`; `AuthService.signup` gá»i `encode`; test gá»i `matches`.
- **Lá»‡nh cháº¡y:** Signup theo má»¥c 7.1, sau Ä‘Ã³ cháº¡y `database/02-verify-app-user.sql`/truy váº¥n kiá»ƒm tra á»Ÿ má»¥c 7.3.
- **Verification:** DB lÆ°u BCrypt hash, khÃ´ng lÆ°u raw password; Java `passwordEncoder.matches(raw, hash)` tráº£ true (Ä‘Æ°á»£c kiá»ƒm tra trong integration test).
- **PASS/FAIL:** PASS náº¿u hash khÃ¡c raw vÃ  matches true; FAIL náº¿u password plaintext Ä‘Æ°á»£c lÆ°u hoáº·c khÃ´ng xÃ¡c thá»±c láº¡i Ä‘Æ°á»£c.

### Step 7 â€“ Cáº¥u hÃ¬nh UserDetailsService

- **Má»¥c tiÃªu:** Load user tá»« repository vÃ  chuyá»ƒn thÃ nh principal/security authorities.
- **Thao tÃ¡c:** Äáº·t breakpoint trong lambda `SecurityConfiguration.userDetailsService`; gá»i login user Ä‘Ã£ signup.
- **Code/config:** Email lÃ  username; password field nháº­n hash DB; role `USER` Ä‘Æ°á»£c Ã¡nh xáº¡ qua `.roles(...)` thÃ nh `ROLE_USER`; disabled theo `enabled`.
- **Lá»‡nh cháº¡y:** Cháº¡y app Debug, gá»­i `POST /auth/login`.
- **Verification:** Breakpoint cho tháº¥y `findByEmail(email)` vÃ  `UserDetails` cÃ³ username=email, authority `ROLE_USER`, password lÃ  hash.
- **PASS/FAIL:** PASS náº¿u account Ä‘Æ°á»£c load/authority Ä‘Ãºng; FAIL náº¿u email khÃ´ng lookup Ä‘Æ°á»£c hoáº·c authorities trá»‘ng/sai.

### Step 8 â€“ Cáº¥u hÃ¬nh AuthenticationProvider vÃ  AuthenticationManager

- **Má»¥c tiÃªu:** Äá»ƒ Spring Security chá»‹u trÃ¡ch nhiá»‡m xÃ¡c minh username/password.
- **Thao tÃ¡c:** Äáº·t breakpoint trÃªn `authenticationManager.authenticate(...)`, trace call stack.
- **Code/config:** `DaoAuthenticationProvider` dÃ¹ng `UserDetailsService` vÃ  `PasswordEncoder`; AuthenticationManager láº¥y tá»« `AuthenticationConfiguration`.
- **Lá»‡nh cháº¡y:** Cháº¡y `POST /auth/login` vá»›i credential há»£p lá»‡.
- **Verification:** Call path qua `AuthenticationManager` â†’ `DaoAuthenticationProvider` â†’ `UserDetailsService` â†’ repository vÃ  BCrypt `matches`.
- **PASS/FAIL:** PASS náº¿u authentication thÃ nh cÃ´ng nhá» provider; FAIL náº¿u AuthService tá»± so sÃ¡nh raw password hoáº·c bypass manager.

### Step 9 â€“ XÃ¢y dá»±ng signup service

- **Má»¥c tiÃªu:** Táº¡o tÃ i khoáº£n há»£p lá»‡, chá»‘ng trÃ¹ng email vÃ  chá»‰ lÆ°u hash.
- **Thao tÃ¡c:** Signup má»›i, signup láº¡i cÃ¹ng email.
- **Code/config:** `AuthService.signup` kiá»ƒm tra exists, encode password vÃ  persist; lá»—i duplicate tráº£ 409.
- **Lá»‡nh cháº¡y:** `POST /auth/signup` hai láº§n theo má»¥c 7.1.
- **Verification:** Request Ä‘áº§u tráº£ 201; láº§n sau tráº£ `409 {"error":"EMAIL_EXISTS"}`; database chá»‰ cÃ³ má»™t row cho email Ä‘Ã³.
- **PASS/FAIL:** PASS náº¿u response/DB Ä‘Ãºng; FAIL náº¿u duplicate táº¡o thÃªm row hoáº·c cÃ³ password plaintext.

### Step 10 â€“ XÃ¢y JwtService

- **Má»¥c tiÃªu:** Táº¡o signed JWT cÃ³ subject, `iat`, `exp`; parse vÃ  validate chá»¯ kÃ½/expiration.
- **Thao tÃ¡c:** Login, Ä‘á»c token response, rá»“i dÃ¹ng token gá»i endpoint protected.
- **Code/config:** `JwtService` giáº£i mÃ£ Base64 signing secret, kÃ½ HMAC, parse signed claims báº±ng JJWT 0.12.6 vÃ  so subject/expiration vá»›i user hiá»‡n táº¡i.
- **Lá»‡nh cháº¡y:** Gá»i login vÃ  `GET /users/me` theo má»¥c 7.1/7.2.
- **Verification:** Login response cÃ³ token; claim subject lÃ  email, `iat` vÃ  `exp` Ä‘Æ°á»£c táº¡o; token há»£p lá»‡ Ä‘Æ°á»£c cháº¥p nháº­n. Test malformed token nháº­n 401.
- **PASS/FAIL:** PASS náº¿u token Ä‘Æ°á»£c verify vÃ  háº¿t háº¡n bá»‹ reject; FAIL náº¿u token signature/expiry khÃ´ng Ä‘Æ°á»£c kiá»ƒm tra.

### Step 11 â€“ XÃ¢y login service qua AuthenticationManager

- **Má»¥c tiÃªu:** Chá»‰ phÃ¡t hÃ nh JWT khi credentials Ä‘Æ°á»£c Spring Security xÃ¡c thá»±c.
- **Thao tÃ¡c:** Gá»­i password Ä‘Ãºng, sau Ä‘Ã³ password sai.
- **Code/config:** `AuthService.login` authenticate `UsernamePasswordAuthenticationToken`; principal authenticated Ä‘Æ°á»£c truyá»n sang JwtService.
- **Lá»‡nh cháº¡y:** Postman/PowerShell `POST /auth/login`.
- **Verification:** ÄÃºng â†’ 200 vÃ  token; sai â†’ `401 {"error":"UNAUTHORIZED"}`, khÃ´ng cÃ³ access token vÃ  khÃ´ng tráº£ 500.
- **PASS/FAIL:** PASS náº¿u káº¿t quáº£ tÆ°Æ¡ng á»©ng; FAIL náº¿u password sai váº«n cÃ³ JWT.

### Step 12 â€“ XÃ¢y JwtAuthenticationFilter

- **Má»¥c tiÃªu:** Chuyá»ƒn Bearer JWT thÃ nh Authentication cho request hiá»‡n táº¡i.
- **Thao tÃ¡c:** So sÃ¡nh protected request khÃ´ng token, token há»£p lá»‡, token há»ng.
- **Code/config:** `OncePerRequestFilter` Ä‘á»c Authorization; validate JWT; load user; táº¡o authenticated token vá»›i authorities; lÆ°u vÃ o `SecurityContextHolder`. JWT filter chá»‰ Ä‘Äƒng kÃ½ trong SecurityFilterChain, khÃ´ng Ä‘Äƒng kÃ½ thÃ nh servlet filter thá»© hai.
- **Lá»‡nh cháº¡y:** Gá»i `/users/me` á»Ÿ má»¥c 7.2 vá»›i tá»«ng header.
- **Verification:** Token há»£p lá»‡ cho request tiáº¿p tá»¥c vá»›i principal; thiáº¿u/sai token khÃ´ng Ä‘Æ°á»£c Ä‘áº·t Authentication vÃ  káº¿t quáº£ protected endpoint lÃ  401 JSON; khÃ´ng log token.
- **PASS/FAIL:** PASS náº¿u há»£p lá»‡ Ä‘Æ°á»£c phÃ©p vÃ  invalid bá»‹ cháº·n; FAIL náº¿u token há»ng táº¡o 500 hoáº·c bypass báº£o vá»‡.

### Step 13 â€“ Cáº¥u hÃ¬nh SecurityFilterChain

- **Má»¥c tiÃªu:** Public auth endpoint, protect endpoint cÃ²n láº¡i, sá»­ dá»¥ng JWT stateless.
- **Thao tÃ¡c:** Gá»­i request auth khÃ´ng token vÃ  protected request cÃ³/khÃ´ng token.
- **Code/config:** CSRF táº¯t cho REST lab; `/auth/**` permitAll; any other request authenticated; `SessionCreationPolicy.STATELESS`; JWT filter trÆ°á»›c username/password filter.
- **Lá»‡nh cháº¡y:** Test no-token vÃ  valid-token á»Ÿ má»¥c 7.2.
- **Verification:** Signup/login public; `/users/me` vÃ  `/users` tá»« chá»‘i anonymous; request xÃ¡c thá»±c thÃ nh cÃ´ng.
- **PASS/FAIL:** PASS náº¿u behavior Ä‘Ãºng; FAIL náº¿u protected endpoint public hoáº·c auth route cáº§n token.

### Step 14 â€“ Táº¡o AuthenticationController

- **Má»¥c tiÃªu:** Expose signup/login qua HTTP API vÃ  validation.
- **Thao tÃ¡c:** Gá»­i JSON request tá»›i hai route.
- **Code/config:** `AuthenticationController` dÃ¹ng `@Valid`; signup 201, login 200.
- **Lá»‡nh cháº¡y:** `POST /auth/signup`, rá»“i `POST /auth/login`.
- **Verification:** Signup/login hoáº¡t Ä‘á»™ng khÃ´ng cÃ³ token; response signup khÃ´ng cÃ³ password.
- **PASS/FAIL:** PASS náº¿u status/JSON Ä‘Ãºng; FAIL náº¿u route khÃ´ng hoáº¡t Ä‘á»™ng hoáº·c lá»™ credential.

### Step 15 â€“ Táº¡o protected `/users/me`

- **Má»¥c tiÃªu:** Tráº£ principal hiá»‡n táº¡i, khÃ´ng nháº­n user id do client chá»n.
- **Thao tÃ¡c:** Gá»i endpoint vá»›i token tráº£ tá»« login.
- **Code/config:** `UserController.me(Authentication authentication)` tráº£ username vÃ  authorities.
- **Lá»‡nh cháº¡y:** `GET /users/me` vá»›i `Authorization: Bearer <JWT>`.
- **Verification:** 200; username/email khá»›p user Ä‘Äƒng nháº­p, authorities cÃ³ `ROLE_USER`; no-token tráº£ 401.
- **PASS/FAIL:** PASS náº¿u principal láº¥y tá»« Authentication; FAIL náº¿u user identity Ä‘Æ°á»£c tin tá»« client body/query.

### Step 16 â€“ Táº¡o protected `/users`

- **Má»¥c tiÃªu:** Chá»©ng minh endpoint danh sÃ¡ch user cÅ©ng chá»‹u authorization.
- **Thao tÃ¡c:** Gá»i GET `/users` khÃ´ng token vÃ  cÃ³ token.
- **Code/config:** `UserController.findAll` map entity sang `UserResponse`, khÃ´ng serialize entity/password.
- **Lá»‡nh cháº¡y:** `GET /users` vá»›i `Authorization: Bearer <JWT>`.
- **Verification:** No-token 401; token há»£p lá»‡ 200 vÃ  user list khÃ´ng chá»©a password.
- **PASS/FAIL:** PASS náº¿u cáº£ authorization vÃ  response shape Ä‘Ãºng; FAIL náº¿u anonymous truy cáº­p hoáº·c hash bá»‹ lá»™.

### Step 17 â€“ Chuáº©n hÃ³a lá»—i authentication

- **Má»¥c tiÃªu:** REST client luÃ´n nháº­n JSON 401 thay vÃ¬ trang lá»—i HTML.
- **Thao tÃ¡c:** Gá»i protected endpoint khÃ´ng token vÃ  login vá»›i password sai.
- **Code/config:** `RestAuthenticationEntryPoint` tráº£ `application/json`; `RestExceptionHandler` Ã¡nh xáº¡ authentication failure, duplicate signup, request validation.
- **Lá»‡nh cháº¡y:** `GET /users/me` no token; `POST /auth/login` sai password.
- **Verification:** 401 `{"error":"UNAUTHORIZED"}`; request invalid 400; duplicate 409. Response khÃ´ng gá»“m stack trace.
- **PASS/FAIL:** PASS náº¿u status/content-type/body khá»›p; FAIL náº¿u tráº£ HTML hoáº·c lá»—i 500 cho trÆ°á»ng há»£p dá»± kiáº¿n.

### Step 18 â€“ Trace login end-to-end

- **Má»¥c tiÃªu:** NhÃ¬n tháº¥y Authentication, Principal, GrantedAuthority, provider vÃ  password matching.
- **Thao tÃ¡c:** Äáº·t breakpoint á»Ÿ `AuthenticationController.login`, `AuthService.login`, `authenticate`, UserDetailsService lambda, repository `findByEmail`, `JwtService.generateToken`; cháº¡y app Debug vÃ  login.
- **Code/config:** Source chÃ­nh á»Ÿ `auth/AuthenticationController`, `auth/AuthService`, `security/SecurityConfiguration`, `user/AppUserRepository`, `jwt/JwtService`.
- **Lá»‡nh cháº¡y:** Debug application, rá»“i gá»­i login credentials Ä‘Ãºng.
- **Verification:** Controller â†’ AuthService â†’ AuthenticationManager â†’ DaoAuthenticationProvider â†’ UserDetailsService â†’ repository â†’ PasswordEncoder.matches â†’ authenticated UserDetails â†’ generate JWT. CREDENTIALS sai khÃ´ng tá»›i token generation.
- **PASS/FAIL:** PASS náº¿u call sequence/principal Ä‘Ãºng; FAIL náº¿u auth bá»‹ bá» qua hoáº·c token Ä‘Æ°á»£c sinh khi authentication tháº¥t báº¡i.

### Step 19 â€“ Trace protected request end-to-end

- **Má»¥c tiÃªu:** Quan sÃ¡t SecurityContextHolder/SecurityContext/Authentication trong request lifecycle.
- **Thao tÃ¡c:** Äáº·t breakpoint á»Ÿ filter, `JwtService.parseClaims`, UserDetailsService vÃ  `UserController.me`; gá»i endpoint cÃ³ Bearer token.
- **Code/config:** `SecurityContextHolder` giá»¯ `SecurityContext`; filter Ä‘áº·t Authentication sau verify token vÃ  trÆ°á»›c authorization; stateless policy khÃ´ng dá»±a session.
- **Lá»‡nh cháº¡y:** Login láº¥y JWT, sau Ä‘Ã³ `GET /users/me`.
- **Verification:** SecurityFilterChain â†’ JwtAuthenticationFilter â†’ parse/validate claims â†’ load user â†’ set Authentication â†’ authorization â†’ controller; `authentication.getName()` Ä‘Ãºng email.
- **PASS/FAIL:** PASS náº¿u controller nháº­n principal Ä‘Ãºng; FAIL náº¿u context khÃ´ng Ä‘Æ°á»£c set hoáº·c anonymous Ä‘i vÃ o handler.

### Step 20 â€“ Cháº¡y verification matrix

- **Má»¥c tiÃªu:** Kiá»ƒm tra cÃ¡c hÃ nh vi tá»‘i thiá»ƒu end-to-end.
- **Thao tÃ¡c:** Cháº¡y integration tests; sau Ä‘Ã³ láº·p láº¡i manual vá»›i SQL Server/Postman Ä‘á»ƒ kiá»ƒm tra mÃ´i trÆ°á»ng local.
- **Code/config:** `AuthFlowIntegrationTest` dÃ¹ng Spring context, MockMvc, JPA/H2 vÃ  real JWT generation/validation.
- **Lá»‡nh cháº¡y:** `mvn -Dtest=AuthFlowIntegrationTest test`
- **Verification matrix:**

| ID | Ká»‹ch báº£n | Káº¿t quáº£ mong Ä‘á»£i | Báº±ng chá»©ng |
|---|---|---|---|
| T01 | Signup valid | 201 | User row má»›i; password BCrypt |
| T02 | Signup duplicate | 409 | Chá»‰ má»™t row cho email |
| T03 | Login valid | 200 + JWT | Authentication provider thÃ nh cÃ´ng |
| T04 | Login sai password | 401 JSON | KhÃ´ng cÃ³ token |
| T05 | `/users/me` no token | 401 JSON | Controller khÃ´ng Ä‘Æ°á»£c gá»i |
| T06 | `/users/me` valid token | 200 | Principal/authority chÃ­nh xÃ¡c |
| T07 | `/users` valid token | 200 | Response khÃ´ng cÃ³ password |
| T08 | `/users/me` malformed token | 401 JSON | KhÃ´ng cÃ³ stack trace |

- **PASS/FAIL:** PASS náº¿u táº¥t cáº£ ká»‹ch báº£n cÃ³ káº¿t quáº£ nhÆ° báº£ng vÃ  test suite xanh; FAIL náº¿u báº¥t ká»³ status/body/DB evidence sai. Tampered/expired/role/CORS exhaustive matrix thuá»™c Slot 26 Part C.

### Step 21 â€“ Automated test bridge

- **Má»¥c tiÃªu:** CÃ³ regression test cháº¡y láº·p láº¡i mÃ  khÃ´ng cáº§n SQL Server.
- **Thao tÃ¡c:** Cháº¡y test trÃªn H2 profile properties riÃªng trong `src/test/resources`.
- **Code/config:** `@SpringBootTest` + `@AutoConfigureMockMvc`; test signup â†’ kiá»ƒm tra BCrypt trong DB â†’ login â†’ gá»i protected endpoints; thÃªm duplicate, wrong-password, no-token vÃ  malformed-token cases.
- **Lá»‡nh cháº¡y:** `mvn test`
- **Verification:** Surefire bÃ¡o 5 tests, 0 failures/errors vÃ  Maven `BUILD SUCCESS`; test config dÃ¹ng H2 `create-drop`, runtime config váº«n SQL Server.
- **PASS/FAIL:** PASS náº¿u toÃ n bá»™ test xanh; FAIL náº¿u compile, context hoáº·c test tháº¥t báº¡i.

## 7. Cháº¡y vÃ  kiá»ƒm chá»©ng á»©ng dá»¥ng

### 7.1. Khá»Ÿi cháº¡y

Äáº£m báº£o SQL Server/database Ä‘Ã£ sáºµn sÃ ng, sau Ä‘Ã³ cháº¡y script khá»Ÿi táº¡o local:

```powershell
.\scripts\run-local.ps1
```

Script sáº½ há»i password `sa`; nháº­p password SQL Server tháº­t, khÃ´ng nháº­p chuá»—i máº«u. Chá» log `Started SecurityJwtApplication`, sau Ä‘Ã³ má»Ÿ PowerShell thá»© hai Ä‘á»ƒ gá»­i API request. Náº¿u muá»‘n dÃ¹ng lá»‡nh Maven nguyÃªn báº£n, cáº§n cáº¥u hÃ¬nh cáº£ `DB_PASSWORD` vÃ  `JWT_SECRET` trong cÃ¹ng process theo má»¥c 5.3. Äá»ƒ cháº¡y nÃºt `main()` trong IntelliJ, cáº¥u hÃ¬nh environment variables ngay trong Run Configuration nhÆ° má»¥c 5.3.

### 7.2. Kiá»ƒm tra API báº±ng PowerShell

ÄÄƒng kÃ½ user (email cÃ³ thá»ƒ Ä‘á»•i; dÃ¹ng email má»›i náº¿u Ä‘Ã£ tá»“n táº¡i):

```powershell
$baseUrl = "http://localhost:8080"
$signupBody = @{
    email = "slot25.student@example.com"
    password = "Sba301@2026"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/signup" `
    -ContentType "application/json" -Body $signupBody
```

**Mong Ä‘á»£i:** response cÃ³ `id`, email, role; status lÃ  `201 Created`. PowerShell cÃ³ thá»ƒ trÃ¬nh bÃ y response khÃ¡c Postman, nhÆ°ng trÆ°á»ng password khÃ´ng Ä‘Æ°á»£c xuáº¥t hiá»‡n.

Login vÃ  giá»¯ access token trong biáº¿n:

```powershell
$login = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/login" `
    -ContentType "application/json" -Body $signupBody
$token = $login.accessToken
$login | Format-List
```

**Mong Ä‘á»£i:** `tokenType` lÃ  `Bearer`, `expiresIn` lÃ  `900`, accessToken khÃ´ng rá»—ng. KhÃ´ng chia sáº»/ghi token vÃ o source.

Gá»i hai protected endpoint:

```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Method Get -Uri "$baseUrl/users/me" -Headers $headers
Invoke-RestMethod -Method Get -Uri "$baseUrl/users" -Headers $headers
```

**Mong Ä‘á»£i:** `/users/me` tráº£ username/email vÃ  authorities `ROLE_USER`; `/users` tráº£ danh sÃ¡ch response DTO khÃ´ng cÃ³ password.

### 7.3. Kiá»ƒm tra lá»—i vÃ  dá»¯ liá»‡u database

No-token (PowerShell 7):

```powershell
try {
    Invoke-RestMethod -Method Get -Uri "$baseUrl/users/me"
}
catch {
    $_.ErrorDetails.Message
    [int]$_.Exception.Response.StatusCode
}
```

Mong Ä‘á»£i: status 401 vÃ  body `{"error":"UNAUTHORIZED"}`. Thá»­ login sai password: mong Ä‘á»£i cÃ¹ng JSON 401. Signup láº¡i cÃ¹ng email: 409 `EMAIL_EXISTS`. Gá»­i email khÃ´ng há»£p lá»‡/password ngáº¯n: 400 `INVALID_REQUEST`.

Kiá»ƒm tra schema vÃ  user Ä‘Ã£ lÆ°u:

```powershell
sqlcmd -S localhost,1433 -U sa -C -i database\02-verify-app-user.sql
```

Hoáº·c cháº¡y truy váº¥n trong SSMS:

```sql
USE OrchidManagementDB;
SELECT TOP (100) id, email, password, role, enabled
FROM dbo.AppUser
ORDER BY id DESC;
```

**Mong Ä‘á»£i:** row cho email signup; `password` lÃ  BCrypt hash (thÆ°á»ng báº¯t Ä‘áº§u `$2a$`/`$2b$`), khÃ´ng báº±ng raw password; role `USER`, enabled `1`. KhÃ´ng paste giÃ¡ trá»‹ hash/password/token vÃ o tÃ i liá»‡u cÃ´ng khai.

### 7.4. Kiá»ƒm tra automated

Dá»«ng app local náº¿u muá»‘n, sau Ä‘Ã³ cháº¡y:

```powershell
mvn test
```

**Mong Ä‘á»£i:** 5 integration tests pass. H2 Ä‘Æ°á»£c táº¡o/xÃ³a riÃªng trong tiáº¿n trÃ¬nh test; dá»¯ liá»‡u SQL Server local khÃ´ng Ä‘Æ°á»£c dÃ¹ng bá»Ÿi test nÃ y.

## 8. HÆ°á»›ng dáº«n debugger (IntelliJ IDEA)

1. Má»Ÿ project báº±ng `pom.xml`, chá» Maven import hoÃ n táº¥t, chá»n Project SDK JDK 21.
2. Táº¡o Run Configuration kiá»ƒu Spring Boot/Application cho `edu.slot25.security.SecurityJwtApplication`; Ä‘áº·t `DB_PASSWORD` vÃ  `JWT_SECRET` trong Environment variables theo má»¥c 5.3. KhÃ´ng nháº­p `${DB_PASSWORD}` lÃ m giÃ¡ trá»‹ literal.
3. Äáº·t breakpoint:
   - `AuthenticationController.signup` / `.login`
   - `AuthService.signup` / `.login`, dÃ²ng `authenticationManager.authenticate(...)`
   - lambda `SecurityConfiguration.userDetailsService`
   - `AppUserRepository.findByEmail` (cÃ³ thá»ƒ theo vÃ o proxy/query)
   - `JwtService.generateToken`
   - `JwtAuthenticationFilter.doFilterInternal`
   - `JwtService.parseClaims`
   - `UserController.me`
5. Cháº¡y Debug, táº¡o user vÃ  login báº±ng Postman. Quan sÃ¡t call stack vÃ  kiá»ƒm tra:
   - password trong DB/hash khÃ¡c raw password;
   - provider nháº­n raw password trong Authentication request vÃ  Ä‘á»‘i chiáº¿u báº±ng PasswordEncoder;
   - principal sau authentication lÃ  `UserDetails`, authority cÃ³ `ROLE_USER`;
   - token cÃ³ subject email vÃ  expiry;
   - protected request táº¡o Authentication tá»« UserDetails vÃ  Ä‘Æ°a vÃ o SecurityContext trÆ°á»›c khi controller cháº¡y.
6. KhÃ´ng copy password, JWT signing secret, bearer token hoáº·c token Ä‘áº§y Ä‘á»§ vÃ o screenshot/log/ticket.

## 9. KhÃ¡i niá»‡m cáº§n giáº£i thÃ­ch sau bÃ i thá»±c hÃ nh

| KhÃ¡i niá»‡m | Vai trÃ² trong project |
|---|---|
| Authentication | Váº­t thá»ƒ Spring Security mÃ´ táº£ request xÃ¡c thá»±c; trÆ°á»›c auth chá»©a credentials, sau auth chá»©a principal/authorities vÃ  authenticated=true |
| Principal | Danh tÃ­nh hiá»‡n táº¡i; á»Ÿ Ä‘Ã¢y `UserDetails` cÃ³ email lÃ m username |
| GrantedAuthority | Quyá»n Ä‘Æ°á»£c security kiá»ƒm tra, á»Ÿ Ä‘Ã¢y `ROLE_USER` |
| Role | NhÃ£n/nhÃ³m quyá»n; `.roles("USER")` tá»± thÃªm tiá»n tá»‘ `ROLE_` |
| Authorization | Quyáº¿t Ä‘á»‹nh endpoint cÃ³ cho Authentication hiá»‡n táº¡i Ä‘i qua hay khÃ´ng |
| SecurityContext | Chá»©a Authentication cho request hiá»‡n táº¡i |
| SecurityContextHolder | CÃ¡ch truy cáº­p context hiá»‡n hÃ nh trong quÃ¡ trÃ¬nh xá»­ lÃ½ request |
| AuthenticationManager | Äiá»ƒm vÃ o Ä‘iá»u phá»‘i viá»‡c xÃ¡c thá»±c credential |
| AuthenticationProvider | Thá»±c hiá»‡n má»™t phÆ°Æ¡ng thá»©c xÃ¡c thá»±c; `DaoAuthenticationProvider` tra user vÃ  dÃ¹ng encoder |
| UserDetailsService | Load representation security tá»« email/user repository |
| PasswordEncoder | Hash password lÃºc signup vÃ  kiá»ƒm tra raw password vá»›i hash khi login |
| JwtAuthenticationFilter | Äá»c Bearer token á»Ÿ request tiáº¿p theo vÃ  xÃ¢y Authentication |
| SecurityFilterChain | Chá»n routes public/protected vÃ  thá»© tá»± security filters |

## 10. Troubleshooting

| Triá»‡u chá»©ng | NguyÃªn nhÃ¢n thÆ°á»ng gáº·p | CÃ¡ch kiá»ƒm tra/sá»­a |
|---|---|---|
| Maven khÃ´ng cháº¡y/khÃ´ng táº£i dependencies | JDK/PATH hoáº·c network/repository | `java -version`, `mvn -version`, thá»­ `mvn -U test` |
| `Could not resolve placeholder DB_PASSWORD` hoáº·c `JWT_SECRET` | Env variable chÆ°a Ä‘Æ°á»£c truyá»n vÃ o process Java | DÃ¹ng `.\scripts\run-local.ps1`, hoáº·c Ä‘áº·t cáº£ hai biáº¿n trong Ä‘Ãºng terminal/IntelliJ Run Configuration rá»“i restart |
| `Login failed for user 'sa'` / SQL error 18456 | `DB_PASSWORD` trá»‘ng/sai, hoáº·c SQL Server chÆ°a cho phÃ©p SQL authentication | Äáº£m báº£o nháº­p Ä‘Ãºng password `sa`; thá»­ Ä‘Äƒng nháº­p báº±ng SSMS/sqlcmd; báº­t Mixed Mode vÃ  restart SQL Server náº¿u cáº§n. Port má»Ÿ khÃ´ng chá»©ng minh credentials há»£p lá»‡ |
| Invalid JWT Base64 / key too short | Secret khÃ´ng Base64 hoáº·c dÆ°á»›i 32 bytes | Táº¡o key báº±ng PowerShell má»¥c 5.3; khÃ´ng dÃ¹ng chuá»—i ngáº¯n tá»± nghÄ© |
| SQL Server connection refused/timeout | Service/TCP-IP/port sai | Kiá»ƒm tra SQL Server service, TCP/IP, firewall vÃ  port 1433 |
| Cannot open database | Database chÆ°a Ä‘Æ°á»£c táº¡o hoáº·c tÃªn sai | Cháº¡y `01-create-database.sql`, Ä‘á»‘i chiáº¿u JDBC URL |
| `401` khi gá»i protected route | Token thiáº¿u, sai, háº¿t háº¡n hoáº·c server Ä‘Ã£ restart vá»›i key khÃ¡c | Login láº¡i vÃ  dÃ¹ng token má»›i trong `Authorization: Bearer ...` |
| `409 EMAIL_EXISTS` | Email Ä‘Ã£ cÃ³ trong báº£ng | Chá»n email má»›i hoáº·c xÃ³a Ä‘Ãºng user lab theo quy trÃ¬nh DB do ngÆ°á»i quáº£n trá»‹ phÃª duyá»‡t |
| Test khÃ´ng káº¿t ná»‘i SQL Server | Äang cháº¡y test khÃ¡c test config hoáº·c profile bá»‹ override | `mvn test` máº·c Ä‘á»‹nh náº¡p `src/test/resources/application.properties` vÃ  dÃ¹ng H2 |

## 11. Known limitations vÃ  hÆ°á»›ng production

- `/users` hiá»‡n cho phÃ©p má»i authenticated user; chÆ°a cÃ³ `hasRole`/`@PreAuthorize`.
- JWT access token stateless; chÆ°a cÃ³ refresh token, revocation/denylist, logout phÃ­a server hoáº·c key rotation.
- `ddl-auto=update`, `show-sql=true`, login `sa` vÃ  `trustServerCertificate=true` dÃ nh cho lab local. Production nÃªn dÃ¹ng migration Flyway/Liquibase, DB account Ã­t quyá»n, TLS certificate Ä‘Æ°á»£c tin cáº­y, secret manager, log policy an toÃ n vÃ  database backup.
- Cáº§n bá»• sung rate limiting, brute-force protection/lockout, audit, policy máº­t kháº©u, kiá»ƒm thá»­ token expired/tampered, authorization theo role, CORS/CSRF policy theo kiáº¿n trÃºc client, TLS báº¯t buá»™c vÃ  giÃ¡m sÃ¡t.
- Error body hiá»‡n tá»‘i giáº£n Ä‘á»ƒ há»c status flow; production nÃªn thiáº¿t káº¿ error schema/correlation id vÃ  logging phÃ¹ há»£p, khÃ´ng tiáº¿t lá»™ thÃ´ng tin nháº¡y cáº£m.
