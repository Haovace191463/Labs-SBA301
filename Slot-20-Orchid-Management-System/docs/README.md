# Orchid House — Full-stack React + Spring Boot

## Nộp bài: dọn thư viện và tái lập project

Để giảm dung lượng source trước khi gửi, có thể xóa các thư mục được sinh ra trong lúc cài/build. Không xóa các file khai báo dependency như `frontend/package.json`, `frontend/package-lock.json` hoặc `backend/pom.xml`.

Chạy PowerShell tại thư mục gốc `slot20` để dọn:

```powershell
Remove-Item -Recurse -Force frontend\node_modules, frontend\dist, backend\target -ErrorAction SilentlyContinue
```

- `frontend/node_modules`: thư viện React/Vite/Axios, cài lại được từ package manifests.
- `frontend/dist`: frontend build output.
- `backend/target`: file build/classes của Maven; Maven sẽ tạo lại.
- Không xóa `frontend/package-lock.json`: file này khóa phiên bản npm dependencies để máy nhận bài có thể cài nhất quán. Không xóa `backend/pom.xml`.

Sau khi nhận/giải nén source, cài lại thư viện và build như sau. Cần kết nối internet ở lần tải dependencies đầu tiên.

**Frontend** — PowerShell tại thư mục gốc:

```powershell
cd frontend
npm ci
```

`npm ci` cài theo `package-lock.json` và phù hợp cho việc tái lập sạch. Nếu lockfile không có hoặc vừa được cập nhật có chủ đích, dùng `npm install` (hoặc `npm i`) để cài và cập nhật lockfile.

**Backend** — PowerShell tại thư mục gốc:

```powershell
cd backend
mvn clean package
```

Maven tải các dependency khai báo trong `pom.xml` vào Maven local repository (`.m2`) của máy nếu chưa có; chúng không nằm trong source project. Có thể dùng `mvn spring-boot:run` thay vì package jar khi chạy phát triển.

## Cấu trúc dự án

```text
slot20/
├── backend/                         Spring Boot REST API + JPA
│   ├── pom.xml
│   └── src/main/java/com/orchidhouse/
│       ├── config/                  CORS và dữ liệu mẫu local
│       ├── controller/              OrchidController, CategoryController
│       ├── dto/                     Request/response API
│       ├── exception/               Lỗi API thống nhất
│       ├── model/                   Orchid, Category
│       ├── repository/              Spring Data JPA
│       └── service/                 Nghiệp vụ
├── frontend/                        React + Vite SPA
│   ├── src/api/                     Axios client và orchid API
│   ├── src/components/              Danh sách và form hoa lan
│   ├── src/App.jsx
│   ├── .env.development             API URL local
│   └── .env.production              API URL sau reverse proxy
├── docs/                            Tài liệu và SQL schema
│   └── slot20_orchid.sql
└── docker-compose.yml               SQL Server Developer tùy chọn
```

## Yêu cầu

- Java 17 trở lên và Maven 3.9 trở lên.
- Node.js/npm tương thích với Vite 8.
- SQL Server đang chạy và truy cập được qua TCP/IP.
- Có thể dùng SQL Server cài trực tiếp hoặc container SQL Server trong Docker Compose.

## Chuẩn bị database

Chọn một trong hai cách sau.

### SQL Server cài độc lập (không Docker)

Đảm bảo SQL Server đang chạy, bật SQL Server Authentication (Mixed Mode), cho phép TCP/IP và lắng nghe cổng `1433`. Tạo/cấu hình login `sa` trên SQL Server; password dưới đây phải khớp với password thực tế của login đó.

| Thiết lập | Giá trị local |
|---|---|
| Server | `localhost,1433` |
| Authentication | SQL Server Authentication |
| Login | `sa` |
| Password | `12345678` |
| Database | `orchid_management` |

Mở `docs/slot20_orchid.sql` trong SSMS và chạy script. Script tạo database `orchid_management`, bảng `categories`, `orchids`, khóa ngoại và index nếu chúng chưa tồn tại. Schema này dành riêng cho project Slot 20; script không migration database/schema Lab 04 cũ.

Mật khẩu `12345678` chỉ là giá trị local theo cấu hình bài tập. Không dùng mật khẩu yếu này ở staging/production.

### SQL Server bằng Docker Compose (tùy chọn)

Chạy ở thư mục gốc project:

```powershell
docker compose up -d sqlserver
```

Compose sử dụng password mặc định `Your_strong_password123`. Chờ container khởi động, sau đó tạo database:

```powershell
docker exec orchid-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Your_strong_password123" -C -Q "CREATE DATABASE orchid_management"
```

