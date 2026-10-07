# Bộ test API — Orchid REST API

Tài liệu này là bộ testcase thủ công có request body, dữ liệu, kết quả mong đợi và hậu điều kiện đầy đủ để kiểm thử các endpoint trong Lab 04. Chạy ứng dụng và SQL Server trước khi gửi request.

## 1. Chuẩn bị

- Base URL: `http://localhost:8080`
- Không cần authentication.
- Với request có body, đặt header `Content-Type: application/json`.
- Khởi động ứng dụng bằng `mvn spring-boot:run`.
- Kiểm tra category mẫu và ghi lại ID thực tế:

```sql
USE OrchidDB;

SELECT category_id, category_name
FROM dbo.orchid_categories
WHERE category_name IN (N'Cattleya', N'Dendrobium')
ORDER BY category_id;
```

Database đã seed sẵn `Cattleya` và `Dendrobium` với ID `1` và `2`. Nếu ID trên máy chạy khác, thay tất cả `1`/`2` bên dưới bằng ID vừa truy vấn.

### Biến dùng trong testcase

| Biến | Giá trị ban đầu | Cách sử dụng |
|---|---|---|
| `baseUrl` | `http://localhost:8080` | Ghép với path API |
| `categoryCattleyaId` | `1` | Category hợp lệ cho POST |
| `categoryDendrobiumId` | `2` | Category hợp lệ khác, dùng kiểm tra PUT |
| `missingId` | `99999999` | Orchid ID không tồn tại |
| `orchidId` | Chưa có | Lưu `orchidID` nhận được ở TC05 |

Tên Orchid trong bộ test có hậu tố `20261007` để dễ tìm trong database. Nếu chạy lại cùng database, có thể dùng lại các testcase; các testcase tạo Orchid mới không yêu cầu tên duy nhất.

## 2. Thứ tự chạy

Chạy theo thứ tự TC01–TC18. TC05 tạo Orchid và cần lưu giá trị `orchidID` trong response vào biến `orchidId`. TC06–TC09 kiểm tra các trường hợp POST lỗi; TC10–TC14 kiểm tra PUT; TC15–TC17 kiểm tra DELETE và hậu điều kiện. TC18 kiểm tra dữ liệu còn sau khi restart ứng dụng.

## 3. Testcases

### TC01 — Lấy toàn bộ Orchid

- **Method / URL:** `GET {{baseUrl}}/api/orchids`
- **Body:** Không có.
- **Kết quả mong đợi:** `200 OK`; response là JSON array. Array có thể rỗng nếu chưa có bản ghi.
- **Kiểm tra:** Mỗi phần tử, nếu có, có `orchidID`, `orchidName` và `orchidCategory`; JSON không có vòng lặp lồng vô hạn.

### TC02 — Tìm Orchid theo tên, không phân biệt hoa thường

- **Method / URL:** `GET {{baseUrl}}/api/orchids?name=CATTLEYA`
- **Body:** Không có.
- **Kết quả mong đợi:** `200 OK`; response là JSON array chỉ chứa Orchid có `orchidName` chứa `CATTLEYA` không phân biệt hoa/thường. Array rỗng vẫn là kết quả hợp lệ nếu chưa có dữ liệu khớp.
- **Kiểm tra:** Sau khi TC05 chạy, kết quả bao gồm tên `SBA301 TCASE Cattleya Queen 20261007`.

### TC03 — Tìm kiếm trả về danh sách rỗng

- **Method / URL:** `GET {{baseUrl}}/api/orchids?name=NO_MATCH_20261007`
- **Body:** Không có.
- **Kết quả mong đợi:** `200 OK`; response là `[]`.

### TC04 — Lấy chi tiết Orchid không tồn tại

- **Method / URL:** `GET {{baseUrl}}/api/orchids/{{missingId}}`
- **Body:** Không có.
- **Kết quả mong đợi:** `404 Not Found`; không trả Orchid.

### TC05 — Tạo Orchid với category hợp lệ

