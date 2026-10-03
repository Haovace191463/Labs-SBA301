# Orchid Router SPA — Navigation & History Trace Worksheet

**Student Name:** Võ Anh Hào  
**Student ID:** CE191463  
**Course:** SBA301 (Slot 10: React Router & Single Page Application)  
**Date:** ____________________  

---

## 1. Hướng dẫn thực hiện (Instructions)

Tài liệu này dùng để theo dõi và ghi chép chi tiết hành vi điều hướng của ứng dụng Single Page Application (SPA), giúp sinh viên hiểu rõ cơ chế định tuyến client-side, cách trích xuất tham số URL, hoạt động của ngăn xếp lịch sử trình duyệt (history stack) và việc ngăn chặn tải lại toàn bộ tài liệu (Full Document Reload).

### Các bước chuẩn bị trước khi điền:
1. Chạy ứng dụng bằng lệnh: `npm run dev` tại thư mục dự án.
2. Mở trình duyệt (Chrome/Edge) tại địa chỉ: `http://localhost:5173/`.
3. Mở Developer Tools (<kbd>F12</kbd> hoặc <kbd>Ctrl + Shift + I</kbd>).
4. Chuyển sang tab **Network**:
   - Chọn bộ lọc **Doc** (Document).
   - Đánh dấu tick chọn **Preserve log** (để giữ lại lịch sử request khi điều hướng).
5. Thực hiện lần lượt từng kịch bản trong bảng dưới đây.
6. Quan sát thanh địa chỉ (Address Bar), Network tab và giao diện hiển thị để điền vào các ô có ghi `[Fill after testing]`.

---

## 2. Bảng theo dõi điều hướng (Navigation Trace Worksheet)