Nếu đã đổi `DB_PASSWORD` khi chạy Compose, dùng cùng giá trị trong lệnh SQL và cấu hình backend. Mật khẩu mẫu chỉ dành cho local development.

## Chạy ứng dụng local

### 1. Chạy Spring Boot backend

Mở terminal PowerShell thứ nhất tại thư mục gốc:

```powershell
cd backend
$env:DB_URL="jdbc:sqlserver://localhost:1433;databaseName=orchid_management;encrypt=true;trustServerCertificate=true"
$env:DB_USERNAME="sa"
$env:DB_PASSWORD="12345678"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"
mvn spring-boot:run
```

Nếu dùng Docker Compose với password mặc định, đặt `$env:DB_PASSWORD="Your_strong_password123"` thay vì `12345678`.

Backend lắng nghe ở `http://localhost:8080`. Với cấu hình local, Hibernate cập nhật schema và thêm dữ liệu demo nếu database chưa có danh mục. Xác minh backend độc lập trước khi kiểm tra frontend:

- `http://localhost:8080/orchids/`
- `http://localhost:8080/categories/`

Hai URL trên có thể mở trực tiếp bằng browser hoặc gọi bằng Postman.

### 2. Chạy React/Vite frontend

Mở terminal PowerShell thứ hai tại thư mục gốc:

```powershell
cd frontend
npm ci
npm run dev
```

Nếu vừa cài dependencies theo phần tái lập ở đầu tài liệu thì bỏ qua `npm ci`. Vite hiển thị địa chỉ local; mặc định mở `http://localhost:5173`.

### 3. Kiểm tra trên browser

Xác nhận Orchid House hiển thị danh sách hoa lan. Thử tìm kiếm/lọc, xem chi tiết, thêm hoa lan, chỉnh sửa và tải lại trang để xác nhận dữ liệu được lưu. Có thể xóa một dòng thử nghiệm.

Mở DevTools → **Network** để kiểm tra request tới `http://localhost:8080/orchids/`, method, status, request/response JSON và CORS headers. Frontend `localhost:5173` và backend `localhost:8080` khác origin vì khác port; Postman không thực thi chính sách CORS của browser.

## API contract

| Method | Endpoint | Thành công | Nội dung |
|---|---|---:|---|
| GET | `/orchids/` | 200 | Danh sách hoa lan |
| GET | `/orchids/{id}` | 200 | Chi tiết; 404 nếu không tồn tại |
| POST | `/orchids/` | 201 | Tạo mới; 400 khi validation không đạt |
| PUT | `/orchids/{id}` | 200 | Cập nhật; 400/404 khi phù hợp |
| DELETE | `/orchids/{id}` | 204 | Xóa |
| GET | `/categories/` | 200 | Danh mục dùng trong form |

Request body cho POST/PUT:

```json
{
  "orchidName": "Hồ điệp trắng",
  "orchidDescription": "Mô tả hoa lan",
  "orchidUrl": "https://example.com/orchid.jpg",
  "price": 450000,
  "isNatural": true,
  "categoryId": 1
}
```

Lỗi API có dạng `{ "timestamp": "...", "status": 400, "message": "..." }`. Giao diện có loading, empty, error/retry; các thao tác tạo, sửa, xóa cập nhật dữ liệu UI sau khi API thành công.

## Cấu hình môi trường và CORS

- `frontend/.env.development` đặt `VITE_API_BASE_URL=http://localhost:8080` để browser gọi trực tiếp backend trong local.
- `frontend/.env.production` đặt base URL tương đối `/api`, dành cho reverse proxy/gateway route `/api/*` tới backend. Vite proxy local được khai báo trong `frontend/vite.config.js`.
- `VITE_*` được đưa vào client bundle, vì vậy chỉ dùng cho cấu hình public; không đặt password, API key bí mật hoặc token server-side.
- Backend local chỉ cho phép origin `http://localhost:5173` trên các endpoint cần thiết, giới hạn method/header và không bật credentials. Có thể đặt danh sách origin bằng `CORS_ALLOWED_ORIGINS`, phân tách bằng dấu phẩy.
- Với staging/production, đặt origin frontend chính xác, cung cấp database credentials qua secret manager và không dùng wildcard CORS. Profile `prod` yêu cầu biến môi trường DB/CORS và dùng schema validation. Với same-origin proxy, browser gọi `/api` cùng origin; gateway chịu trách nhiệm route tới backend.

## Tài liệu và kiểm thử

- SQL schema: `docs/slot20_orchid.sql`.
- PDF bài học: `docs/SBA301_Slot20_FullStack_SPA_React_SpringBoot_CORS.pdf`.
- Backend API tests: từ thư mục gốc chạy `mvn -f backend\pom.xml test`.
- Frontend production build: `cd frontend`, sau đó `npm run build`.
