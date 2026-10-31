# Knowledge Base — Slot 31 JavaFX/FXML/Controller/CRUD UI Integration

## 1. Mental model quan trọng nhất

Một request từ người dùng đi theo chiều:

```text
User action
  → FXML-created Button
  → Controller event handler
  → IStudentService
  → business validation/use case
  → Repository/Hibernate transaction
  → database
  → result/exception trở lại Controller
  → ObservableList/Alert được cập nhật
```

FXML không truy vấn DB. Controller không quản lý Session. Service không biết TextField/TableView. Persistence không show Alert. Mỗi layer có một lý do thay đổi riêng.

## 2. Application lifecycle, Stage, Scene và Node

`Application.launch()` khởi động JavaFX runtime và tạo **JavaFX Application Thread**. Runtime gọi `start(Stage primaryStage)` trên thread này.

- **Stage**: cửa sổ top-level. Một app có thể có nhiều Stage.
- **Scene**: nội dung gắn vào Stage và chứa một scene graph.
- **Node**: đơn vị trong graph, ví dụ Label, Button, TextField, VBox.
- **Parent**: Node có children, ví dụ BorderPane/GridPane/VBox.

`start()` nên composition: tạo service/provider, load view, inject service, tạo scene, show stage. `stop()` là nơi đóng `SessionFactory` hoặc resource dùng suốt vòng đời app.

## 3. Scene graph

Scene graph là cây node. Quan hệ cha-con quyết định layout, CSS, event dispatch, render và lifecycle. Ví dụ:

```text
BorderPane
├─ top: VBox
│  ├─ Label title
│  └─ Label subtitle
├─ center: VBox
│  ├─ GridPane form
│  ├─ HBox search
│  └─ TableView
└─ bottom: HBox status
```

Không add cùng một Node vào hai Parent. Các layout pane nên quản lý kích thước thay vì đặt tọa độ tuyệt đối.

## 4. FXML

FXML là XML-based declarative markup dùng để tạo Java object graph. Tag thường ánh xạ tới class, attribute ánh xạ tới property, nesting ánh xạ quan hệ object/children.

FXML phù hợp mô tả **structure**, không phù hợp chứa business logic. Scene Builder chỉ là editor trực quan; file đầu ra vẫn là FXML và có thể viết tay.

## 5. FXMLLoader

`FXMLLoader` thực hiện tuần tự về ý nghĩa:

1. Đọc XML và import declarations.
2. Tạo controller theo `fx:controller` (nếu không dùng controller factory/setController).
3. Tạo Nodes/object graph.
4. Gán properties.
5. Inject object có `fx:id` vào `@FXML` fields.
6. Resolve event handlers.
7. Gọi `initialize()` sau injection.
8. Trả về root node từ `load()`.

Do đó `loader.getController()` phải gọi **sau** `loader.load()` khi controller được khai báo bởi `fx:controller`.

## 6. fx:controller

`fx:controller` chứa fully qualified class name của controller gắn với FXML document. Một FXML không được vừa dùng `fx:controller` vừa `loader.setController(...)`; chọn một chiến lược.

Project này để FXMLLoader tạo controller, sau đó composition root gọi setter để inject `IStudentService`. Với DI framework lớn hơn có thể dùng `loader.setControllerFactory(...)`.

## 7. fx:id

`fx:id="txtEmail"` đặt namespace identifier. Khi controller có `@FXML private TextField txtEmail;`, loader dùng tên để inject cùng object.

`fx:id` khác CSS `id`. CSS có thể dùng `id="..."` hoặc style classes; injection dựa trên `fx:id`.

## 8. @FXML

`@FXML` đánh dấu field/method để loader truy cập dù là `private`. Với named module, package chứa member private phải reflectively accessible:

```java
opens fu.edu.sba301.ui.controller to javafx.fxml;
```

`exports` và `opens` khác nhau:

- `exports`: cho module khác compile/link tới public types.
- `opens`: cho deep reflection truy cập non-public members tại runtime.

