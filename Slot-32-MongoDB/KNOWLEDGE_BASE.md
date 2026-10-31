# Knowledge Base – MongoDB/NoSQL/Document Model

Tài liệu này củng cố mental model của Slot 32. Nó không thay cho thực hành: mỗi khái niệm nên được đối chiếu với document thật trong Compass.

## 1. NoSQL và các họ database

**NoSQL** là nhóm database không bắt buộc tổ chức dữ liệu theo relational table/row và SQL. Nó xuất hiện để phục vụ những workload, data shape, latency và cách scale mà một model khác có thể phù hợp hơn. NoSQL không có nghĩa “không có schema”, “không cần consistency” hoặc “luôn nhanh hơn SQL”. Nếu cần transaction phức tạp xuyên nhiều entities, constraint/joins phong phú và dữ liệu quan hệ ổn định, relational database thường vẫn là lựa chọn tốt.

| Họ | Mental model | Phù hợp điển hình | Ví dụ câu hỏi |
|---|---|---|---|
| Document | JSON-like document có nested/array | catalog, content, profile | “Đọc toàn bộ product view” |
| Key-value | key → opaque value | cache, session | “Lấy session theo token” |
| Wide-column | rows với column families, phân tán lớn | telemetry/time-series lớn | “Đọc measurements theo partition” |
| Graph | vertices + edges | social, fraud, route | “Bạn của bạn cách 3 hops” |

Chọn database từ access pattern và constraints, không chọn bằng khẩu hiệu.

## 2. Document database, MongoDB và BSON

MongoDB lưu record dưới dạng **BSON document**. BSON là binary serialization mở rộng JSON, hỗ trợ ObjectId, Date, Decimal128, Binary và nhiều number types. Compass/mongosh/driver chuyển BSON sang representation phù hợp cho người hoặc ngôn ngữ lập trình.

```javascript
{
  _id: ObjectId("..."),             // BSON ObjectId
  name: "USB-C Hub",                // string
  price: Decimal128("49.50"),        // exact decimal
  active: true,                      // boolean
  createdAt: ISODate("2026-10-28T00:00:00Z"), // BSON Date
  tags: ["usb-c", "accessory"],    // array
  specs: { ports: 7, hdmi: true }    // embedded document
}
```

JSON thuần không biểu diễn trực tiếp ObjectId/Date/Decimal128. Extended JSON dùng các wrapper như `{"$date":"..."}` hoặc `{"$oid":"..."}` để vận chuyển type mà không làm mất nghĩa.

## 3. Database → collection → document → field/value

- **Database:** logical namespace chứa collections, ví dụ `sba301_slot32`.
- **Collection:** nhóm documents, ví dụ `products`. Nó giống table ở mức tổ chức nhưng không có equivalence 1:1 về schema/joins/constraints.
- **Document:** đơn vị lưu trữ cơ bản gồm field-value pairs và có thể nested.
- **Field/value:** `name` là field; `"USB-C Hub"` là value.
- **Embedded document:** `specs` là object nằm trong product.
- **Array:** `tags` chứa danh sách primitives; array cũng có thể chứa documents.

MongoDB document có giới hạn kích thước, nên không embed một cấu trúc tăng vô hạn. Cần đánh giá growth cùng access pattern.

## 4. `_id` và ObjectId

Mỗi document trong standard collection cần `_id` duy nhất. Nếu client không cung cấp, driver/server thường tạo ObjectId. ObjectId là BSON type phổ biến, không phải auto-increment integer và không nên dùng để suy luận business sequence.

Trong project:

```java
@Document("products")
public record Product(@Id String id, String name, ...) {}
```

Spring Data chuyển ObjectId BSON thành Java `String` khi trả JSON. `Category` cố ý dùng business-readable `_id` như `CAT-ACC` để cho thấy `_id` không bắt buộc là ObjectId.

## 5. Flexible schema và contract

Các documents trong một collection có thể khác fields/types. Khả năng này hỗ trợ evolution và heterogeneous shape, nhưng application vẫn cần kỳ vọng rõ ràng.

Ba lớp contract có thể phối hợp:

1. DTO/validation trong application (`@NotBlank`, `@DecimalMin`).
2. Mapping/type trong code (`BigDecimal` → BSON Decimal128).
3. `$jsonSchema` validator phía MongoDB trong `scripts/schema-validation.js`.

```java
public record ProductRequest(
    @NotBlank String name,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    List<@NotBlank String> tags) {}
```

Compass vẫn có thể insert trực tiếp ngoài application. Vì vậy app validation không tự bảo vệ mọi writer; server validator hữu ích khi nhiều writers cần chung contract.

## 6. Access pattern và denormalization

**Access pattern** là các read/write/query thường xuyên, kích thước result, latency và tần suất update. Document schema nên bắt đầu từ câu hỏi “application cần đọc/ghi gì cùng nhau?” thay vì chuyển từng table sang collection.

**Denormalization** chủ động đặt/nhân dữ liệu gần nơi đọc để giảm joins/round trips. Đổi lại, duplicate values tốn storage và update nhiều nơi có thể mất consistency. Denormalization là trade-off có chủ đích, không phải bỏ qua thiết kế.

Ví dụ product detail luôn hiển thị dimensions và chúng chỉ thuộc product: embed giảm round trip. Tên category thay đổi độc lập và dùng chung bởi hàng nghìn products: reference tránh duplicate, nhưng đọc view có thể cần query thứ hai hoặc aggregation ở slot sau.

## 7. Embedding hay referencing?

### Embedding phù hợp khi

- Dữ liệu thường được đọc/ghi cùng parent.
- Lifecycle gắn chặt; child không cần tồn tại độc lập.
- Cardinality/growth bounded.
- Atomic update trong một document có giá trị.

```json
{
  "name": "Monitor",
  "dimensions": { "widthCm": 61.2, "heightCm": 45.0 },
  "tags": ["display", "office"]
}
```

### Referencing phù hợp khi

- Related entity được chia sẻ bởi nhiều documents.
- Lifecycle/permissions/update độc lập.
- Embedded array có thể tăng lớn hoặc không bounded.
- Duplicate update cost không chấp nhận được.

```javascript
// categories
{ _id: "CAT-ACC", name: "Accessories" }
// products
{ name: "Mouse Pad", categoryId: "CAT-ACC", price: Decimal128("9.50") }
```

MongoDB không tự tạo foreign key constraint. Project kiểm tra `categories.existsById(categoryId)` ở service cho requests qua API; direct Compass writes vẫn cần kỷ luật hoặc validator/application khác.

### Quan hệ nền tảng

- **One-to-one:** embed nếu lifecycle/read-together; reference nếu object độc lập/lớn/nhạy cảm.
- **One-to-many:** embed bounded children khi đọc cùng; reference nếu many lớn/unbounded hoặc child được query độc lập.
- **Many-to-many:** thường references ở một/both sides; cân nhắc duplicate read model theo workload. Không embed vô hạn chỉ để tránh join.

## 8. BSON types quan trọng và Java mapping

| BSON | Java trong project | Ghi chú |
|---|---|---|
| ObjectId | `String id` qua Spring mapping | JSON response là chuỗi hex |
| String | `String` | case/type ảnh hưởng filter |
| Boolean | `Boolean` | khác string `"true"` |
| Int32 | `Integer` | ports, warrantyMonths |
| Decimal128 | `BigDecimal` + `@Field(targetType=DECIMAL128)` | thích hợp decimal chính xác |
| Date | `Instant` | thời điểm UTC |
| Document | Java record | `ProductSpecs`, `Dimensions` |
| Array | `List<String>` | `tags` |

Code mapping:

```java
@Field(targetType = FieldType.DECIMAL128)
BigDecimal price;

Instant createdAt;
```

Course phải quyết định rõ price dùng Decimal128 hay Double. Project chọn Decimal128 để tránh sai số binary floating point trong ví dụ money-like data.

## 9. Mental model deployment

```text
Compass / mongosh / Spring application
              │ MongoDB wire protocol (driver manages connection pool)
              ▼
        mongod process / Atlas endpoint
              │
        WiredTiger storage engine
              │
        database → collection → BSON document + indexes
```