- **Method / URL:** `POST {{baseUrl}}/api/orchids`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "orchidName": "SBA301 TCASE Cattleya Queen 20261007",
  "isNatural": true,
  "orchidDescription": "Test TC05 create Orchid with valid Cattleya category",
  "orchidCategory": {
    "categoryId": 1
  },
  "isAttractive": true,
  "orchidURL": "https://example.com/testcases/tc05-cattleya.jpg"
}
```

- **Kết quả mong đợi:** `201 Created`; response có `orchidID` được sinh tự động, `orchidName` chính xác, `isNatural=true`, `isAttractive=true`, URL và description chính xác; `orchidCategory.categoryId` bằng ID Cattleya thật.
- **Hậu điều kiện:** Lưu `orchidID` trong response vào `orchidId` để dùng cho TC07, TC10–TC13, TC15–TC16, TC18. Không gửi ID trong body.

### TC06 — Từ chối tạo Orchid khi thiếu category

- **Method / URL:** `POST {{baseUrl}}/api/orchids`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "orchidName": "SBA301 TCASE Missing Category 20261007",
  "isNatural": false,
  "orchidDescription": "Test TC06 category is omitted",
  "isAttractive": false,
  "orchidURL": "https://example.com/testcases/tc06-missing-category.jpg"
}
```

- **Kết quả mong đợi:** `400 Bad Request`; body lỗi JSON có field `message` với nội dung `categoryId is required`.
- **Hậu điều kiện:** Không có Orchid với tên `SBA301 TCASE Missing Category 20261007` trong database.

### TC07 — Từ chối tạo Orchid khi category ID không tồn tại

- **Method / URL:** `POST {{baseUrl}}/api/orchids`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
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
```

- **Kết quả mong đợi:** `400 Bad Request`; body lỗi JSON có field `message` chứa `Category not found: 99999999`.
- **Hậu điều kiện:** Không có Orchid với tên `SBA301 TCASE Invalid Category 20261007` trong database.

### TC08 — Từ chối tạo Orchid khi tên rỗng

- **Method / URL:** `POST {{baseUrl}}/api/orchids`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "orchidName": "   ",
  "isNatural": true,
  "orchidDescription": "Test TC08 blank name",
  "orchidCategory": {
    "categoryId": 1
  },
  "isAttractive": true,
  "orchidURL": "https://example.com/testcases/tc08-blank-name.jpg"
}
```

- **Kết quả mong đợi:** `400 Bad Request`; JSON lỗi có field `message` nhắc đến `orchidName`.
- **Hậu điều kiện:** Service không được gọi để lưu Orchid.

### TC09 — Từ chối body JSON sai định dạng

- **Method / URL:** `POST {{baseUrl}}/api/orchids`
- **Headers:** `Content-Type: application/json`
- **Raw body (cố ý không phải JSON hợp lệ):**

```text
{
```

- **Kết quả mong đợi:** `400 Bad Request`; response JSON có `message` bằng `Request body must contain valid JSON`.
- **Hậu điều kiện:** Không có Orchid mới được tạo.

### TC10 — Cập nhật toàn bộ Orchid và đổi category

- **Method / URL:** `PUT {{baseUrl}}/api/orchids/{{orchidId}}`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "orchidName": "SBA301 TCASE Cattleya Queen Updated 20261007",
  "isNatural": false,
  "orchidDescription": "Test TC10 full update and category replacement",
  "orchidCategory": {
    "categoryId": 2
  },
  "isAttractive": false,
  "orchidURL": "https://example.com/testcases/tc10-updated.jpg"
}
```

- **Kết quả mong đợi:** `200 OK`; response giữ nguyên `orchidID` của TC05, trả tất cả giá trị mới, `orchidCategory.categoryId` bằng ID Dendrobium thật.
- **Hậu điều kiện:** Chạy TC11 và xác nhận trạng thái đã cập nhật qua GET.

### TC11 — Đọc lại Orchid sau PUT

- **Method / URL:** `GET {{baseUrl}}/api/orchids/{{orchidId}}`
- **Body:** Không có.
- **Kết quả mong đợi:** `200 OK`; response có tên `SBA301 TCASE Cattleya Queen Updated 20261007`, `isNatural=false`, `isAttractive=false`, URL TC10 và category Dendrobium.

### TC12 — Từ chối PUT với category không tồn tại

- **Method / URL:** `PUT {{baseUrl}}/api/orchids/{{orchidId}}`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
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
```

- **Kết quả mong đợi:** `400 Bad Request`; body lỗi có `message` chứa `Category not found: 99999999`.
- **Hậu điều kiện:** TC11 vẫn trả state đã lưu ở TC10; không có thay đổi một phần.

### TC13 — PUT Orchid không tồn tại

