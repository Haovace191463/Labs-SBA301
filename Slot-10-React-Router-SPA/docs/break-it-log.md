# Orchid Router SPA — Break-It Diagnostic Log

**Student Name:** Võ Anh Hào  
**Student ID:** CE191463  
**Subject:** SBA301 — Slot 10 (React Router & Single Page Application)  
**Project:** Orchid Router SPA  

> **Hướng dẫn dành cho sinh viên (Instructions for Student):**  
> Dưới đây là các bài thực hành chẩn đoán và khắc phục lỗi định tuyến (Routing Diagnostics). Mỗi bài tập giúp bạn trải nghiệm trực tiếp các lỗi phổ biến nhất trong thực tế khi làm việc với React Router.  
> **Quy tắc bắt buộc:**
> 1. Chỉ thực hiện từng bài một trên máy local của bạn.
> 2. Ghi nhận hiện tượng quan sát được vào mục **Student Notes**.
> 3. Khôi phục lại mã nguồn hoạt động bình thường ngay sau khi hoàn thành mỗi bài kiểm tra.
> 4. **Tuyệt đối không để mã nguồn bị lỗi khi nộp bài.** Hiện tại toàn bộ mã nguồn trong `src/` đang ở trạng thái chuẩn, sạch lỗi lint và build thành công.

---

## Bug 01: Bỏ `<Outlet />` trong Layout lồng nhau (Missing `<Outlet />` in Nested Layout)

### 1. Bug ID & Mục tiêu học tập
- **Bug ID:** `BUG-01`
- **Mục tiêu học tập:** Hiểu rõ cơ chế hoạt động của Nested Routes và vai trò sống còn của component `<Outlet />` trong việc làm vị trí neo (mounting slot) cho các route con trong layout cha.

### 2. File và vị trí có thể chỉnh sửa
- **Tập tin:** `src/layouts/DashboardLayout.jsx`
- **Vị trí:** Khoảng dòng 89–93

```jsx
{/* Mã nguồn gốc đang hoạt động */}
<Col lg={9} md={8}>
  <div className="dashboard-content-area">
    <Outlet />
  </div>
</Col>
```

### 3. Cách cố ý tạo lỗi
Mở file `src/layouts/DashboardLayout.jsx`, tạm thời comment hoặc xóa component `<Outlet />`, thay bằng một đoạn text placeholder tĩnh:

```jsx
{/* Cố ý tạo lỗi: Comment bỏ Outlet */}
<Col lg={9} md={8}>
  <div className="dashboard-content-area">
    {/* <Outlet /> */}
    <div className="p-4 bg-light text-muted">Placeholder (Outlet removed)</div>
  </div>
</Col>
```

### 4. Triệu chứng dự kiến
- Khi truy cập `/dashboard`, `/dashboard/favorites`, hoặc `/dashboard/profile`, URL trên thanh địa chỉ vẫn thay đổi và các menu con trên sidebar vẫn highlight trạng thái active.
- Tuy nhiên, vùng nội dung chính bên phải chỉ hiển thị đoạn text placeholder tĩnh. Toàn bộ các component con (`DashboardHomePage`, `FavoritesPage`, `ProfilePage`) **hoàn toàn không được hiển thị**.

### 5. Cách kiểm tra
1. Thực hiện sửa đổi trên và lưu file `DashboardLayout.jsx`.
2. Mở trình duyệt đến `http://localhost:5173/dashboard`.
3. Click liên kết "Favorites" trên menu sidebar của Dashboard.
4. Quan sát: URL đổi thành `/dashboard/favorites`, nhưng danh sách hoa lan yêu thích không xuất hiện.

### 6. Nguyên nhân
Trong React Router, khi khai báo các route con bên trong một route cha (ví dụ `<Route path="dashboard" element={<DashboardLayout />}>`), component layout cha đóng vai trò là một khung giao diện bao bọc (wrapper shell). React Router cần một vị trí được chỉ định cụ thể trong cây DOM ảo của cha để chèn các component con tương ứng với route đang khớp. Vị trí đó chính là `<Outlet />`. Nếu thiếu `<Outlet />`, React Router không có nơi để mount component con vào DOM.

