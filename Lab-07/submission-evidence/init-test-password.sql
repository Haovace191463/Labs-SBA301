-- =====================================================================
-- SBA301 Lab 07 - Test Password Initialization Script
-- PURPOSE:
--   Initializes a default mock password for the test student account
--   (s29@fu.edu.vn) if it was previously NULL in the database.
-- NOTE ON CREDENTIALS:
--   The password 'password123' below is strictly a DEMO/TEST value
--   used for automated grading and manual student login testing.
--   It is NOT an administrative or personal credential.
-- SAFETY:
--   Does not alter student ID, name, marks, or existing relationships.
-- =====================================================================

USE LibraryDB;
GO

-- Set mock student demo password ('password123') if currently NULL or empty
UPDATE STUDENTS
SET password = 'password123'
WHERE email = 's29@fu.edu.vn'
  AND (password IS NULL OR password = '');
GO

-- Verify updated record (read-only verification)
SELECT id, email, first_name, last_name, marks, password
FROM STUDENTS
WHERE email = 's29@fu.edu.vn';
GO
