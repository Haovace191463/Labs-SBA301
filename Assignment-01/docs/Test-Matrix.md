# SBA301 Assignment 01 - Test Matrix

## Test Environment

- Project: FUNews Management System
- Frontend: ReactJS + Vite
- Browser: Google Chrome
- Test Account:
    - Username: Admin
    - Password: 123456

## Authentication and Layout

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC01 | Login with valid credentials | User enters Dashboard | As expected | PASS |
| TC02 | Login with invalid password | Error message is displayed | As expected | PASS |
| TC03 | Login with empty fields | Validation message is displayed | As expected | PASS |
| TC04 | Check header and sidebar | Logo, user information, logout and menus are displayed | As expected | PASS |
| TC05 | Navigate between menus | Correct page is displayed | As expected | PASS |

## Category Management

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC06 | Search category | Matching categories are displayed | As expected | PASS |
| TC07 | Create category | New category is added | As expected | PASS |
| TC08 | Create category with empty name | Validation prevents creation | As expected | PASS |
| TC09 | Create duplicate category | Duplicate category is rejected | As expected | PASS |
| TC10 | Update category | Category information is updated | As expected | PASS |
| TC11 | Delete category | Confirmation appears and category is deleted | As expected | PASS |

## News Management

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC12 | Search news | Matching news is displayed | As expected | PASS |
| TC13 | Create news | New news is added | As expected | PASS |
| TC14 | Create news with empty required fields | Validation prevents creation | As expected | PASS |
| TC15 | Create duplicate news | Duplicate title is rejected | As expected | PASS |
| TC16 | Update news | News information is updated | As expected | PASS |
| TC17 | Check news-category relation | Correct category is displayed | As expected | PASS |
| TC18 | Delete news | Confirmation appears and news is deleted | As expected | PASS |

## User Management

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC19 | Search user | Matching user is displayed | As expected | PASS |
| TC20 | Create user | New user is added | As expected | PASS |
| TC21 | Create user with empty required fields | Validation prevents creation | As expected | PASS |
| TC22 | Create duplicate username | Duplicate username is rejected | As expected | PASS |
| TC23 | Update user | Role and status are updated | As expected | PASS |
| TC24 | Delete user | Confirmation appears and user is deleted | As expected | PASS |

## Settings

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC25 | Open Settings | Settings page is displayed | As expected | PASS |
| TC25.1 | Change language preference | Selection can be changed | As expected | PASS |
| TC25.2 | Change notification preference | Setting can be toggled | As expected | PASS |
| TC25.3 | Save settings | Success message is displayed | As expected | PASS |

## Edge Cases

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC26 | Search with no result | No-result message is displayed | As expected | PASS |
| TC27 | Cancel delete confirmation | Data remains unchanged | As expected | PASS |
| TC28 | Cancel create dialog | No new data is created | As expected | PASS |
| TC29 | Cancel update dialog | Original data remains unchanged | As expected | PASS |
| TC30 | Check active/inactive status | Status is displayed correctly | As expected | PASS |

## Technical Verification

| Check | Command | Result | Status |
|---|---|---|---|
| ESLint | `npm run lint` | No ESLint errors | PASS |
| Production Build | `npm run build` | Build completed successfully | PASS |
| Preview | `npm run preview` | Application runs successfully | PASS |

## Overall Result

All planned functional and technical test cases passed.

The application was tested for authentication, navigation, CRUD operations,
search, validation, dialogs, delete confirmation, status handling,
data relationships, edge cases, linting, and production build.