### 7. Cách sửa và khôi phục code
Khôi phục lại `<Outlet />` bên trong `src/layouts/DashboardLayout.jsx`:

```jsx
import { Outlet, NavLink } from 'react-router-dom';
// ...
<Col lg={9} md={8}>
  <div className="dashboard-content-area">
    <Outlet />
  </div>
</Col>
```
Lưu file và kiểm tra lại trang `/dashboard/favorites` để đảm bảo danh sách yêu thích hiển thị bình thường.

### 8. Student Notes
- **Trạng thái kiểm tra:** [ ] Đã thực hiện trên trình duyệt
- **Hiện tượng thực tế quan sát được:**  
  ```text
  [Fill after testing: Mô tả giao diện khi không có Outlet]
  ```
- **Thời gian xác minh:** `____/____/2026`

---

## Bug 02: Đọc sai Route Parameter trong Trang chi tiết (Parameter Name Mismatch in `useParams`)

### 1. Bug ID & Mục tiêu học tập
- **Bug ID:** `BUG-02`
- **Mục tiêu học tập:** Hiểu mối quan hệ chặt chẽ giữa tên token định danh khai báo trong `<Route path="..." />` và tên thuộc tính trả về từ hook `useParams()`.

### 2. File và vị trí có thể chỉnh sửa
- **Tập tin:** `src/pages/OrchidDetailPage.jsx`
- **Vị trí:** Dòng 8
- **Đối chiếu với khai báo tại `src/routes/AppRoutes.jsx` (dòng 34):**
  ```jsx
  <Route path="orchids/:id" element={<OrchidDetailPage />} />
  ```

### 3. Cách cố ý tạo lỗi
Mở file `src/pages/OrchidDetailPage.jsx`, sửa tên biến khi destructuring từ `useParams()` thành một tên khác (ví dụ `orchidId` thay vì `id`):

```jsx
{/* Mã nguồn gốc */}
const { id } = useParams();
const orchid = getOrchidById(id);

{/* Cố ý tạo lỗi: Destructure sai tên param */}
const { orchidId } = useParams(); // Sai tên token! Trong AppRoutes khai báo là :id
const orchid = getOrchidById(orchidId);
```

### 4. Triệu chứng dự kiến
- Khi người dùng click vào bất kỳ hoa lan hợp lệ nào từ danh mục (ví dụ `/orchids/phalaenopsis-amabilis`), trang web bất ngờ hiển thị cảnh báo: **"Resource Not Found: Orchid undefined"**, mặc dù giống lan đó chắc chắn có tồn tại trong dữ liệu.

### 5. Cách kiểm tra
1. Lưu file `OrchidDetailPage.jsx` với đoạn code bị sửa sai tên param.
2. Truy cập `http://localhost:5173/orchids`.
3. Click "View Details →" tại hoa lan "Phalaenopsis Amabilis".
4. Quan sát tiêu đề thông báo lỗi: `Resource Not Found: Orchid "undefined"`.

### 6. Nguyên nhân
Hook `useParams()` trả về một JavaScript object chứa các cặp key-value được trích xuất từ URL. Các key này **phải khớp chính xác từng ký tự** với token khai báo sau dấu hai chấm `:` trong thuộc tính `path` của Route.  
Vì trong `AppRoutes.jsx` ta khai báo `:id`, nên object trả về là `{ id: "phalaenopsis-amabilis" }`. Khi destructuring `const { orchidId } = useParams()`, biến `orchidId` không tồn tại trong object nên nhận giá trị `undefined`. Hàm `getOrchidById(undefined)` trả về `null`, kích hoạt nhánh hiển thị không tìm thấy tài nguyên.

### 7. Cách sửa và khôi phục code
Sửa lại biến destructure cho khớp với `:id`:

```jsx
const { id } = useParams();
```
Lưu file và kiểm tra lại đường dẫn `/orchids/phalaenopsis-amabilis`. Xác nhận thông tin chi tiết của giống lan hiển thị đầy đủ trở lại.

