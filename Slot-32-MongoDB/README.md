# SBA301 – Slot 32: Data Management with MongoDB

Project thực hành cho Chapter 19 – Part A. Trọng tâm là mental model NoSQL/document, BSON, thiết kế theo access pattern, setup MongoDB/Compass và kiểm chứng model. API chỉ cung cấp CRUD tối thiểu; aggregation, index optimization và repository nâng cao nằm ngoài scope Slot 32.

## 1. Kết quả học tập và kiến trúc project

Sau bài lab, sinh viên phải giải thích và chứng minh được:

- Compass là GUI client; `mongod`/Atlas mới là server/deployment.
- Dữ liệu đi theo luồng `HTTP client → Spring Boot → MongoDB Java Driver → mongod/Atlas → database → collection → BSON document`.
- `Product.specs` và `Product.dimensions` là embedded documents; `tags` là array.
- `Product.categoryId` là reference thủ công tới `categories._id`, không phải foreign key tự động.
- `_id` của product do MongoDB sinh dưới dạng ObjectId; Spring trình bày nó thành JSON string.
- `price` được application map sang BSON `Decimal128`, `createdAt` sang BSON Date.
- Flexible schema cho phép shape khác nhau, nhưng Java validation và tùy chọn MongoDB schema validator vẫn bảo vệ contract.

Các artifact chính:

```text
src/main/java/.../product     Product, embedded value objects, API/service/repository
src/main/java/.../category    Category được quản lý độc lập và được reference
src/main/java/.../lab         Ping deployment và seed 5 documents
openapi/slot32-api.yaml       Contract API – source of truth
postman/collections/          Request + assertion có thể chạy lại
scripts/schema-validation.js  Validator phía MongoDB (tùy chọn)
compose.yaml                  Local MongoDB baseline
KNOWLEDGE_BASE.md             Nền tảng lý thuyết và code minh họa
```

## 2. Yêu cầu môi trường

- Java 21 (`java -version`)
- Maven 3.9+ (`mvn -version`)
- Một deployment MongoDB: local Community/Docker hoặc Atlas
- MongoDB Compass; `mongosh` được khuyến nghị
- Postman CLI chỉ cần khi chạy automated collection

Không commit URI có password. Project đọc biến `MONGODB_URI`, mặc định là `mongodb://localhost:27017/sba301_slot32`.

## 3. Quick start local bằng Docker

```powershell
docker compose up -d
docker compose ps
$env:MONGODB_URI = "mongodb://localhost:27017/sba301_slot32"
mvn spring-boot:run
```

Mở terminal khác:

```powershell
Invoke-RestMethod http://localhost:8080/api/lab/status
Invoke-RestMethod -Method Post http://localhost:8080/api/lab/seed
Invoke-RestMethod "http://localhost:8080/api/products?hdmi=true"
```

Kết quả tối thiểu: status có `connected: true`; seed báo `products >= 5`; filter HDMI trả về USB-C Hub.

## 4. Workbook step-by-step

Mỗi bước dưới đây tuân theo: **Mục tiêu → Kiến thức nền → Thao tác/Code → Run → Verification → PASS/FAIL → lỗi thường gặp**.

### Step 1 – Chọn deployment baseline

- **Mục tiêu:** chọn Local Community/Docker hoặc Atlas.
- **Kiến thức nền:** Compass cần endpoint của server; cài Compass không tạo database server.
- **Thao tác:** local phù hợp lab offline; Atlas phù hợp máy không có quyền cài service hoặc cần cloud shared lab. Ghi lựa chọn vào báo cáo.
- **Run:** chuẩn bị URI, ví dụ local `mongodb://localhost:27017/sba301_slot32`.
- **Verification:** biết server chạy ở máy nào, ai quản lý và URI nào được dùng.
- **PASS/FAIL:** PASS khi có deployment + URI; FAIL nếu chỉ có Compass.
- **Lỗi:** không có quyền cài service → Docker/Atlas/course deployment.

### Step 2 – Cài/khởi động deployment

- **Mục tiêu:** server sẵn sàng trước client.
- **Kiến thức nền:** local cần process/service `mongod`; Atlas cần cluster, database user và network access.
- **Thao tác:** cách tái lập nhanh của project là `docker compose up -d`. Nếu cài Community native, kiểm tra MongoDB service trong Windows Services.
- **Run:** `docker compose ps`; hoặc `mongosh --version` rồi `mongosh "mongodb://localhost:27017" --eval "db.runCommand({ping:1})"`.
- **Verification:** health là healthy hoặc ping trả `ok: 1`.
- **PASS/FAIL:** PASS khi endpoint reachable; FAIL khi process dừng/port chưa mở.
- **Lỗi:** port 27017 conflict → dừng process cũ hoặc đổi mapping và URI; Atlas → kiểm user, IP allow list, DNS.

