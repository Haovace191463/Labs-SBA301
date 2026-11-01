package com.library;

import com.library.config.HibernateUtil;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class App extends Application {

    @Override
    public void start(Stage primaryStage) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/LoginGUI.fxml"));
        Parent root = loader.load();

        Scene scene = new Scene(root, 440, 500);
        primaryStage.setTitle("Library Management System - Login");
        primaryStage.setScene(scene);
        primaryStage.setResizable(true);
        primaryStage.centerOnScreen();
        primaryStage.show();
    }

    @Override
    public void stop() throws Exception {
        super.stop();
        // Cleanly close Hibernate SessionFactory upon exit
        HibernateUtil.shutdown();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