### 8. Student Notes
- **Trạng thái kiểm tra:** [ ] Đã thực hiện trên trình duyệt
- **Hiện tượng thực tế quan sát được:**  
  ```text
  [Fill after testing: Ghi nhận giá trị undefined hiển thị trên giao diện]
  ```
- **Thời gian xác minh:** `____/____/2026`

---

## Bug 03: Dùng thẻ HTML `<a>` thay thế `<Link>` / `<NavLink>` (Full Document Reload Bug)

### 1. Bug ID & Mục tiêu học tập
- **Bug ID:** `BUG-03`
- **Mục tiêu học tập:** Phân biệt rõ sự khác nhau cơ bản giữa cơ chế điều hướng client-side SPA (sử dụng HTML5 History API) và điều hướng MPA truyền thống bằng thẻ `<a>` (kích hoạt full document reload).

### 2. File và vị trí có thể chỉnh sửa
- **Tập tin:** `src/components/AppNavbar.jsx`
- **Vị trí:** Khoảng dòng 44–52 (liên kết đến trang About)

```jsx
{/* Mã nguồn gốc dùng NavLink */}
<Nav.Link
  as={NavLink}
  to="/about"
  className={({ isActive }) =>
    `nav-link-custom ${isActive ? 'active-nav' : ''}`
  }
>
  About
</Nav.Link>
```

### 3. Cách cố ý tạo lỗi
Mở file `src/components/AppNavbar.jsx`, tạm thời thay thế mục Nav.Link của trang About bằng một thẻ HTML `<a>` tiêu chuẩn:

```jsx
{/* Cố ý tạo lỗi: Dùng thẻ <a> truyền thống */}
<a href="/about" className="nav-link-custom me-2">
  About (MPA Reload Test)
</a>
```

### 4. Triệu chứng dự kiến
- Khi click vào liên kết "About", trình duyệt xuất hiện biểu tượng xoay tải lại trang (reload spinner trên tab trình duyệt), màn hình có thể nháy trắng trong tích tắc.
- Toàn bộ trạng thái JavaScript trong bộ nhớ (in-memory state, biến tạm, form chưa lưu) bị giải phóng và khởi tạo lại từ đầu.

### 5. Cách kiểm tra
1. Mở trình duyệt tại `http://localhost:5173/`.
2. Mở DevTools (<kbd>F12</kbd>), chọn tab **Network**, bật bộ lọc **Doc** và tick chọn **Preserve log**.
3. Click vào liên kết "About (MPA Reload Test)".
4. Quan sát Network tab: xuất hiện một dòng request HTTP GET mới có `Type: document` với tên file `about`.
5. So sánh với khi click các menu khác (Orchids, Dashboard): không hề có request `Type: document` nào được tạo ra.

### 6. Nguyên nhân
- Thẻ HTML `<a href="...">` tiêu chuẩn kích hoạt hành vi mặc định của trình duyệt: gửi HTTP GET request lên máy chủ web để yêu cầu tài nguyên trang mới, hủy bỏ vòng đời trang hiện tại và tải lại toàn bộ mã HTML/CSS/JS.
- Ngược lại, `<Link>` và `<NavLink>` của React Router chặn sự kiện click mặc định (`event.preventDefault()`) và gọi hàm `window.history.pushState()`, cập nhật URL trên thanh địa chỉ mà không yêu cầu server gửi lại HTML, sau đó React cập nhật Virtual DOM tại chỗ.

### 7. Cách sửa và khôi phục code
Khôi phục lại `<Nav.Link as={NavLink} to="/about" ...>` trong `src/components/AppNavbar.jsx`.  
Lưu file và click lại liên kết About trong khi quan sát tab Network để xác nhận không còn request document nào.

### 8. Student Notes
- **Trạng thái kiểm tra:** [ ] Đã thực hiện trên trình duyệt
- **Có xuất hiện request `Type: document` khi click thẻ `<a>` không?:** [ ] Có  [ ] Không
- **Hiện tượng thực tế quan sát được:**  
  ```text
  [Fill after testing: Mô tả sự khác nhau khi quan sát Network tab]
  ```
- **Thời gian xác minh:** `____/____/2026`

---