### Step 3 – Cài Compass

- **Mục tiêu:** có GUI để inspect dữ liệu thật.
- **Kiến thức nền:** Compass là client; version UI có thể khác nhưng khái niệm không đổi.
- **Thao tác:** tải stable build từ trang MongoDB chính thức, cài và mở màn hình New Connection.
- **Run/Verification:** Compass launch không lỗi.
- **PASS/FAIL:** PASS khi thấy connection screen.
- **Lỗi:** lỗi startup → kiểm OS compatibility/update hoặc dùng course machine; không lấy installer từ nguồn không tin cậy.

### Step 4 – Kết nối local/Atlas

- **Mục tiêu:** client handshake/authenticate thành công.
- **Kiến thức nền:** URI chứa host, database và có thể chứa credentials/options.
- **Thao tác:** Compass → New Connection → paste URI → Connect.
- **Code/Config:** local `mongodb://localhost:27017`; Atlas có dạng `mongodb+srv://<user>:<password>@<cluster-host>/?retryWrites=true&w=majority`.
- **Verification:** thấy database list. API có phép kiểm độc lập: `GET /api/lab/status`.
- **PASS/FAIL:** PASS khi Compass và API connect; FAIL khi connection/auth error.
- **Lỗi:** `ECONNREFUSED` → server down/port sai; authentication failed → user/password/authSource; Atlas timeout → IP allow list/firewall/DNS.

### Step 5 – Tạo database và collection

- **Mục tiêu:** phân biệt logical database/collection/document.
- **Kiến thức nền:** database chứa collections; collection nhóm documents nhưng không tương đương table 1:1.
- **Thao tác:** Compass → Create Database: database `sba301_slot32`, collection `products`.
- **Run:** có thể để Spring tạo collection khi seed lần đầu: `POST /api/lab/seed`.
- **Verification:** sidebar có namespace `sba301_slot32.products`.
- **PASS/FAIL:** PASS khi collection tồn tại.
- **Lỗi:** MongoDB tạo database lazily; database rỗng có thể chưa hiện cho tới khi có collection/document.

### Step 6 – Insert document cơ bản

- **Mục tiêu:** quan sát field/value và `_id` tự sinh.
- **Thao tác:** Compass → products → Add Data → Insert Document:

```json
{ "name": "Mechanical Keyboard", "price": 79.9, "active": true }
```

- **Run/Verification:** Insert rồi xem `_id`, 3 fields và types.
- **PASS/FAIL:** PASS khi `_id` là ObjectId và values đúng.
- **Lỗi:** JSON sai quote/comma; lưu ý insert từ Compass có thể tạo `double`, trong khi API map `price` sang Decimal128.

### Step 7 – Nested document và array

- **Mục tiêu:** chứng minh document chứa nested structure.
- **Thao tác:** insert:

```json
{
  "name": "USB-C Hub",
  "price": 49.5,
  "tags": ["usb-c", "accessory"],
  "specs": { "ports": 7, "hdmi": true, "powerDeliveryW": 100 }
}
```

- **Verification:** expand `specs`; `tags` hiển thị array.
- **PASS/FAIL:** PASS khi `specs` không phải string và `tags` có hai phần tử.
- **Lỗi:** đừng đặt cả object/array trong dấu quote.

### Step 8 – Quan sát BSON types

- **Mục tiêu:** phân biệt string, number, boolean, Date, ObjectId, Decimal128.
- **Thao tác:** thêm bằng Extended JSON: `{ "createdAt": { "$date": "2026-10-28T00:00:00Z" } }` rồi so sánh với `{ "createdAt": "2026-10-28T00:00:00Z" }`.
- **Run:** trong API, seed tự tạo BSON Date và Decimal128; xem Type trong Compass Schema/Document view.
- **Verification:** Date có type Date; chuỗi vẫn là String; `_id` là ObjectId.
- **PASS/FAIL:** PASS khi giải thích type ảnh hưởng sort/filter.
- **Lỗi:** Extended JSON chỉ là biểu diễn text; actual BSON type mới là trọng tâm.

