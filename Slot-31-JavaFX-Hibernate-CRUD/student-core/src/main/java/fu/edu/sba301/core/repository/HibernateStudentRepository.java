package fu.edu.sba301.core.repository;

import fu.edu.sba301.core.domain.Student;
import org.hibernate.SessionFactory;

import java.util.List;
import java.util.Optional;

public final class HibernateStudentRepository implements StudentRepository {
    private final SessionFactory sessionFactory;

    public HibernateStudentRepository(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public List<Student> findAll() {
        try (var session = sessionFactory.openSession()) {
            return session.createSelectionQuery("from Student s order by s.id", Student.class).getResultList();
        }
    }

    @Override
    public Optional<Student> findById(long id) {
        try (var session = sessionFactory.openSession()) {
            return Optional.ofNullable(session.find(Student.class, id));
        }
    }

    @Override
    public Optional<Student> findByEmail(String email) {
        try (var session = sessionFactory.openSession()) {
            return session.createSelectionQuery(
                            "from Student s where lower(s.email) = lower(:email)", Student.class)
                    .setParameter("email", email)
                    .uniqueResultOptional();
        }
    }

    @Override
    public Student save(Student student) {
        return inTransaction(session -> {
            session.persist(student);
            return student;
        });
    }

    @Override
    public Student update(long id, Student values) {
        return inTransaction(session -> {
            Student managed = session.find(Student.class, id);
            if (managed == null) return null;
            managed = new Student(id, values.getEmail(), values.getFirstName(), values.getLastName(), values.getMarks());
            return session.merge(managed);
        });
    }

    @Override
    public boolean deleteById(long id) {
        return inTransaction(session -> {
            Student managed = session.find(Student.class, id);
            if (managed == null) return false;
            session.remove(managed);
            return true;
        });
    }

    private <T> T inTransaction(java.util.function.Function<org.hibernate.Session, T> work) {
        try (var session = sessionFactory.openSession()) {
            var transaction = session.beginTransaction();
            try {
                T result = work.apply(session);
                transaction.commit();
                return result;
            } catch (RuntimeException ex) {
                if (transaction.isActive()) transaction.rollback();
                throw ex;
            }
        }
    }
}
