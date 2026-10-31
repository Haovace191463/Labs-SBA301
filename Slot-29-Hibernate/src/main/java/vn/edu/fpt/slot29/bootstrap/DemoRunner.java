package vn.edu.fpt.slot29.bootstrap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import vn.edu.fpt.slot29.domain.*;
import vn.edu.fpt.slot29.service.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class DemoRunner implements CommandLineRunner {
    private final IStudentService students;
    private final IBookService books;

    public DemoRunner(IStudentService students, IBookService books) {
        this.students = students;
        this.books = books;
    }

    @Override
    public void run(String... args) {
        Student student = students.findStudentByEmail("s29@fu.edu.vn")
                .orElseGet(() -> students.createStudent(
                        new Student("s29@fu.edu.vn", "Slot", "TwentyNine", 8.0)
                ));
        Book first = books.findBookByIsbn("978-001")
                .orElseGet(() -> books.createBook(new Book("978-001", "Hibernate Basics", "FPT")));
        Book second = books.findBookByIsbn("978-002")
                .orElseGet(() -> books.createBook(new Book("978-002", "ORM Design", "FPT")));

        Student currentStudent = students.getStudent(student.getId());
        Set<Long> associatedBookIds = currentStudent.getBooks().stream()
                .map(Book::getId)
                .collect(Collectors.toSet());

        List<Long> booksToBorrow = Stream.of(first.getId(), second.getId())
                .filter(id -> !associatedBookIds.contains(id))
                .toList();

        if (!booksToBorrow.isEmpty()) {
            students.borrowBooksAtomically(student.getId(), booksToBorrow);
        }

        Student loaded = students.getStudent(student.getId());
        System.out.printf("%s has %d books%n", loaded, loaded.getBooks().size());
        students.findStudentsByBook(first.getId()).forEach(System.out::println);
    }
}
