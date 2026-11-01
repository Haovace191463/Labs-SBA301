package com.library.dao;

import com.library.config.HibernateUtil;
import com.library.entity.Student;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;

public class StudentDAO {

    public Student save(Student student) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.persist(student);
            transaction.commit();
            return student;
        } catch (Exception e) {
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            throw new RuntimeException("Failed to save student: " + e.getMessage(), e);
        }
    }

    public List<Student> findAll() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Query<Student> query = session.createQuery("FROM Student ORDER BY id ASC", Student.class);
            return query.list();
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve all students: " + e.getMessage(), e);
        }
    }

    public Student findById(Long id) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.get(Student.class, id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to find student by ID " + id + ": " + e.getMessage(), e);
        }
    }

    public Student findByEmail(String email) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Query<Student> query = session.createQuery("FROM Student WHERE email = :email", Student.class);
            query.setParameter("email", email);
            return query.uniqueResult();
        } catch (Exception e) {
            throw new RuntimeException("Failed to find student by email " + email + ": " + e.getMessage(), e);
        }
    }

    public Student update(Student student) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            Student merged = session.merge(student);
            transaction.commit();
            return merged;
        } catch (Exception e) {
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            throw new RuntimeException("Failed to update student: " + e.getMessage(), e);
        }
    }

    public boolean delete(Long id) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            Student student = session.get(Student.class, id);
            if (student != null) {
                // If there are relationships in join table, clear them so foreign keys don't block deletion
                student.getBooks().clear();
                session.remove(student);
                transaction.commit();
                return true;
            }
            transaction.rollback();
            return false;
        } catch (Exception e) {
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            throw new RuntimeException("Failed to delete student with ID " + id + ": " + e.getMessage(), e);
        }
    }
}
