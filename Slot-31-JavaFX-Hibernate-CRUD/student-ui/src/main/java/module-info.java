module fu.edu.sba301.ui {
    requires javafx.controls;
    requires javafx.fxml;
    requires fu.edu.sba301.core;

    exports fu.edu.sba301.ui;
    opens fu.edu.sba301.ui.controller to javafx.fxml;
}
