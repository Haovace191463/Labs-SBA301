package vn.edu.fpt.slot29.service;

import vn.edu.fpt.slot29.domain.Book;
import java.util.List;
import java.util.Optional;

public interface IBookService {
    Book createBook(Book book);
    Book getBook(Long id);
    Optional<Book> findBookByIsbn(String isbn);
    List<Book> getBooks();
}
