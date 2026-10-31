package fu.edu.sba301.ui;

import fu.edu.sba301.core.service.StudentServiceProvider;
import fu.edu.sba301.ui.controller.StudentController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public final class StudentApplication extends Application {
    private StudentServiceProvider serviceProvider;

    @Override
    public void start(Stage stage) throws IOException {
        serviceProvider = StudentServiceProvider.createDefault();
        serviceProvider.seedDemoData();

        FXMLLoader loader = new FXMLLoader(StudentApplication.class.getResource("student-view.fxml"));
        Scene scene = new Scene(loader.load(), 1050, 700);
        scene.getStylesheets().add(StudentApplication.class.getResource("student.css").toExternalForm());

        StudentController controller = loader.getController();
        controller.setStudentService(serviceProvider.service());

        stage.setTitle("SBA301 - Student Management");
        stage.setMinWidth(900);
        stage.setMinHeight(620);
        stage.setScene(scene);
        stage.show();
    }

    @Override
    public void stop() {
        if (serviceProvider != null) serviceProvider.close();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
