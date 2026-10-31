package vn.edu.fpt.slot29.repository;

import vn.edu.fpt.slot29.domain.Book;
import java.util.*;

public interface IBookRepository {
    Book save(Book book);
    Optional<Book> findById(Long id);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findAll();
    long count();
}
