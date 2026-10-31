# Slot 31 — JavaFX, FXML, Controller và Hibernate CRUD

Project minh họa **Chapter 18 Part B** theo nguyên tắc trung tâm:

> JavaFX/FXML là presentation layer. Controller điều phối tương tác và chỉ gọi Service. Hibernate Session, HQL và transaction không xuất hiện trong Controller.

## 1. Kết quả đạt được

- JavaFX `Application → Stage → Scene → scene graph`.
- Giao diện khai báo bằng FXML, định dạng bằng CSS.
- `fx:controller`, `fx:id`, `@FXML`, handler và `initialize()`.
- `TableView<Student>`, 5 `TableColumn`, `ObservableList`, selection-to-form.
- Create, Update, Delete, Clear, Refresh và tìm kiếm.
- Validation ở UI và business validation ở Service.
- Xử lý duplicate email bằng thông báo nghiệp vụ, không đưa SQL error ra UI.
- H2 file database + Hibernate ORM; tự seed 3 bản ghi ở lần chạy đầu.
- Named JPMS modules và `opens ... to javafx.fxml`.
- `Task<List<Student>>` minh họa refresh nền, cập nhật UI trên FX Application Thread.
- Integration test dùng H2 in-memory cho full CRUD, duplicate email và invalid marks.

## 2. Công nghệ đã khóa theo máy hiện tại

| Thành phần | Phiên bản | Lý do |
|---|---:|---|
| JDK | 21 LTS | Đúng JDK đang cài trên máy |
| Maven | 3.9.9 | Đúng Maven đang cài trên máy |
| JavaFX | 21.0.9 | Nhánh LTS phù hợp JDK 21; có `controls` và `fxml` |
| Hibernate ORM | 7.4.14.Final | Stable và hỗ trợ Java 21 |
| H2 | 2.5.250 | Embedded, không cần cài DB server |
| JUnit Jupiter | 5.14.1 | Integration test |

