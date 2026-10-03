# SBA301 Slot 10 — Student Reflection Worksheet

**Student Name:** Võ Anh Hào  
**Student ID:** CE191463  
**Course:** SBA301 (Integrate Single Page Application with Spring Boot)  
**Topic:** Chapter 09 — React Router & Single Page Application (SPA)  
**Date:** ____________________  

> **Lưu ý dành cho sinh viên (Student Note):**  
> Dưới đây là 8 câu hỏi phản ánh kiến thức trọng tâm của bài thực hành. Mỗi câu hỏi đã được cung cấp sẵn **Gợi ý & Khung trả lời (Hint & Framework)** để định hướng tư duy kỹ thuật. Sinh viên hãy dựa trên trải nghiệm thực tế khi phát triển và kiểm thử dự án Orchid Router SPA để tự viết câu trả lời hoàn chỉnh bằng ngôn từ và hiểu biết của mình vào phần `Student Answer`.

---

### Question 1: SPA so với MPA (Single Page Application vs Multi-Page Application)
**Câu hỏi:** Trình bày sự khác biệt cơ bản giữa kiến trúc Single Page Application (SPA) và Multi-Page Application (MPA) về cơ chế tải trang, quản lý trạng thái trong bộ nhớ (state lifecycle) và trải nghiệm người dùng. Tại sao SPA lại loại bỏ việc tải lại toàn bộ tài liệu (Full Document Reload)?

*Gợi ý & Khung trả lời:*
- **Cơ chế tải trang:** MPA gửi HTTP GET request yêu cầu server trả về file HTML mới mỗi khi click link; SPA chỉ tải `index.html` và bundle JS một lần đầu tiên, các thao tác chuyển trang tiếp theo diễn ra hoàn toàn ở client-side thông qua Virtual DOM.
- **State lifecycle:** MPA giải phóng toàn bộ bộ nhớ và state JS khi trang mới tải; SPA duy trì in-memory state xuyên suốt quá trình điều hướng.
- **Trải nghiệm:** SPA chuyển đổi màn hình tức thì, mượt mà, không có hiện tượng chớp nháy trắng màn hình (flicker).

*Student Answer:*
```text
[Sinh viên tự viết câu trả lời chi tiết tại đây]



```

---

### Question 2: `BrowserRouter`, `Routes` và `Route`
**Câu hỏi:** Vai trò và mối quan hệ giữa 3 component cốt lõi `BrowserRouter`, `Routes` và `Route` trong ứng dụng React Router là gì? Tại sao `BrowserRouter` chỉ nên được khai báo một lần duy nhất tại cấp cao nhất của ứng dụng (`App.jsx` hoặc `main.jsx`)?

*Gợi ý & Khung trả lời:*
- **BrowserRouter:** Đóng vai trò Router Context Provider, kết nối ứng dụng với HTML5 History API (`pushState`, `replaceState`, sự kiện `popstate`).
- **Routes:** Container chứa các route, chịu trách nhiệm duyệt qua các `Route` con và tìm ra nhánh khớp nhất (best match) với URL hiện tại.
- **Route:** Khai báo một quy tắc ánh xạ cụ thể giữa đường dẫn (`path`) và component giao diện tương ứng (`element`).
- **Lý do khai báo 1 lần:** Việc lồng nhiều `BrowserRouter` sẽ tạo ra các history context độc lập, làm mất tính đồng bộ của URL và ngăn cản các hook định tuyến hoạt động chính xác.

*Student Answer:*
```text
[Sinh viên tự viết câu trả lời chi tiết tại đây]



```

---

### Question 3: `Link` và `NavLink`
**Câu hỏi:** Khi nào nên sử dụng `<Link>` và khi nào nên sử dụng `<NavLink>`? Giải thích cơ chế của hàm callback `className={({ isActive }) => ...}` và lý do vì sao route gốc (`/`) cần thuộc tính `end` trong `<NavLink>`?