## Bug 04: Nhầm lẫn giữa Resource Not Found và Wildcard Route 404 (Route Pattern Matching vs Data Lookup)

### 1. Bug ID & Mục tiêu học tập
- **Bug ID:** `BUG-04`
- **Mục tiêu học tập:** Phân biệt rõ ranh giới giữa việc khớp mẫu đường dẫn URL (Routing Pattern Matching) và việc truy vấn thực thể dữ liệu (Data Entity Lookup).

### 2. File và vị trí có thể chỉnh sửa
- **Tập tin:** `src/pages/OrchidDetailPage.jsx` kết hợp với `src/routes/AppRoutes.jsx`.

### 3. Cách nhận biết & kịch bản kiểm tra
Nhiều sinh viên nhầm lẫn rằng khi người dùng truy cập một ID hoa lan không tồn tại như `/orchids/999999`, hệ thống sẽ tự động rơi vào route wildcard `*` (`NotFoundPage`).

1. Nhập `http://localhost:5173/orchids/999999` trên thanh địa chỉ.
2. Nhập `http://localhost:5173/san-pham-khong-ton-tai` trên thanh địa chỉ.
3. Quan sát và so sánh component được render ở 2 trường hợp.

### 4. Triệu chứng quan sát
- Tại `/orchids/999999`: Trang hiển thị giao diện chi tiết của `OrchidDetailPage` với khung thông báo màu đỏ: "Resource Not Found: Orchid 999999", có nút "← Return to Orchid List".
- Tại `/san-pham-khong-ton-tai`: Trang hiển thị `NotFoundPage` với số "404", thông báo "Page Not Found", và các nút "Return Home", "Browse Orchids".

### 5. Nguyên nhân
- Đường dẫn `/orchids/999999` **khớp hoàn toàn** với route pattern `<Route path="orchids/:id" element={<OrchidDetailPage />} />` vì chuỗi `"999999"` là một giá trị hợp lệ cho biến `:id`. React Router coi đây là route hợp lệ và mount `OrchidDetailPage`. Lỗi xảy ra bên trong logic component khi `getOrchidById("999999")` không tìm thấy dữ liệu.
- Đường dẫn `/san-pham-khong-ton-tai` **không khớp** với bất kỳ pattern nào trong bảng định tuyến, do đó mới được chuyển tiếp tới route wildcard `<Route path="*" element={<NotFoundPage />} />`.

### 6. Cách xử lý chuẩn
Luôn xử lý kiểm tra `if (!orchid)` bên trong component trang chi tiết để hiển thị giao diện báo lỗi tài nguyên thân thiện, thay vì để ứng dụng bị crash do cố gắng truy cập thuộc tính của `null`/`undefined`.

### 7. Student Notes
- **Trạng thái kiểm tra:** [ ] Đã thực hiện trên trình duyệt
- **Ghi nhận sự khác biệt:**  
  ```text
  [Fill after testing: Phân biệt rõ ràng giữa 2 loại màn hình lỗi]
  ```
- **Thời gian xác minh:** `____/____/2026`

---

## 4. Bảng tổng hợp trạng thái thực hành chẩn đoán lỗi

| Bug ID | Chủ đề kiểm tra | Tập tin liên quan | Đã thực hành trên trình duyệt | Đã khôi phục code sạch |
| :---: | :--- | :--- | :---: | :---: |
| **BUG-01** | Bỏ `<Outlet />` trong layout lồng nhau | `src/layouts/DashboardLayout.jsx` | [ ] Chưa / [ ] Rồi | [x] Đã khôi phục |
| **BUG-02** | Đọc sai tên route param trong `useParams()` | `src/pages/OrchidDetailPage.jsx` | [ ] Chưa / [ ] Rồi | [x] Đã khôi phục |
| **BUG-03** | Thẻ `<a>` gây tải lại document (so sánh với Link) | `src/components/AppNavbar.jsx` | [ ] Chưa / [ ] Rồi | [x] Đã khôi phục |
| **BUG-04** | Phân biệt Resource Not Found và Wildcard 404 | `src/pages/OrchidDetailPage.jsx` | [ ] Chưa / [ ] Rồi | [x] Đã khôi phục |