- **Client/driver:** encode/decode BSON, connection/pool, gửi commands.
- **mongod:** database server process khi self-managed.
- **WiredTiger:** default storage engine của standard deployment; quản lý data/index/durability mechanisms.
- **Standalone:** một server, đơn giản cho local learning, không phải HA.
- **Replica set:** nhiều `mongod` giữ cùng data set để redundancy/high availability; có primary/secondaries.
- **Sharded cluster:** phân phối data qua shards để scale horizontally; cần shard key và operational design.
- **Atlas:** managed cloud service giảm gánh vận hành deployment/monitoring/backup tùy tier/config.

Slot 32 chỉ cần awareness; cấu hình replica/sharding/optimization là nội dung khác.

## 10. Compass, mongosh, driver và server

| Thành phần | Vai trò | Không phải |
|---|---|---|
| Compass | GUI connect/browse/insert/query/inspect | server |
| mongosh | interactive shell/REPL và scripting | application driver |
| Java Driver/Spring Data | application integration, BSON codec, pool | GUI |
| mongod/Atlas | nhận/lưu/truy vấn dữ liệu | client |

Một lỗi Compass connection không chứng minh Compass hỏng. Hãy phân lớp: URI parse → DNS/network → server reachable → TLS → authentication → authorization → database command.

## 11. Query tối thiểu để kiểm chứng model

Compass/mongosh filter:

```javascript
db.products.find({ "specs.hdmi": true })
db.products.find({ active: true }, { name: 1, price: 1 }).sort({ price: -1 }).limit(3)
db.products.find({ price: { $type: "string" } }) // phát hiện type drift
```

Spring Data derived query:

```java
List<Product> findBySpecsHdmi(Boolean hdmi);
```

Tên method được Spring Data dịch tới nested path. Đây là CRUD/filter tối thiểu để xác minh model, không phải bài aggregation/index optimization.

## 12. Chẩn đoán kết nối

1. **Server có chạy?** `docker compose ps` hoặc service/process status.
2. **Endpoint/port đúng?** local thường 27017; kiểm URI app/Compass giống nhau.
3. **Ping được?** `mongosh "<uri>" --eval "db.runCommand({ping:1})"`.
4. **Atlas network access?** client IP/VPN/firewall/DNS có được phép.
5. **Authentication?** đúng database user/password; URL-encode ký tự đặc biệt.
6. **TLS/options?** SRV/TLS theo URI Atlas; không copy placeholder.
7. **Authorization?** connect được nhưng command bị từ chối là quyền, không phải network.

Không in connection string có password vào log, screenshot hoặc Git.

## 13. Code walkthrough

### Seed không phá dữ liệu

`POST /api/lab/seed` tạo `CAT-ACC`; chỉ insert 5 products khi collection đang rỗng. Nó không `deleteAll`, giúp chạy lại an toàn hơn. Seed có product shapes khác nhau để quan sát flexible schema.

### Reference guard

```java
if (request.categoryId() != null
        && !categories.existsById(request.categoryId())) {
    throw new NotFoundException("Referenced category not found");
}
```

Đây là application-level consistency, không biến MongoDB thành relational FK.

### Embedded mapping

```java
ProductSpecs specs = new ProductSpecs(7, true, 100);
Product product = new Product(null, "USB-C Hub", price, true,
    List.of("usb-c"), specs, null, null, "CAT-ACC", Instant.now());
```

Spring Data serialize `ProductSpecs` ngay bên trong product document.

## 14. Câu hỏi tự kiểm tra

1. Vì sao collection không đơn giản là table đổi tên?
2. `price: "79.9"` khác `price: 79.9` thế nào với filter/sort?
3. Vì sao dimensions embed nhưng category reference trong project?
4. Khi nào một array đang bounded có thể trở thành rủi ro unbounded?
5. Compass đóng thì database có tiếp tục chạy không? Ngược lại, Compass mở nhưng `mongod` dừng thì sao?
6. App validation có bảo vệ document insert trực tiếp từ mongosh không?
7. ObjectId khác auto-increment ID ở mental model nào?
8. Với access pattern “luôn đọc product và 3 reviews mới nhất”, bạn cần hỏi thêm gì trước khi embed?

Sinh viên đạt khi trả lời bằng access pattern, lifecycle, cardinality/growth, consistency và evidence từ dữ liệu thật—không chỉ bằng câu “MongoDB linh hoạt”.
