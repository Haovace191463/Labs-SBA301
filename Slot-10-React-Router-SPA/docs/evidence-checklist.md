# SBA301 Slot 10 — Evidence Checklist & Artifact Log

**Student Name:** Võ Anh Hào  
**Student ID:** CE191463  
**Course:** SBA301 (Integrate Single Page Application with Spring Boot)  
**Topic:** Chapter 09 — React Router & Single Page Application (SPA)  
**Project:** Orchid Router SPA  

> **Lưu ý quan trọng về tính trung thực học thuật:**  
> - Toàn bộ các ảnh chụp màn hình bằng chứng (evidence) phải do chính sinh viên trực tiếp thao tác trên trình duyệt và lưu vào thư mục `evidence/`.
> - **Hiện trạng thư mục `evidence/`:** Chưa có tệp ảnh nào (chỉ có `.gitkeep`). Do đó, toàn bộ các mục bằng chứng dưới đây được khởi tạo với trạng thái **`Not captured`**.
> - Không tạo ảnh chụp màn hình giả hoặc đánh dấu hoàn thành trước khi sinh viên thực sự chụp và lưu ảnh vào thư mục.

---

## 1. Danh sách bằng chứng giao diện & chức năng (Screenshots Checklist)

| Evidence ID | Tên tệp ảnh đề xuất | URL / Vị trí cần mở | Nội dung cần chụp | Trạng thái ban đầu | Ghi chú kết hợp (nếu có) |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **E01** | `evidence/E01_dev_server_running.png` | Cửa sổ Terminal / PowerShell | Terminal chạy lệnh `npm run dev` hiển thị server Vite đang hoạt động tại `http://localhost:5173/`. | **Not captured** | Chụp rõ cổng port và trạng thái sẵn sàng của Vite. |
| **E02** | `evidence/E02_initial_home_screen.png` | `http://localhost:5173/` | Giao diện trang chủ ban đầu: Hero banner giới thiệu ứng dụng, thẻ kiến trúc SPA và danh sách lan tiêu biểu. | **Not captured** | Có thể chụp toàn màn hình trang Home. |
| **E03** | `evidence/E03_navbar_active_home.png` | `http://localhost:5173/` | Thanh điều hướng (Navbar) trên cùng với liên kết "Home" được áp dụng class active (`.active-nav`). | **Not captured** | Có thể kết hợp chụp chung với E02 nếu thấy rõ thanh Navbar. |
| **E04** | `evidence/E04_orchids_catalog_view.png` | `http://localhost:5173/orchids` | Danh mục hoa lan đầy đủ: Grid hiển thị các card hoa lan có ảnh, danh mục, thông tin cơ bản và nút chi tiết. | **Not captured** | Đảm bảo thấy rõ URL `/orchids` trên thanh địa chỉ. |
| **E05** | `evidence/E05_query_filter_phalaenopsis.png` | `http://localhost:5173/orchids?category=Phalaenopsis` | Giao diện đã lọc: Thanh địa chỉ có query param `?category=Phalaenopsis`, nút bấm lọc được highlight, danh sách chỉ hiển thị 3 hoa lan chi Hồ điệp. | **Not captured** | Minh họa tính năng lọc đồng bộ URL qua `useSearchParams`. |
| **E06** | `evidence/E06_query_filter_empty_state.png` | `http://localhost:5173/orchids?category=NonExistent` | Khung cảnh báo rỗng (Empty State): Thông báo thân thiện khi danh mục tìm kiếm không khớp với bất kỳ loài lan nào. | **Not captured** | Kiểm tra khả năng xử lý truy vấn không hợp lệ của query string. |
| **E07** | `evidence/E07_orchid_detail_valid.png` | `http://localhost:5173/orchids/phalaenopsis-amabilis` | Trang chi tiết hoa lan hợp lệ: Ảnh hoa lan lớn, bảng thông số kỹ thuật (xuất xứ, tưới nước, ánh sáng, mùa hoa), care level badge và các loài lan liên quan. | **Not captured** | Minh họa trích xuất route param qua `useParams()`. |
| **E08** | `evidence/E08_orchid_detail_invalid_id.png` | `http://localhost:5173/orchids/999999` | Trang cảnh báo "Resource Not Found: Orchid 999999" với nút quay về danh mục hoa lan, ứng dụng không bị crash. | **Not captured** | Minh họa xử lý Resource Not Found trên route hợp lệ. |
| **E09** | `evidence/E09_about_page.png` | `http://localhost:5173/about` | Trang About: Nội dung giới thiệu dự án, giải thích kiến trúc SPA, so sánh với MPA và các khái niệm React Router. | **Not captured** | Thấy rõ URL `/about` và nội dung tài liệu. |
| **E10** | `evidence/E10_contact_form_usenavigate.png` | `http://localhost:5173/contact` | Trang Contact: Form liên hệ có validation, radio button chọn chế độ điều hướng `push` vs `replace` của `useNavigate`. | **Not captured** | Minh họa điều hướng lập trình (imperative navigation). |
| **E11** | `evidence/E11_dashboard_index.png` | `http://localhost:5173/dashboard` | Trang tổng quan Dashboard: Layout lồng nhau (`DashboardLayout`) với sidebar bên trái và các thẻ số liệu thống kê bên trong `<Outlet />`. | **Not captured** | Minh họa route index của nested layout. |
| **E12** | `evidence/E12_dashboard_favorites.png` | `http://localhost:5173/dashboard/favorites` | Trang Favorites trong Dashboard: Hiển thị danh sách hoa lan đã bookmark (hoặc empty state), sidebar vẫn giữ nguyên. | **Not captured** | Minh họa chuyển đổi view con qua `<Outlet />`. |
| **E13** | `evidence/E13_dashboard_profile.png` | `http://localhost:5173/dashboard/profile` | Trang Profile trong Dashboard: Hiển thị thông tin sinh viên demo Võ Anh Hào (CE191463) và ghi chú dữ liệu tĩnh. | **Not captured** | Minh họa route con thứ ba của Dashboard. |
| **E14** | `evidence/E14_home_redirect.png` | Gõ `/home` chuyển sang `/` | Thanh địa chỉ tự động chuyển đổi từ `http://localhost:5173/home` sang `http://localhost:5173/` bằng `<Navigate to="/" replace />`. | **Not captured** | Minh họa tính năng chuyển hướng URL cũ. |
| **E15** | `evidence/E15_wildcard_404_page.png` | `http://localhost:5173/unknown-path-abc` | Trang 404 Page Not Found: Bắt đường dẫn không tồn tại bằng route wildcard `*`, hiển thị đường dẫn đã cố truy cập. | **Not captured** | Minh họa bắt lỗi URL không khai báo. |
| **E16** | `evidence/E16_history_back_forward.png` | Điều hướng trình duyệt | Trình duyệt di chuyển qua lại giữa các view (Home → Orchids → Detail) bằng nút mũi tên Back / Forward mượt mà không reload. | **Not captured** | Có thể chụp lại history dropdown hoặc các bước chuyển trang. |
| **E17** | `evidence/E17_deep_link_new_tab.png` | Cửa sổ ẩn danh (Incognito) mới | Dán trực tiếp URL `http://localhost:5173/dashboard/favorites` vào cửa sổ ẩn danh mới và trang web hiển thị thành công. | **Not captured** | Minh họa cơ chế deep link và Vite SPA fallback. |
| **E18** | `evidence/E18_network_doc_zero_reloads.png` | DevTools tab Network | DevTools Network với bộ lọc **Doc** đang chọn: Số lượng request `Type: document` không tăng khi click các menu nội bộ. | **Not captured** | Bằng chứng cốt lõi chứng minh ứng dụng là SPA không reload document. |
| **E19** | `evidence/E19_break_it_anchor_reload.png` | DevTools tab Network khi test Bug 03 | DevTools Network xuất hiện request `Type: document` khi click thử nghiệm thẻ HTML `<a>` truyền thống trong bài BUG-03. | **Not captured** | Bằng chứng đối chiếu giữa thẻ `<a>` (MPA) và `<NavLink>` (SPA). |