| Starting URL | User Action | Destination URL | Route Matched | Component Rendered | URL Parameters / Query Parameters | Full Document Reload? | Observation |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| *(Browser Launch)* | Nhập `http://localhost:5173/` vào thanh địa chỉ và nhấn Enter | `/` | `<Route path="/" element={<MainLayout />}>`<br>└ `<Route index element={<HomePage />} />` | `MainLayout` + `HomePage` | Không có | Yes *(Initial GET for index.html)* | Tải document lần đầu tiên khi mở ứng dụng SPA. Bundle JS & CSS được nạp vào bộ nhớ trình duyệt. |
| `/` | Click liên kết "Orchids" trên Navbar | `/orchids` | `<Route path="orchids" element={<OrchidsPage />} />` | `MainLayout` + `OrchidsPage` | Không có | [Fill after testing] | [Fill after testing: Quan sát Network tab xem có request Doc không, class `.active-nav` có chuyển sang Orchids không] |
| `/orchids` | Click nút lọc danh mục "Vanda" | `/orchids?category=Vanda` | `<Route path="orchids" element={<OrchidsPage />} />` | `MainLayout` + `OrchidsPage` *(danh sách đã lọc)* | Query Parameter:<br>`category = "Vanda"` *(đọc qua `useSearchParams`)* | [Fill after testing] | [Fill after testing: Quan sát URL query string, số lượng card hiển thị có khớp với giống lan Vanda không] |
| `/orchids` | Click "View Details →" tại hoa lan "Phalaenopsis Amabilis" | `/orchids/phalaenopsis-amabilis` | `<Route path="orchids/:id" element={<OrchidDetailPage />} />` | `MainLayout` + `OrchidDetailPage` | Path Parameter:<br>`id = "phalaenopsis-amabilis"` *(đọc qua `useParams`)* | [Fill after testing] | [Fill after testing: Quan sát ảnh chi tiết, bảng thông số (watering, light), care level badge và breadcrumb] |
| `/orchids/phalaenopsis-amabilis` | Nhập trực tiếp `/orchids/999999` trên thanh địa chỉ và nhấn Enter | `/orchids/999999` | `<Route path="orchids/:id" element={<OrchidDetailPage />} />` | `MainLayout` + `OrchidDetailPage` *(View Resource Not Found)* | Path Parameter:<br>`id = "999999"` | [Fill after testing] | [Fill after testing: Route khớp `:id` nhưng dữ liệu null -> hiển thị cảnh báo "Resource Not Found: Orchid 999999", app không crash] |
| `/orchids/999999` | Nhập `/home` trên thanh địa chỉ và nhấn Enter | `/` *(Redirected)* | `<Route path="home" element={<Navigate to="/" replace />} />` | `MainLayout` + `HomePage` | Không có | [Fill after testing] | [Fill after testing: URL tự động đổi từ `/home` thành `/` mà không tạo thêm bước thừa trong history stack] |
| `/` | Click "Dashboard" trên Navbar | `/dashboard` | `<Route path="dashboard" element={<DashboardLayout />}>`<br>└ `<Route index element={<DashboardHomePage />} />` | `MainLayout` + `DashboardLayout` + `<Outlet />` (`DashboardHomePage`) | Không có | [Fill after testing] | [Fill after testing: Khung DashboardLayout (tiêu đề, sidebar) hiển thị; index view thống kê số lượng xuất hiện trong Outlet] |
| `/dashboard` | Click menu "Favorites" trên sidebar của Dashboard | `/dashboard/favorites` | `<Route path="dashboard" element={<DashboardLayout />}>`<br>└ `<Route path="favorites" element={<FavoritesPage />} />` | `MainLayout` + `DashboardLayout` + `<Outlet />` (`FavoritesPage`) | Không có | [Fill after testing] | [Fill after testing: Sidebar không bị reload; chỉ có nội dung bên trong `<Outlet />` thay đổi sang danh sách Favorites] |
| Any page | Nhập URL không tồn tại `/unknown-abc` trên thanh địa chỉ và nhấn Enter | `/unknown-abc` | `<Route path="*" element={<NotFoundPage />} />` | `MainLayout` + `NotFoundPage` | Không có | [Fill after testing] | [Fill after testing: Wildcard 404 bắt URL không khai báo, hiển thị 404 Page Not Found và pathname `/unknown-abc` qua `useLocation`]|
| `/orchids/phalaenopsis-amabilis` *(sau chuỗi điều hướng `/` → `/orchids` → chi tiết)* | Nhấn nút Back trên trình duyệt 2 lần liên tiếp, sau đó nhấn Forward 2 lần | Lùi về `/orchids`, rồi về `/`; Tiến lại `/orchids`, rồi `/orchids/phalaenopsis-amabilis` | Các route tương ứng trong routing tree | Các component tương ứng được khôi phục | Tự động cập nhật theo trạng thái URL của từng bước lịch sử | [Fill after testing] | [Fill after testing: Quan sát chuyển đổi màn hình mượt mà qua sự kiện `popstate`, không tải lại trang] |

---

## 3. Câu hỏi tổng kết sau khi kiểm tra (Student Verification Questions)

1. **Khi click các liên kết nội bộ trong ứng dụng (sử dụng `<Link>` hoặc `<NavLink>`), Network tab của DevTools có ghi nhận thêm bất kỳ request nào có `Type: document` không? Tại sao?**  
   *Trả lời của sinh viên:*  
   ```text
   [Fill after testing]
   ```

2. **So sánh sự khác biệt bản chất giữa kịch bản `/unknown-abc` (Wildcard Route 404) và kịch bản `/orchids/999999` (Invalid Resource ID)?**  
   *Trả lời của sinh viên:*  
   ```text
   [Fill after testing]
   ```

3. **Khi chuyển đổi giữa `/dashboard` và `/dashboard/favorites`, thanh sidebar của `DashboardLayout` có bị khởi tạo lại (unmounted/remounted) không? Cơ chế `<Outlet />` đóng vai trò gì ở đây?**  
   *Trả lời của sinh viên:*  
   ```text
   [Fill after testing]
   ```

4. **Khi nhập `/home` vào thanh địa chỉ, điều gì xảy ra trong Address Bar và tại sao lại dùng `replace` trong `<Navigate to="/" replace />`?**  
   *Trả lời của sinh viên:*  
   ```text
   [Fill after testing]
   ```
