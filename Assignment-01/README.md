# SBA301 Assignment 01 - FUNews Management System

## Student Information

- Student: Võ Anh Hào
- Class: CE191463
- Project: FUNews Management System
- Frontend: ReactJS + Vite
- Data: Mock data managed with React state

## Project Description

FUNews Management System is a ReactJS application for managing categories,
news articles, and user accounts.

The application demonstrates React components, state management, form
validation, search, CRUD operations, create/update dialogs, delete
confirmation, and basic layout navigation.

## Main Features

### Authentication

- Login with mock credentials
- Username: `Admin`
- Password: `Admin`
- Logout

### Dashboard

- Display total categories
- Display active categories
- Display total news
- Display active news
- Display administrator users
- Display recent news

### Category Management

- View category list
- Search categories
- Create category
- Update category
- Delete category
- Validate required fields
- Prevent duplicate category names
- Display active/inactive status

### News Management

- View news list
- Search news by title
- Create news
- Update news
- Delete news
- Select category
- Manage status
- Manage tags
- Validate required fields
- Prevent duplicate news titles

### User Management

- View user accounts
- Search users by username
- Create user
- Update user
- Delete user
- Select Admin/Staff role
- Select Active/Inactive status
- Validate username and password
- Prevent duplicate usernames

### Settings

- Display current account information
- Manage basic system preferences

### AI-generated Logo

The application uses an AI-generated FUNews logo in the application header.

## Project Structure

```text
src/
├── components/
│   ├── common/
│   └── layout/
│       ├── Header.jsx
│       └── Sidebar.jsx
│
├── data/
│   ├── categories.js
│   ├── news.js
│   └── users.js
│
├── pages/
│   ├── Categories/
│   │   └── CategoryManagement.jsx
│   ├── Dashboard/
│   │   └── DashboardPage.jsx
│   ├── Login/
│   │   └── LoginPage.jsx
│   ├── News/
│   │   └── NewsManagement.jsx
│   ├── Settings/
│   │   └── SettingsPage.jsx
│   └── Users/
│       └── UserManagement.jsx
│
├── assets/
│   └── funews-logo.png
│
├── App.jsx
├── index.css
└── main.jsx
```
## Installation

Install the project dependencies:

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Production Preview

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Test Account

```text
Username: Admin
Password: Admin
```

## Data Handling

The project uses mock JavaScript data files and React state.

CRUD operations are performed on the frontend during the current application
session. No backend API or database is required for this assignment.

The initial mock data is loaded again when a management page is recreated.

## Validation and Error Handling

The application includes:

- Required field validation
- Duplicate category name validation
- Duplicate news title validation
- Duplicate username validation
- Search with no-result handling
- Delete confirmation
- Active/inactive status
- Admin/Staff role selection

## Verification

The project has been verified with:

```bash
npm run lint
npm run build
npm run preview
```

The application was also manually tested for:

- Login
- Navigation
- Category CRUD
- News CRUD
- User CRUD
- Search
- Form validation
- Create/update dialogs
- Delete confirmation
- Empty search results