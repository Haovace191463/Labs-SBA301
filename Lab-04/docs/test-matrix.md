# Test Matrix — SBA301 Lab 04 Orchid REST API & JPA Integration Kit

This matrix corresponds to the test plan specified in `test-cases.md`.

> **Note for Student/Reviewer:**
> - Columns **Observed Result**, **Status**, and **Evidence** are reserved for manual Postman execution and SQL verification screenshots.
> - Automated JUnit/MockMvc integration tests covering TC01–TC17 were executed and passed during Maven build (`mvn clean test`).

---

## Test Execution Matrix (TC01 – TC18)

| Test ID | Method | Endpoint / Action | Purpose | Expected Status | Expected Result | Observed Result | Status | Evidence |
|---|---|---|---|---|---|---|---|---|
| **TC01** | `GET` | `/api/orchids` | Lấy toàn bộ danh sách Orchid | `200 OK` | JSON array chứa danh sách Orchid (có thể rỗng nếu chưa có data) |  | *Pending Manual Run* | `evidence/postman/TC01.png` |
| **TC02** | `GET` | `/api/orchids?name=CATTLEYA` | Tìm Orchid theo tên (không phân biệt hoa/thường) | `200 OK` | JSON array chỉ chứa Orchid có tên chứa `CATTLEYA` (case-insensitive) |  | *Pending Manual Run* | `evidence/postman/TC02.png` |
| **TC03** | `GET` | `/api/orchids?name=NO_MATCH_20261007` | Tìm kiếm không có kết quả phù hợp | `200 OK` | JSON array rỗng `[]` |  | *Pending Manual Run* | `evidence/postman/TC03.png` |
| **TC04** | `GET` | `/api/orchids/99999999` | Lấy chi tiết Orchid không tồn tại | `404 Not Found` | Không trả Orchid |  | *Pending Manual Run* | `evidence/postman/TC04.png` |
| **TC05** | `POST` | `/api/orchids` | Tạo Orchid mới với category Cattleya hợp lệ (`categoryId=1`) | `201 Created` | JSON object chứa `orchidID` sinh tự động, `orchidName`, nested `orchidCategory` có `categoryId=1` |  | *Pending Manual Run* | `evidence/postman/TC05.png` |
| **TC06** | `POST` | `/api/orchids` | Từ chối tạo Orchid khi thiếu category trong body | `400 Bad Request` | `{"message": "categoryId is required"}` |  | *Pending Manual Run* | `evidence/postman/TC06.png` |
| **TC07** | `POST` | `/api/orchids` | Từ chối tạo Orchid khi `categoryId=99999999` không tồn tại | `400 Bad Request` | `{"message": "Category not found: 99999999"}` |  | *Pending Manual Run* | `evidence/postman/TC07.png` |
| **TC08** | `POST` | `/api/orchids` | Từ chối tạo Orchid khi `orchidName` là khoảng trắng | `400 Bad Request` | `{"message": "orchidName must not be blank"}` |  | *Pending Manual Run* | `evidence/postman/TC08.png` |
| **TC09** | `POST` | `/api/orchids` | Từ chối body JSON sai cú pháp (`{`) | `400 Bad Request` | `{"message": "Request body must contain valid JSON"}` |  | *Pending Manual Run* | `evidence/postman/TC09.png` |
| **TC10** | `PUT` | `/api/orchids/{{orchidId}}` | Cập nhật toàn bộ Orchid và đổi category sang Dendrobium (`categoryId=2`) | `200 OK` | Trả về Orchid với thông tin mới, `orchidID` giữ nguyên, categoryId đổi thành 2 |  | *Pending Manual Run* | `evidence/postman/TC10.png` |
| **TC11** | `GET` | `/api/orchids/{{orchidId}}` | Đọc lại Orchid sau khi PUT để xác minh trạng thái | `200 OK` | Trả về đúng dữ liệu vừa update ở TC10 |  | *Pending Manual Run* | `evidence/postman/TC11.png` |
| **TC12** | `PUT` | `/api/orchids/{{orchidId}}` | Từ chối PUT với category không tồn tại (`categoryId=99999999`) | `400 Bad Request` | `{"message": "Category not found: 99999999"}`; dữ liệu cũ không bị thay đổi |  | *Pending Manual Run* | `evidence/postman/TC12.png` |
| **TC13** | `PUT` | `/api/orchids/99999999` | PUT với Orchid ID không tồn tại | `404 Not Found` | Không tạo mới Orchid |  | *Pending Manual Run* | `evidence/postman/TC13.png` |
| **TC14** | `PUT` | `/api/orchids/{{orchidId}}` | PUT từ chối tên rỗng (`""`) | `400 Bad Request` | `{"message": "orchidName must not be blank"}`; dữ liệu cũ không bị thay đổi |  | *Pending Manual Run* | `evidence/postman/TC14.png` |
| **TC15** | `DELETE` | `/api/orchids/{{orchidId}}` | Xóa Orchid đã tạo | `204 No Content` | Body rỗng |  | *Pending Manual Run* | `evidence/postman/TC15.png` |
| **TC16** | `GET` | `/api/orchids/{{orchidId}}` | Đọc lại Orchid vừa xóa để kiểm tra hậu điều kiện | `404 Not Found` | Không tìm thấy entity |  | *Pending Manual Run* | `evidence/postman/TC16.png` |
| **TC17** | `DELETE` | `/api/orchids/99999999` | Xóa Orchid không tồn tại | `404 Not Found` | Không thay đổi dữ liệu |  | *Pending Manual Run* | `evidence/postman/TC17.png` |
| **TC18** | `GET` | `/api/orchids/{{orchidId}}` | Khởi động lại ứng dụng và kiểm tra dữ liệu tồn tại trong SQL Server | `200 OK` | Orchid tạo lại trước khi restart vẫn truy vấn được |  | *Pending Manual Run* | `evidence/postman/TC18.png` |

---

## SQL Server Verification Checkpoints

| Checkpoint | Target State / Query | Expected Observation | Observed Result | Status | Evidence |
|---|---|---|---|---|---|
| **SQL-01** | `SELECT * FROM dbo.orchid_categories` | Chứa 2 bản ghi seed: `Cattleya` (ID 1) và `Dendrobium` (ID 2) |  | *Pending Manual Run* | `evidence/sqlserver/SQL01_categories.png` |
| **SQL-02** | `SELECT * FROM dbo.orchids WHERE orchid_id = @id` (Sau TC05) | Row được insert, `category_id = 1` |  | *Pending Manual Run* | `evidence/sqlserver/SQL02_after_tc05.png` |
| **SQL-03** | `SELECT * FROM dbo.orchids WHERE orchid_id = @id` (Sau TC10) | Row được update, `category_id = 2` |  | *Pending Manual Run* | `evidence/sqlserver/SQL03_after_tc10.png` |
| **SQL-04** | `SELECT * FROM dbo.orchids WHERE orchid_id = @id` (Sau TC15) | Row không còn tồn tại trong table `orchids` (0 rows) |  | *Pending Manual Run* | `evidence/sqlserver/SQL04_after_tc15.png` |