### Step 9 – Flexible schema experiment

- **Mục tiêu:** documents khác shape vẫn cùng collection.
- **Thao tác:** `{ "name": "Wireless Mouse", "price": 25.0, "warrantyMonths": 12 }`.
- **Verification:** so sánh ba products; document này không có `tags/specs`.
- **PASS/FAIL:** PASS khi coexist và sinh viên vẫn mô tả được contract kỳ vọng.
- **Lỗi:** không kết luận “MongoDB không có schema”; đây là flexible schema, còn schema có thể nằm ở app/validator.

### Step 10 – Filter cơ bản

- **Mục tiêu:** kiểm chứng server-side filtering/dot notation.
- **Thao tác:** Compass Filter `{ "specs.hdmi": true }`; API tương đương `GET /api/products?hdmi=true`.
- **Verification:** chỉ document có boolean `true` ở đúng nested path.
- **PASS/FAIL:** PASS khi USB-C Hub xuất hiện.
- **Lỗi:** `"true"` là string, khác `true` boolean; path/case phải chính xác.

### Step 11 – Projection/sort/limit awareness

- **Mục tiêu:** shape result mà không sửa stored data.
- **Thao tác:** Filter `{}`, Project `{ "name": 1, "price": 1 }`, Sort `{ "price": -1 }`, Limit `3` trong Compass.
- **Verification:** tối đa 3 rows, giảm dần, chỉ fields chọn (và `_id` mặc định).
- **PASS/FAIL:** PASS khi refresh document vẫn còn đủ fields.
- **Lỗi:** projection/sort/limit không phải update.

### Step 12 – Embedded model mini-case

- **Mục tiêu:** quyết định bằng access pattern/lifecycle.
- **Thao tác:** insert Monitor với `dimensions` và `tags`; sample đã có trong seed.
- **Verification:** giải thích dimensions nhỏ, bounded, thuộc riêng Monitor và thường đọc cùng product nên embed.
- **PASS/FAIL:** PASS khi lý do dựa trên read-together/lifecycle/growth.
- **Lỗi:** “MongoDB luôn embed” là sai; unbounded array hoặc lifecycle độc lập cần cân nhắc khác.

### Step 13 – Reference mini-case

- **Mục tiêu:** mô hình dữ liệu shared/independent.
- **Thao tác:** tạo `categories` với `{ "_id":"CAT-ACC", "name":"Accessories" }`; product dùng `"categoryId":"CAT-ACC"`. Endpoint seed đã dựng case này.
- **Verification:** trace ID giữa hai collections.
- **PASS/FAIL:** PASS khi nêu lợi ích tránh duplicate category và chi phí thêm query/consistency.
- **Lỗi:** MongoDB không tự enforce foreign key; service demo kiểm reference trước khi tạo product, nhưng Compass insert trực tiếp có thể bỏ qua.

### Step 14 – Break-It: sai type

- **Mục tiêu:** thấy type drift.
- **Thao tác:** trong Compass tạm insert `{ "name":"Bad Sample", "price":"79.9" }`; thử filter/range rồi xóa sample. Với API, gửi `"price":"not-a-number"` và nhận 400.
- **Verification:** Compass cho thấy string khác numeric/Decimal128.
- **PASS/FAIL:** PASS khi nêu được application validation và MongoDB validator là hai lớp phòng vệ.
- **Lỗi:** phải xóa bad sample sau experiment; nếu validator đã bật thì server sẽ reject ngay, cũng là kết quả đúng.

### Step 15 – Break-It: sai nested path

- **Mục tiêu:** diagnosis zero result.
- **Thao tác:** query `{ "spec.hdmi": true }`, sau đó sửa thành `{ "specs.hdmi": true }`.
- **Verification:** lần đầu 0, lần sau có result.
- **PASS/FAIL:** PASS khi xác định sai path, không đổ lỗi cho Compass.
- **Lỗi:** kiểm spelling, case, nesting và actual type.

### Step 16 – Break-It: server unavailable

- **Mục tiêu:** phân biệt client và server.
- **Thao tác local:** `docker compose stop mongodb`, refresh Compass/`GET /api/lab/status`, quan sát lỗi; phục hồi `docker compose start mongodb`.
- **Verification:** reconnect được sau khi server healthy.
- **PASS/FAIL:** PASS khi mô tả đúng server unavailable.
- **Lỗi:** không làm trên shared/production deployment; nhớ bật lại container.

