-- =====================================================================
-- SBA301 Lab 07 - LibraryDB Verification Script
-- Safe Read-Only Verification for Tables, Constraints, and Existing Data
-- =====================================================================

USE LibraryDB;
GO

PRINT '=== 1. VERIFY BASE TABLES ===';
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
ORDER BY table_name;
GO

PRINT '=== 2. VERIFY STUDENTS TABLE SCHEMA & DATA ===';
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'STUDENTS'
ORDER BY ORDINAL_POSITION;

SELECT id, email, first_name, last_name, marks, password
FROM STUDENTS;
GO

PRINT '=== 3. VERIFY BOOKS TABLE SCHEMA & DATA ===';
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'BOOKS'
ORDER BY ORDINAL_POSITION;

SELECT id, isbn, title, author
FROM BOOKS;
GO

PRINT '=== 4. VERIFY JOIN TABLE (students_books) & FOREIGN KEYS ===';
SELECT
    fk.name AS FK_name,
    tp.name AS parent_table,
    cp.name AS parent_column,
    tr.name AS referenced_table,
    cr.name AS referenced_column
FROM sys.foreign_keys fk
INNER JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
INNER JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id
INNER JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
INNER JOIN sys.columns cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id
INNER JOIN sys.columns cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id
WHERE tp.name IN ('students_books', 'STUDENT_BOOKS');

SELECT student_id, book_id
FROM students_books;
GO