- **Method / URL:** `PUT {{baseUrl}}/api/orchids/{{missingId}}`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "orchidName": "SBA301 TCASE Missing Orchid Update 20261007",
  "isNatural": true,
  "orchidDescription": "Test TC13 update a missing Orchid",
  "orchidCategory": {
    "categoryId": 1
  },
  "isAttractive": true,
  "orchidURL": "https://example.com/testcases/tc13-missing-update.jpg"
}
```

- **Kết quả mong đợi:** `404 Not Found`; không tạo Orchid mới.

### TC14 — PUT từ chối tên rỗng

- **Method / URL:** `PUT {{baseUrl}}/api/orchids/{{orchidId}}`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "orchidName": "",
  "isNatural": true,
  "orchidDescription": "Test TC14 blank name must not update",
  "orchidCategory": {
    "categoryId": 1
  },
  "isAttractive": true,
  "orchidURL": "https://example.com/testcases/tc14-blank-name.jpg"
}
```

- **Kết quả mong đợi:** `400 Bad Request`; JSON lỗi có field `message` nhắc đến `orchidName`.
- **Hậu điều kiện:** GET `orchidId` vẫn cho state sau TC10, không đổi.

### TC15 — Xóa Orchid đã tạo

- **Method / URL:** `DELETE {{baseUrl}}/api/orchids/{{orchidId}}`
- **Body:** Không có.
- **Kết quả mong đợi:** `204 No Content`; response body rỗng.
- **Lưu ý:** Chỉ xóa Orchid do TC05 tạo, không xóa category seed.

### TC16 — Kiểm tra Orchid đã xóa

- **Method / URL:** `GET {{baseUrl}}/api/orchids/{{orchidId}}`
- **Body:** Không có.
- **Kết quả mong đợi:** `404 Not Found`.
- **Hậu điều kiện:** SELECT database theo ID không còn trả row.

### TC17 — Xóa Orchid không tồn tại

- **Method / URL:** `DELETE {{baseUrl}}/api/orchids/{{missingId}}`
- **Body:** Không có.
- **Kết quả mong đợi:** `404 Not Found`; không thay đổi dữ liệu.

### TC18 — Kiểm tra dữ liệu được lưu bền vững sau restart

- **Thao tác:** Tạo một Orchid bằng lại body TC05 với tên `SBA301 TCASE Persistence 20261007`; ghi lại ID; dừng ứng dụng và chạy lại `mvn spring-boot:run`.
- **Request sau khi ứng dụng khởi động:** `GET {{baseUrl}}/api/orchids/{{orchidId}}`
- **Kết quả mong đợi:** `200 OK`; response còn đúng Orchid và category sau restart.
- **Dọn dữ liệu:** Gửi `DELETE {{baseUrl}}/api/orchids/{{orchidId}}`; mong đợi `204`.

## 4. Kiểm chứng SQL Server

Thay `@orchid_id` bằng ID response từ TC05 hoặc TC18. Chạy query sau TC05 và sau TC10 để xác nhận FK được ghi và cập nhật:

```sql
USE OrchidDB;

DECLARE @orchid_id BIGINT = 1; -- Thay bằng orchidID thực tế.

SELECT
    o.orchid_id,
    o.orchid_name,
    o.is_natural,
    o.orchid_description,
    o.is_attractive,
    o.orchid_url,
    o.category_id,
    c.category_name
FROM dbo.orchids AS o
JOIN dbo.orchid_categories AS c
    ON c.category_id = o.category_id
WHERE o.orchid_id = @orchid_id;
```

- Sau TC05: `category_name` là `Cattleya`.
- Sau TC10: `category_name` là `Dendrobium` và các trường khác khớp body TC10.
- Sau TC15: query không trả row.
- TC06–TC09 và TC12–TC14 không được làm phát sinh hoặc cập nhật bản ghi trái với expected result.

## 5. Ghi nhận kết quả chạy

Điền kết quả thực tế và đường dẫn screenshot/evidence sau khi chạy; không đánh dấu PASS nếu chưa quan sát được response và hậu điều kiện tương ứng.

| Test ID | Kết quả thực tế (status/body) | PASS/FAIL | Evidence |
|---|---|---|---|
| TC01–TC04 |  |  |  |
| TC05–TC09 |  |  |  |
| TC10–TC14 |  |  |  |
| TC15–TC17 |  |  |  |
| TC18 |  |  |  |
| SQL FK / hậu điều kiện |  |  |  |