*Gợi ý & Khung trả lời:*
- **Sự khác biệt:** `<Link>` dùng cho điều hướng thông thường (nút bấm, card sản phẩm, breadcrumb, footer link); `<NavLink>` dùng cho các thanh điều hướng (Navbar, sidebar) cần thể hiện trạng thái đang xem.
- **Thuộc tính `isActive`:** React Router tự động truyền boolean `isActive` vào hàm callback của `className` hoặc `style` để lập trình viên áp dụng class CSS highlight (như `.active-nav`).
- **Thuộc tính `end`:** Do URL `/` là tiền tố của mọi đường dẫn con (`/orchids`, `/about`), nếu không có `end`, route `/` sẽ luôn khớp từng phần (partial match) và link "Home" sẽ luôn bị active ngay cả khi đang ở trang khác.

*Student Answer:*
```text
[Sinh viên tự viết câu trả lời chi tiết tại đây]



```

---

### Question 4: Dynamic Route và `useParams`
**Câu hỏi:** Trong kịch bản xem chi tiết hoa lan (`/orchids/:id`), cơ chế Dynamic Route hoạt động như thế nào? Hook `useParams()` trả về kiểu dữ liệu gì và vì sao tên biến khi destructure phải khớp chính xác từng ký tự với khai báo trong Route?

*Gợi ý & Khung trả lời:*
- **Cơ chế:** Ký tự `:id` là một tham số động (placeholder/token). Bất kỳ chuỗi nào nằm ở vị trí đó trong URL đều được xem là giá trị của param.
- **useParams():** Trả về một JavaScript object chứa các cặp key-value đại diện cho các param trên URL (ví dụ `{ id: "phalaenopsis-amabilis" }`).
- **Khớp tên biến:** Nếu khai báo `<Route path="orchids/:id" ... />` mà destructure `const { orchidId } = useParams()`, biến `orchidId` sẽ có giá trị `undefined`, dẫn đến hàm tìm kiếm `getOrchidById(undefined)` trả về null và kích hoạt màn hình lỗi.

*Student Answer:*
```text
[Sinh viên tự viết câu trả lời chi tiết tại đây]



```

---

### Question 5: Query Parameters và `useSearchParams`
**Câu hỏi:** Tại sao bộ lọc danh mục hoa lan lại được thiết kế bằng Query Parameters (`?category=...`) kết hợp với hook `useSearchParams` thay vì chỉ dùng `useState` cục bộ? Lợi ích của URL query string trong việc chia sẻ (shareability) và lưu dấu trang (bookmarking) là gì?

*Gợi ý & Khung trả lời:*
- **Hạn chế của `useState` thuần:** Trạng thái lọc chỉ tồn tại tạm thời trong RAM của component. Khi người dùng nhấn F5 (Refresh) hoặc copy đường dẫn gửi cho bạn bè, trang sẽ trở về trạng thái ban đầu.
- **Ưu điểm của `useSearchParams`:** Đồng bộ trạng thái lọc trực tiếp lên URL. Người dùng có thể bookmark link `http://localhost:5173/orchids?category=Phalaenopsis` hoặc gửi qua tin nhắn; khi mở lại, bộ lọc tự động áp dụng chính xác. Ngoài ra còn hỗ trợ điều hướng lùi/tiến với nút Back/Forward của trình duyệt.

*Student Answer:*
```text
[Sinh viên tự viết câu trả lời chi tiết tại đây]



```

---

### Question 6: `useNavigate` và Browser History
**Câu hỏi:** Phân biệt sự khác nhau giữa điều hướng khai báo (declarative với `<Link>`) và điều hướng mệnh lệnh (imperative với `useNavigate`). Nêu rõ sự khác biệt giữa `navigate('/path')` (push) và `navigate('/path', { replace: true })`, đồng thời chỉ ra một tình huống thực tế bắt buộc nên dùng `replace: true`?