### Step 17 – Evidence package

- **Mục tiêu:** tạo bằng chứng có thể chấm.
- **Thao tác:** chụp màn hình (che credentials): connection/deployment; `sba301_slot32.products`; simple doc + `_id`; nested doc/array; BSON type; correct nested filter; categories reference.
- **Verification:** ảnh có namespace và kết quả đủ đọc; không chứa password/Atlas secret.
- **PASS/FAIL:** PASS khi bằng chứng chứng minh cả setup lẫn model.
- **Lỗi:** ảnh chỉ chụp GUI trống hoặc crop mất database/collection không đủ chứng cứ.

### Step 18 – Schema sketch

- **Mục tiêu:** mô tả model trước framework CRUD.
- **Code/Config:** model cuối:

```text
products { _id:ObjectId, name:string, price:Decimal128, categoryId:string(reference),
  specs:object(embedded), dimensions:object(embedded), tags:array<string>,
  active:boolean, warrantyMonths:int?, createdAt:date }
categories { _id:string, name:string }
```

- **Verification:** peer review type, possible growth, embed/reference rationale.
- **PASS/FAIL:** PASS khi mỗi field có type và quan hệ có lý do.
- **Lỗi:** không dùng “any” mặc định; thống nhất money type theo quyết định course.

### Step 19 – Integration Gate G1–G12

Đánh dấu: G1 NoSQL; G2 document/BSON; G3 connect; G4 database; G5 collection; G6 simple doc; G7 nested/array; G8 types; G9 nested filter; G10 flexible schema; G11 embed/reference; G12 clean evidence. PASS khi ≥10/12 và không fail G2/G3/G10/G11. Nếu fail conceptual gate, đọc lại [KNOWLEDGE_BASE.md](KNOWLEDGE_BASE.md) trước slot CRUD tiếp theo.

### Step 20 – Bài tập tổng hợp cuối slot

- **Mục tiêu:** tự thiết kế, không copy domain product.
- **Thao tác:** tạo `slot32_lab`, hai collections, ≥5 documents, có embedded/array/reference; chạy 3 filters; viết đoạn giải thích quyết định.
- **Verification:** giảng viên xem evidence và yêu cầu sinh viên trace một field từ Compass tới BSON type/relationship.
- **PASS/FAIL:** PASS khi data hợp lệ, model có lý do, filters cho kết quả dự đoán được.
- **Lỗi:** đổi domain/fields thật sự; không chỉ đổi tên sample.

## 5. Chạy và kiểm thử project

### Maven tests

```powershell
mvn clean test
```

Test hiện có xác minh nested query delegation và việc application từ chối category reference không tồn tại.

### API thủ công

```powershell
$body = @{
  name = "Docking Station"
  price = 129.90
  active = $true
  tags = @("usb-c", "office")
  specs = @{ ports = 10; hdmi = $true; powerDeliveryW = 100 }
  categoryId = "CAT-ACC"
} | ConvertTo-Json -Depth 4

Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/products `
  -ContentType application/json -Body $body
```

### Postman CLI regression

Khởi động MongoDB + app, rồi:

```powershell
postman collection run postman/collections/slot32.postman_collection.json
```

Collection kiểm: ping, seed, nested HDMI filter, tạo embedded/reference product và reject wrong type. OpenAPI là contract nguồn; collection thêm thứ tự chạy và assertions.

### MongoDB schema validation (tùy chọn, chạy sau seed)

```powershell
mongosh "mongodb://localhost:27017/sba301_slot32" scripts/schema-validation.js
```

Sau khi bật, server từ chối price string. Script dùng `collMod`, vì vậy collection phải tồn tại. Đây là minh họa contract phía database, không phải yêu cầu bắt buộc để app chạy.

## 6. Dọn môi trường lab

Giữ dữ liệu: `docker compose stop`. Xóa container nhưng giữ volume: `docker compose down`. Chỉ khi chủ ý xóa toàn bộ data lab mới dùng `docker compose down -v`; thao tác này không phục hồi được từ volume đã xóa.

## 7. Checklist nộp bài

- Source chạy với `mvn test` và `mvn spring-boot:run`.
- Không commit credentials; Atlas screenshots đã che secrets.
- Evidence đáp ứng G1–G12.
- Có schema sketch và lý do embed/reference.
- Bad Sample đã xóa.
- Báo cáo ghi rõ local/Atlas, URI đã redact, ba filters và kết quả.