Tham khảo: [OpenJFX Maven guide](https://openjfx.io/openjfx-docs/), [FXML API và JPMS reflection](https://openjfx.io/javadoc/21/javafx.fxml/javafx/fxml/FXML.html), [Hibernate releases](https://hibernate.org/orm/releases/), [H2](https://h2database.com/).

## 3. Kiến trúc

```text
student-ui (named module: fu.edu.sba301.ui)
  FXML/CSS -> StudentController -> IStudentService
                                      |
student-core (named module: fu.edu.sba301.core)
  StudentService -> StudentRepository -> HibernateStudentRepository
                                             |
                                      Session/transaction -> H2
```

Quy tắc dependency: mũi tên chỉ đi từ UI xuống interface/service. `StudentController` không biết `SessionFactory`, `Session`, HQL, JDBC hay transaction.

## 4. Cấu trúc project

```text
slot31/
├─ pom.xml
├─ README.md
├─ KnowledgeBase.md
├─ student-core/
│  ├─ pom.xml
│  └─ src/
│     ├─ main/java/
│     │  ├─ module-info.java
│     │  └─ fu/edu/sba301/core/
│     │     ├─ domain/Student.java
│     │     ├─ repository/{StudentRepository,HibernateStudentRepository}.java
│     │     └─ service/{IStudentService,StudentService,...}.java
│     └─ test/java/.../StudentServiceIntegrationTest.java
└─ student-ui/
   ├─ pom.xml
   └─ src/main/
      ├─ java/
      │  ├─ module-info.java
      │  └─ fu/edu/sba301/ui/
      │     ├─ StudentApplication.java
      │     └─ controller/StudentController.java
      └─ resources/fu/edu/sba301/ui/
         ├─ student-view.fxml
         └─ student.css
```

## 5. Chạy nhanh

Tại thư mục gốc:

```powershell
mvn clean test
mvn -pl student-ui -am install -DskipTests
mvn -f student-ui/pom.xml javafx:run
```

Lần đầu Maven cần Internet để tải dependencies. Database được tạo tại `data/studentdb.mv.db` theo **working directory lúc chạy**. Xóa file này khi muốn reset dữ liệu demo; không xóa khi cần giữ dữ liệu.

## 6. Workbook step by step

Mỗi bước phải tự ghi kết quả PASS/FAIL và evidence. Không chuyển bước nếu gate hiện tại FAIL.

### Step 1 — Kiểm tra môi trường

**Mục tiêu:** xác nhận toolchain. **Thao tác:** mở terminal tại project. **Code/config:** không có.

```powershell
java -version
mvn -version
```

**Run:** hai lệnh trên. **Verification:** Java và Maven cùng nhìn JDK 21. **PASS:** hiển thị Java 21, Maven 3.9.x. **FAIL:** chỉnh `JAVA_HOME`, mở terminal mới rồi kiểm tra lại.

### Step 2 — Tạo parent Maven multi-module

**Mục tiêu:** tách presentation khỏi core. **Thao tác:** tạo `student-core`, `student-ui`, khai báo trong root `pom.xml`. **Code/config:** xem `<modules>` và `<properties>` trong root POM. **Run:** `mvn validate`. **Verification:** reactor order có root → core → UI. **PASS:** BUILD SUCCESS. **FAIL:** kiểm tra đường dẫn module và parent coordinates.

### Step 3 — Thêm JavaFX dependencies/plugin

**Mục tiêu:** có Controls, FXML và lệnh chạy JavaFX. **Thao tác:** trong `student-ui/pom.xml` thêm `javafx-controls`, `javafx-fxml`, `javafx-maven-plugin`. **Code/config:** `mainClass` phải là `fu.edu.sba301.ui/fu.edu.sba301.ui.StudentApplication`. **Run:** `mvn -pl student-ui -am compile`. **Verification:** JavaFX artifacts được resolve. **PASS:** UI compile. **FAIL:** kiểm tra version và kết nối Maven Central.

### Step 4 — Tạo core module và persistence dependencies

**Mục tiêu:** cô lập persistence. **Thao tác:** thêm Hibernate, H2 và SLF4J trong `student-core/pom.xml`. **Code/config:** core không phụ thuộc JavaFX. **Run:** `mvn -pl student-core compile`. **Verification:** core compile độc lập. **PASS:** BUILD SUCCESS. **FAIL:** đọc dependency resolution error.

### Step 5 — Cấu hình JPMS

**Mục tiêu:** module graph và reflective access đúng.

```java
module fu.edu.sba301.ui {
    requires javafx.controls;
    requires javafx.fxml;
    requires fu.edu.sba301.core;
    exports fu.edu.sba301.ui;
    opens fu.edu.sba301.ui.controller to javafx.fxml;
}
```

Core `opens fu.edu.sba301.core.domain to org.hibernate.orm.core;` để Hibernate truy cập entity. **Run:** `mvn clean compile`. **Verification:** không có `module not found` hay `InaccessibleObjectException`. **PASS:** cả hai module compile. **FAIL:** kiểm tra chính xác tên module và package.

### Step 6 — Tạo entity Student

**Mục tiêu:** ánh xạ object ↔ table. **Thao tác:** tạo `Student` với `id`, `email`, `firstName`, `lastName`, `marks`. **Code/config:** `@Entity`, `@Id`, `@GeneratedValue`, unique constraint cho email. **Run:** test service hoặc chạy app. **Verification:** table `students` được Hibernate tạo. **PASS:** insert được bản ghi. **FAIL:** đọc nested mapping exception.

### Step 7 — Tạo repository và transaction boundary

**Mục tiêu:** mọi Hibernate code nằm dưới service. **Thao tác:** tạo `StudentRepository` và `HibernateStudentRepository`. **Code/config:** mỗi mutation dùng `beginTransaction`, `commit`, rollback khi exception, đóng Session bằng try-with-resources. **Run:** `mvn -pl student-core test`. **Verification:** full CRUD test. **PASS:** test pass. **FAIL:** xem report trong `student-core/target/surefire-reports`.

### Step 8 — Tạo IStudentService và business validation

**Mục tiêu:** cung cấp boundary ổn định cho UI. **Thao tác:** khai báo `getAll/getById/create/update/delete`. **Code/config:** normalize email, kiểm tra điểm, tên, duplicate email và chuyển lỗi kỹ thuật thành `StudentServiceException`. **Run:** test duplicate email và invalid marks. **Verification:** lỗi có nghĩa, DB không mutation với input sai. **PASS:** hai test pass. **FAIL:** đặt breakpoint tại repository để kiểm tra validation order.

### Step 9 — Tạo composition root/service provider

**Mục tiêu:** tạo Hibernate dependencies ngoài Controller. **Thao tác:** `StudentServiceProvider` tạo `SessionFactory → Repository → Service`. **Code/config:** H2 URL mặc định `jdbc:h2:./data/studentdb;AUTO_SERVER=TRUE`. **Run:** khởi động app. **Verification:** lần đầu có 3 dòng seed. **PASS:** controller chỉ nhận interface. **FAIL:** không được chữa bằng `new StudentDAO()` trong controller.

### Step 10 — Tạo JavaFX Application

**Mục tiêu:** khởi tạo Stage/Scene/FXML. **Thao tác:** override `start(Stage)`, dùng `FXMLLoader`, tạo `Scene`, gắn CSS, show Stage. **Code/config:** resource path tương đối cùng package: `StudentApplication.class.getResource("student-view.fxml")`. **Run:** `mvn -f student-ui/pom.xml javafx:run`. **Verification:** cửa sổ có tiêu đề và layout. **PASS:** không có load exception. **FAIL:** kiểm tra resource có trong `student-ui/target/classes`.

### Step 11 — Tạo FXML root và fx:controller

**Mục tiêu:** khai báo scene graph. **Thao tác:** root `BorderPane`, top header, center form/table, bottom status. **Code/config:** `fx:controller="fu.edu.sba301.ui.controller.StudentController"`. **Run:** preview Scene Builder hoặc chạy app. **Verification:** node hierarchy hiển thị đúng. **PASS:** FXML load. **FAIL:** xem dòng lỗi được bọc trong `FXMLLoadException`.

### Step 12 — Tạo form và fx:id

**Mục tiêu:** nhận dữ liệu người dùng. **Thao tác:** tạo 4 TextField `txtEmail`, `txtFirstName`, `txtLastName`, `txtMarks`. **Code/config:** ID phải trùng tuyệt đối field `@FXML`. **Run:** load UI. **Verification:** gõ được dữ liệu. **PASS:** fields được inject. **FAIL:** kiểm tra tên, type và package `opens`.

### Step 13 — Thêm action buttons/handlers

**Mục tiêu:** nối event FXML → Controller. **Thao tác:** tạo Create/Update/Delete/Clear/Refresh/Refresh nền. **Code/config:** ví dụ `onAction="#handleCreate"` ↔ `@FXML private void handleCreate()`. **Run:** load UI và bấm từng nút. **Verification:** handler được resolve. **PASS:** không load error. **FAIL:** tên/signature handler không khớp.

### Step 14 — Thêm TableView và 5 TableColumn

**Mục tiêu:** hiển thị collection Student. **Thao tác:** tạo `tblStudents`, `colId`, `colEmail`, `colFirstName`, `colLastName`, `colMarks`. **Code/config:** dùng explicit cell value factory trong `initialize()` thay cho reflection string. **Run:** app. **Verification:** 5 cột có dữ liệu. **PASS:** đúng value/type. **FAIL:** kiểm tra generic type và getter.

### Step 15 — initialize() và ObservableList

**Mục tiêu:** cấu hình UI sau injection. **Thao tác:** set cell factories, `tblStudents.setItems(filteredData)`, gắn selection/search listeners. **Code/config:** không gọi DB tại đây vì service chưa được inject. **Run:** đặt breakpoint trong `initialize` và `setStudentService`. **Verification:** initialize chạy trước setter. **PASS:** không NPE. **FAIL:** chuyển initial refresh sang setter/composition root.

### Step 16 — Inject Service sau FXMLLoader.load()

**Mục tiêu:** wiring dependency đúng lifecycle.

```java
Parent root = loader.load();
StudentController controller = loader.getController();
controller.setStudentService(serviceProvider.service());
```

**Run:** app. **Verification:** initial table có dữ liệu. **PASS:** Controller chỉ import `IStudentService`. **FAIL:** kiểm tra setter được gọi sau `load()`.

### Step 17 — Selection → form

**Mục tiêu:** chọn dòng để edit/delete. **Thao tác:** listener gọi `populateForm(selected)`. **Code/config:** lưu `selectedStudentId`, đưa 4 property lên fields. **Run:** click từng row. **Verification:** form và label ID đồng bộ. **PASS:** đúng student. **FAIL:** kiểm tra selection model và listener.

### Step 18 — Validation và readForm()

**Mục tiêu:** chặn input sai trước service call. **Thao tác:** required, email format, parse double, finite, range 0..10. **Code/config:** throw `IllegalArgumentException` với message thân thiện. **Run:** thử rỗng, `abc`, `-1`, `11`, email sai. **Verification:** alert xuất hiện, table/DB không đổi. **PASS:** repository không được gọi. **FAIL:** đặt breakpoint ở service mutation.

### Step 19 — Create

**Mục tiêu:** UI → Service → DB → refresh. **Thao tác:** nhập hợp lệ và bấm Tạo mới. **Code/config:** `service.create(readForm())`, refresh, clear, success alert. **Run:** tạo email mới. **Verification:** row xuất hiện và form clear. **PASS:** restart app row vẫn còn. **FAIL:** đọc console nested exception.

### Step 20 — Update

**Mục tiêu:** cập nhật theo selected ID. **Thao tác:** chọn row, đổi fields, bấm Cập nhật. **Code/config:** `service.update(selectedStudentId, readForm())`. **Run:** update. **Verification:** row mới và dữ liệu còn sau restart. **PASS:** đúng ID được sửa. **FAIL:** nếu chưa chọn phải bị chặn.

### Step 21 — Delete

**Mục tiêu:** xóa có xác nhận. **Thao tác:** chọn row, bấm Xóa, thử No rồi Yes. **Code/config:** chỉ gọi service khi kết quả là `ButtonType.YES`. **Run:** hai nhánh. **Verification:** No giữ nguyên; Yes xóa và clear form. **PASS:** service không được gọi ở nhánh No. **FAIL:** kiểm tra return sớm.

### Step 22 — Clear, Refresh và search

**Mục tiêu:** quản lý state nhất quán. **Thao tác:** Clear reset ID/fields/selection; Refresh reload service; search dùng `FilteredList`. **Run:** chọn row, clear; nhập keyword. **Verification:** selected ID reset và số dòng lọc đúng. **PASS:** Update/Delete bị chặn sau clear. **FAIL:** kiểm tra `selectedStudentId = null`.

### Step 23 — Error feedback

**Mục tiêu:** thông báo hữu ích, không lộ lỗi DB. **Thao tác:** tạo trùng email. **Code/config:** Controller bắt `StudentServiceException`; unexpected exception chỉ print console và hiện message tổng quát. **Run:** tạo email đã có. **Verification:** alert “Email đã tồn tại”, không có SQL trong UI. **PASS:** DB không thêm dòng. **FAIL:** service chưa translate exception.

### Step 24 — Background Task

**Mục tiêu:** hiểu UI thread. **Thao tác:** bấm `Refresh nền`. **Code/config:** `studentService.getAll()` trong `Task.call()`, `data.setAll(...)` trong `setOnSucceeded`. **Run:** quan sát progress indicator. **Verification:** UI update trong callback FX thread. **PASS:** app responsive. **FAIL:** không sửa ObservableList trực tiếp trong `call()`.

### Step 25 — Integration tests

**Mục tiêu:** kiểm chứng core không cần UI. **Thao tác:** chạy:

```powershell
mvn clean test
```

**Verification:** 3 tests, 0 failures/errors. **PASS:** reactor BUILD SUCCESS. **FAIL:** mở Surefire report; mỗi test dùng H2 in-memory tên riêng để không rò state.

### Step 26 — Break-It: fx:id mismatch

**Mục tiêu:** chẩn đoán injection. **Thao tác:** tạm đổi `txtEmail` trong FXML thành `txtEmailX`. **Run:** app. **Verification:** field không được inject; lỗi xuất hiện khi code dùng field. **PASS:** xác định mismatch bằng exact-name check. **FAIL:** nếu không giải thích được root cause. **Khôi phục ngay** sau thí nghiệm.

### Step 27 — Break-It: wrong handler

**Mục tiêu:** chẩn đoán event wiring. **Thao tác:** tạm đổi `#handleCreate` thành `#handleCreateX`. **Run:** app. **Verification:** FXMLLoader báo không resolve handler. **PASS:** chỉ đúng FXML/controller name là sửa được. **Khôi phục ngay**.

### Step 28 — Break-It: remove opens

**Mục tiêu:** hiểu JPMS reflection. **Thao tác:** tạm xóa `opens fu.edu.sba301.ui.controller to javafx.fxml;`. **Run:** clean rồi chạy app. **Verification:** access/reflection error. **PASS:** nested exception chỉ ra package chưa open. **Khôi phục ngay**.

### Step 29 — Integration gate G1–G15

| Gate | Evidence để PASS |
|---|---|
| G1 Build | `mvn clean test` thành công |
| G2 Module | controls/fxml/core + opens đúng |
| G3 FXML | view load không exception |
| G4 Injection | mọi field dùng trong initialize khác null |
| G5 Service | Controller phụ thuộc `IStudentService` |
| G6 Table | 5 columns + items cấu hình đúng |
| G7 Selection | row → form + selected ID |
| G8 Create | row và DB có record |
| G9 Update | đúng ID và DB thay đổi |
| G10 Delete | cancel không gọi; confirm xóa |
| G11 Validation | invalid input không mutation |
| G12 Refresh | UI khớp persistence |
| G13 Error | message nghiệp vụ, không raw SQL |
| G14 Break/Fix | giải thích được cả 3 lỗi wiring/module |
| G15 Explain | trình bày đúng View/Controller/Service/Persistence |

## 7. Kịch bản kiểm thử end-to-end

| Action | UI expected | Persistence expected |
|---|---|---|
| Initial load | 3 seed rows ở DB mới | SELECT; seed INSERT lần đầu |
| Create | row xuất hiện, form clear | INSERT |
| Select | form populated | không đổi DB |
| Update | row có giá trị mới | UPDATE |
| Delete → No | row giữ nguyên | không DELETE |
| Delete → Yes | row biến mất, form clear | DELETE |
| Refresh | table khớp DB | SELECT |
| Duplicate email | alert nghiệp vụ | không INSERT |
| Invalid marks | alert UI | service mutation không được gọi |

## 8. Lưu ý production

Demo dùng built-in Hibernate connection pool để giảm setup cho lớp học. Production nên dùng HikariCP, migration tool (Flyway/Liquibase), logging có cấu trúc, command/DTO riêng cho update và chạy mọi DB operation có thể chậm ở background executor. Không dùng `hibernate.hbm2ddl.auto=update` như chiến lược migration production.

Kiến thức nền đầy đủ và troubleshooting nằm trong [KnowledgeBase.md](KnowledgeBase.md).