*Gợi ý & Khung trả lời:*
- **Declarative vs Imperative:** `<Link>` gắn trực tiếp vào JSX cho thao tác click của người dùng; `useNavigate()` là hàm JavaScript được gọi trong code xử lý sự kiện (event handler) sau khi hoàn tất một logic (như submit form, xác thực, hết giờ).
- **Push vs Replace:** `push` (mặc định) thêm một trang mới vào ngăn xếp lịch sử trình duyệt; `replace: true` ghi đè lên trang hiện tại trong ngăn xếp, khiến trang cũ không còn trong lịch sử.
- **Tình huống nên dùng replace:** Redirect từ đường dẫn cũ `/home` về `/` (để tránh người dùng bấm Back bị lặp lại vòng chuyển hướng); chuyển hướng sau khi hoàn tất giao dịch thanh toán hoặc sau khi đăng xuất/đăng nhập.

*Student Answer:*
```text
[Sinh viên tự viết câu trả lời chi tiết tại đây]



```

---

### Question 7: Nested Routes và `Outlet`
**Câu hỏi:** Trình bày lợi ích kiến trúc của Nested Routes trong giao diện Dashboard. Component `<Outlet />` hoạt động như thế nào trong `DashboardLayout` và điều gì sẽ xảy ra nếu lập trình viên quên không đặt `<Outlet />` trong layout cha?

*Gợi ý & Khung trả lời:*
- **Lợi ích:** Cho phép xây dựng giao diện đa cấp (Master-Detail, Dashboard). Khung layout cha (header, breadcrumbs, sidebar) được giữ nguyên và duy trì trạng thái; khi người dùng chuyển tab (Overview, Favorites, Profile), chỉ có vùng nội dung con được thay đổi mà không re-render toàn bộ layout.
- **Cơ chế `<Outlet />`:** Hoạt động như một vị trí đánh dấu (placeholder/slot) trong cây DOM ảo của component cha để React Router nhúng component của route con đang khớp vào đó.
- **Hậu quả nếu quên `<Outlet />`:** URL trên thanh địa chỉ vẫn đổi nhưng vùng nội dung con bị trống hoàn toàn (như đã thực hành trong bài BUG-01).

*Student Answer:*
```text
[Sinh viên tự viết câu trả lời chi tiết tại đây]



```

---

### Question 8: Direct URL / Deep Link và Wildcard Route 404
**Câu hỏi:** Phân biệt rõ sự khác nhau giữa lỗi không tìm thấy tài nguyên (Resource Not Found - ví dụ `/orchids/999999`) và lỗi đường dẫn chưa khai báo (Wildcard Route 404 - ví dụ `/unknown-route`). Tại sao khi triển khai SPA lên máy chủ web thực tế (Nginx/Apache), nếu không cấu hình rewrite URL thì khi truy cập trực tiếp deep link sẽ bị lỗi 404 của web server?

*Gợi ý & Khung trả lời:*
- **Resource Not Found vs Wildcard 404:**
  - `/orchids/999999`: Khớp thành công route pattern `/orchids/:id`, component `OrchidDetailPage` được mount, nhưng hàm tìm kiếm không thấy bản ghi trong dataset nên hiển thị thông báo nghiệp vụ.
  - `/unknown-route`: Hoàn toàn không khớp với bất kỳ pattern nào trong bảng định tuyến, được bắt bởi route `<Route path="*" element={<NotFoundPage />} />`.
- **Cấu hình Web Server cho Deep Link:** Máy chủ web truyền thống tìm kiếm file vật lý trên đĩa cứng tương ứng với đường dẫn URL. Vì SPA chỉ có duy nhất một file HTML vật lý là `dist/index.html` (các route chỉ là ảo do client JS xử lý), nên máy chủ web sẽ trả về HTTP 404 Not Found của server nếu không được cấu hình rewrite (ví dụ `try_files $uri $uri/ /index.html;` trong Nginx).

*Student Answer:*
```text
[Sinh viên tự viết câu trả lời chi tiết tại đây]



```