---

## 2. Danh mục tài liệu hoàn thiện hồ sơ (Documentation Files)

- [x] `docs/route-map.md`: Sơ đồ cây định tuyến Mermaid, bảng phân tích route và giải thích hook.
- [x] `docs/test-matrix.md`: Bảng ma trận 10 kịch bản kiểm thử T01–T10 với các bước chi tiết.
- [x] `docs/trace-worksheet.md`: Bảng theo dõi điều hướng 10 bước đại diện và câu hỏi kiểm tra.
- [x] `docs/break-it-log.md`: 4 kịch bản chẩn đoán lỗi định tuyến thực hành và cách khắc phục.
- [x] `docs/reflection.md`: 8 câu hỏi phản ánh kiến thức kèm gợi ý và khung trả lời.
- [x] `README.md`: Tài liệu tổng quan dự án, kiến trúc, lệnh chạy và hướng dẫn sinh viên.

---

## 3. Quy trình sinh viên hoàn thiện bằng chứng trước khi nộp bài

1. Mở terminal, chạy `npm run dev`. Chụp ảnh cửa sổ terminal -> lưu thành `evidence/E01_dev_server_running.png`.
2. Mở trình duyệt tại `http://localhost:5173/` -> chụp ảnh trang chủ (`evidence/E02_initial_home_screen.png`).
3. Thực hiện lần lượt các thao tác điều hướng từ E03 đến E17 theo đúng URL và nội dung mô tả ở bảng trên.
4. Mở DevTools (<kbd>F12</kbd>) tab Network, lọc **Doc**, tick **Preserve log**:
   - Chụp ảnh E18 khi click các menu nội bộ (0 document request).
   - Làm tạm thời bài thực hành BUG-03 để chụp ảnh E19 khi click thẻ `<a>` (xuất hiện document request), sau đó khôi phục lại code.
5. Sau khi lưu đủ các ảnh vào thư mục `evidence/`, cập nhật trạng thái trong bảng trên từ `Not captured` sang `Captured` (hoặc đánh dấu tick `[x]`).