Hibernate cũng dùng reflection nên domain package được open có mục tiêu cho `org.hibernate.orm.core`.

## 9. initialize()

`initialize()` chạy sau injection nên phù hợp để:

- cấu hình cell value factories;
- set items cho TableView;
- đăng ký selection/search listener;
- thiết lập trạng thái UI ban đầu.

Không refresh DB trong `initialize()` nếu service chỉ được setter-inject sau `load()`. Project gọi refresh trong `setStudentService()`.

## 10. onAction handler

FXML:

```xml
<Button text="Tạo mới" onAction="#handleCreate"/>
```

Controller:

```java
@FXML
private void handleCreate() { ... }
```

Dấu `#` nghĩa là resolve method trên controller. Tên sai, signature không phù hợp hoặc package chưa open có thể làm load thất bại.

Handler nên ngắn theo flow: precondition → parse/validate → service call → refresh/reset/feedback. Logic transaction không nằm ở đây.

## 11. TableView

`TableView<Student>` hiển thị một observable collection. TableView không tự truy vấn DB. `setItems(...)` gắn list model của UI vào table.

TableView ảo hóa cells; không giả định mỗi row luôn có một Node cố định. Với data thay đổi, nên thay đổi list trên FX thread.

## 12. TableColumn và cell value mapping

Mỗi `TableColumn<S,T>` cần callback từ row `S` sang observable value `T`.

Project dùng mapping explicit:

```java
colEmail.setCellValueFactory(cell ->
    new ReadOnlyStringWrapper(cell.getValue().getEmail()));
```

Ưu điểm: type-safe, rename getter dễ được compiler phát hiện, không phụ thuộc reflection string. `PropertyValueFactory<>("email")` ngắn hơn nhưng lỗi tên property chỉ lộ runtime và có thêm yêu cầu reflection/module access.

## 13. SelectionModel

`tblStudents.getSelectionModel().selectedItemProperty()` là observable selected row. Listener cập nhật fields và `selectedStudentId`.

Phải xử lý selection `null`, nhất là sau `clearSelection()`, refresh hoặc filter. ID là state quan trọng để Update/Delete tác động đúng record.

## 14. ObservableList và FilteredList

`ObservableList` phát change events để controls phản ứng. Pattern course-safe sau mutation là:

```java
data.setAll(studentService.getAll());
```

`FilteredList` wrap danh sách nguồn và chỉ thay predicate; không copy/mutate database. Khi source list đổi, filtered view tự cập nhật.

Production có thể cập nhật chính xác một phần tử để giảm query, nhưng phải xử lý identity, sorting, filtering và lỗi đồng bộ cẩn thận.

## 15. Controller state

`selectedStudentId == null` biểu diễn create/no-selection; có ID biểu diễn edit target. Sau Create/Delete/Clear phải reset ID và selection. Nếu chỉ clear fields mà quên ID, lần Update sau có thể sửa nhầm record.

State UI không thay thế source of truth trong DB. Refresh là lúc tái đồng bộ.

## 16. Form validation và business validation

Hai lớp validation có mục tiêu khác nhau:

- **Controller/UI validation**: required, parse, type, range, feedback nhanh; tránh service call vô ích.
- **Service/business validation**: invariant bất kể caller là UI, REST hay test; duplicate email, normalization, business range.
- **Database constraint**: tuyến phòng thủ cuối cùng trước race condition/data corruption.

Không chỉ validate ở Controller, vì caller khác có thể bỏ qua UI. Không đưa tất cả validation vào DB, vì message sẽ kém thân thiện và phản hồi muộn.

## 17. Alert và error translation

Controller biến outcome thành feedback:

- success → information/status;
- validation/business error → message cụ thể;
- unexpected technical error → log chi tiết ở console/logger, UI chỉ thấy message an toàn.

Không show stack trace, SQL statement, password, JDBC URL hoặc internal exception chain cho người dùng.

## 18. Reset form

Reset đúng gồm:

1. `selectedStudentId = null`;
2. clear fields;
3. clear table selection;
4. reset label/trạng thái;
5. focus field đầu tiên.

Thứ tự listener có thể làm `populateForm(null)` chạy khi clear selection, nên method phải null-safe.

## 19. Refresh strategy

Course-safe: sau mutation gọi `getAll()` rồi `data.setAll(...)`. Đây là cách dễ chứng minh UI khớp persistence.

Production alternatives:

- thêm/cập nhật/xóa trực tiếp trong ObservableList khi service trả object chuẩn;
- optimistic UI với rollback khi service lỗi;
- pagination/virtual query với dataset lớn;
- event-driven refresh nếu nhiều client cùng sửa dữ liệu.

Trade-off là tính đơn giản so với performance và conflict handling.

## 20. JavaFX Application Thread

Mọi thay đổi scene graph/controls phải chạy trên FX Application Thread. Event handlers và `Task.setOnSucceeded` chạy ở đây. Nếu handler gọi DB chậm đồng bộ, thread không render/nhận input nên cửa sổ “freeze”.

Không chữa freeze bằng cách tạo thread rồi sửa TextField/TableView trực tiếp từ thread đó; việc này vi phạm thread confinement.

## 21. Background Task awareness

`Task<T>` có `call()` chạy trên worker thread và lifecycle callbacks chạy trên FX thread:

```java
Task<List<Student>> task = new Task<>() {
    protected List<Student> call() {
        return studentService.getAll();
    }
};
task.setOnSucceeded(e -> data.setAll(task.getValue()));
task.setOnFailed(e -> showError("Không thể tải dữ liệu"));
new Thread(task).start();
```

Production nên dùng bounded `ExecutorService`, cancel khi đóng view, disable duplicate actions, hiển thị progress và xử lý stale results. CRUD nhỏ trong lab có thể synchronous để flow dễ học.

## 22. JPMS reflection

Module graph project:

```text
fu.edu.sba301.ui
  requires javafx.controls
  requires javafx.fxml
  requires fu.edu.sba301.core

fu.edu.sba301.core
  requires jakarta.persistence
  requires org.hibernate.orm.core
  requires com.h2database
  opens domain to Hibernate
```

UI controller package open cho FXMLLoader. Domain package open cho Hibernate. Chỉ open package cần reflection và chỉ tới module cần thiết; tránh `open module` nếu không cần.

## 23. FXML/Controller wiring matrix

| FXML construct | Controller/module counterpart | Failure nếu sai |
|---|---|---|
| `fx:controller="...StudentController"` | class tồn tại/có thể tạo | controller load error |
| `fx:id="txtEmail"` | `@FXML TextField txtEmail` | null field/type injection error |
| `onAction="#handleCreate"` | `@FXML void handleCreate()` | method resolution/FXML load error |
| `TableView fx:id="tblStudents"` | `@FXML TableView<Student>` | không bind/listen được |
| UI module `opens controller` | reflection cho `javafx.fxml` | `InaccessibleObjectException` |
| core module `opens domain` | reflection cho Hibernate | mapping/access error |

## 24. Service boundary và transaction

`IStudentService` mô tả use cases mà presentation được phép gọi. Implementation phối hợp validation và repository. Repository sở hữu Hibernate API và transaction.

Mỗi write transaction phải có ba nhánh: begin → commit khi success → rollback khi exception. Session phải được đóng. `SessionFactory` thread-safe và sống theo application; `Session` không thread-safe và sống ngắn theo unit of work.

Controller không chứa Session vì:

- trộn UI với data access, khó test;
- event handler dài và lặp transaction code;
- exception kỹ thuật rò ra UI;
- khó tái sử dụng nghiệp vụ cho REST/CLI;
- khó chuyển DB/persistence implementation;
- dễ giữ Session quá lâu và gây thread/concurrency bug.

## 25. H2 trong bài học

H2 embedded giúp chạy độc lập, hỗ trợ transaction và file persistence. URL `jdbc:h2:./data/studentdb;AUTO_SERVER=TRUE` tạo file theo working directory. Test dùng database `mem:` riêng cho từng case để không rò state/order dependence.

