package fu.edu.sba301.core.service;

import fu.edu.sba301.core.domain.Student;
import fu.edu.sba301.core.repository.HibernateStudentRepository;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public final class StudentServiceProvider implements AutoCloseable {
    private final SessionFactory sessionFactory;
    private final IStudentService service;

    private StudentServiceProvider(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
        this.service = new StudentService(new HibernateStudentRepository(sessionFactory));
    }

    public static StudentServiceProvider createDefault() {
        return create("jdbc:h2:./data/studentdb;AUTO_SERVER=TRUE");
    }

    public static StudentServiceProvider create(String jdbcUrl) {
        Configuration configuration = new Configuration()
                .addAnnotatedClass(Student.class)
                .setProperty("jakarta.persistence.jdbc.driver", "org.h2.Driver")
                .setProperty("jakarta.persistence.jdbc.url", jdbcUrl)
                .setProperty("jakarta.persistence.jdbc.user", "sa")
                .setProperty("jakarta.persistence.jdbc.password", "")
                .setProperty("hibernate.hbm2ddl.auto", "update")
                .setProperty("hibernate.show_sql", "false")
                .setProperty("hibernate.format_sql", "true")
                .setProperty("hibernate.highlight_sql", "true");
        return new StudentServiceProvider(configuration.buildSessionFactory());
    }

    public IStudentService service() {
        return service;
    }

    public void seedDemoData() {
        if (!service.getAll().isEmpty()) return;
        service.create(new Student("an.nguyen@fpt.edu.vn", "An", "Nguyễn", 8.5));
        service.create(new Student("binh.tran@fpt.edu.vn", "Bình", "Trần", 7.8));
        service.create(new Student("chi.le@fpt.edu.vn", "Chi", "Lê", 9.2));
    }

    @Override
    public void close() {
        if (!sessionFactory.isClosed()) sessionFactory.close();
    }
}