H2 không bảo đảm mọi behavior giống MySQL/PostgreSQL. Production/integration gate cuối nên test thêm đúng DB mục tiêu, migration và connection pool.

## 26. Troubleshooting theo triệu chứng

### `Location is not set` hoặc resource null

- Kiểm tra path và chữ hoa/thường.
- Resource phải ở `src/main/resources`.
- Xem file đã copy sang `target/classes` chưa.

### `FXMLLoadException`

- Đọc **nested/root cause** và line number FXML.
- Kiểm tra XML well-formed, imports, tag/property.
- Kiểm tra controller class, fx:id, handlers và module opens.

### `@FXML field` null

- `fx:id` có trùng chính xác không?
- Có `@FXML` không?
- Type field có tương thích node không?
- Field có được dùng trước `load()/initialize()` không?
- Package có open tới `javafx.fxml` không?

### `InaccessibleObjectException`

- Xác định module thực hiện reflection.
- UI: `opens ...controller to javafx.fxml`.
- Hibernate: `opens ...domain to org.hibernate.orm.core`.
- `exports` không tự động thay thế deep reflection cho private members.

### Handler không tồn tại

- FXML phải có `#`.
- Tên/case khớp method.
- Signature phù hợp: không tham số hoặc event phù hợp.
- Method private cần `@FXML` và package opens.

### UI bị freeze

- Tìm blocking I/O, DB query, `sleep`, network trong FX thread.
- Chuyển blocking work sang Task/executor.
- Chỉ update UI ở callbacks FX thread/`Platform.runLater`.

### Duplicate email hiện raw SQL

- Service phải check/translate business error.
- Vẫn giữ database unique constraint để chống race.
- Controller chỉ hiển thị `StudentServiceException` có nghĩa.

### Test ảnh hưởng lẫn nhau

- Không dùng cùng H2 mem name với `DB_CLOSE_DELAY=-1` giữa tests.
- Dùng database riêng, rollback fixture hoặc reset schema.
- Test không nên phụ thuộc order.

## 27. Break-It experiments an toàn

Mỗi experiment: thay một điểm → clean/run → chụp root cause → giải thích → restore → clean/run PASS.

1. `fx:id` mismatch: chứng minh injection dựa trên exact name.
2. wrong handler: chứng minh event resolution xảy ra lúc load.
3. remove UI `opens`: chứng minh FXML dùng reflection.
4. marks `abc/-1/11`: chứng minh validation chặn mutation.
5. duplicate email: chứng minh error translation.
6. tạm `Thread.sleep(3000)` trong handler rồi xóa: chứng minh FX thread freeze.

Không commit trạng thái cố tình làm hỏng.

## 28. Câu hỏi tự kiểm tra

1. Vì sao service không được gọi trong `initialize()` ở wiring hiện tại?
2. `exports` khác `opens` thế nào?
3. Tại sao `SessionFactory` có thể dùng chung nhưng `Session` không?
4. Nếu clear fields mà không reset ID, bug nào có thể xảy ra?
5. Vì sao validation phải tồn tại cả UI, Service và DB constraint?
6. `Task.call()` và `setOnSucceeded` chạy trên thread nào?
7. Vì sao explicit cell factory an toàn hơn `PropertyValueFactory("email")`?
8. Tại sao Controller không nên catch rồi show nguyên `ex.getCause()`?
9. Refresh toàn danh sách có ưu/nhược điểm gì?
10. Nếu DB có một triệu records, kiến trúc TableView cần thay đổi thế nào?

## 29. Checklist giải thích cuối slot

Sinh viên đạt khi có thể tự vẽ và giải thích luồng User → FXML Node → Controller → Service → Repository/Hibernate → DB; chỉ ra chính xác nơi đặt validation, transaction, feedback; chẩn đoán được wiring/module error; và giải thích vì sao background work không được sửa UI trực tiếp.
