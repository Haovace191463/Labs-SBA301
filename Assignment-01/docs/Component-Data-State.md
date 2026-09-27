# Component, Data and State Sketch

## 1. Component Structure

App
├── LoginPage
│   └── Login Form
│
└── Admin Layout
├── Header
│   ├── FUNews Logo
│   ├── Current Username
│   └── Logout Button
│
├── Sidebar
│   ├── Dashboard
│   ├── Categories
│   ├── News
│   ├── Users
│   └── Settings
│
└── Main Content
├── DashboardPage
├── CategoryManagement
├── NewsManagement
├── UserManagement
└── SettingsPage


## 2. Data Structure

The application uses mock JavaScript data stored in the src/data folder.

src/data
├── categories.js
├── news.js
└── users.js


### Categories

Category
├── id
├── name
└── status


### News

News
├── id
├── title
├── content
├── categoryId
├── createdBy
├── status
└── tags

The categoryId field connects a news item with a category.


### Users

User
├── id
├── username
├── password
├── role
└── status

Role values:

1 = Admin
2 = Staff

Status values:

1 = Active
0 = Inactive


## 3. React State

The management pages use React useState to manage their data.

Example:

const [categories, setCategories] = useState(initialCategories);

The current list is stored in component state.

Forms also use state to store:

- Search keyword
- Form data
- Create / Update mode
- Validation errors
- Delete confirmation


## 4. Data Flow

### Login

User enters username/password
↓
LoginPage
↓
Validate credentials
↓
App stores currentUser
↓
Admin Layout is displayed


### Navigation

Sidebar
↓
onNavigate()
↓
App updates activePage
↓
Corresponding page is rendered


### CRUD

User action
↓
Management Component
↓
React state update
↓
UI re-renders

For example:

Create Category
↓
Validate form
↓
setCategories(...)
↓
New category appears in table


### News - Category Relationship

News.categoryId
↓
Find matching category.id
↓
Display category.name


## 5. State Management Principle

The application updates arrays immutably instead of directly modifying the original state.

Examples:

setCategories([...categories, newCategory]);

setCategories(
categories.map((category) =>
category.id === updatedCategory.id
? updatedCategory
: category
)
);

setCategories(
categories.filter((category) => category.id !== id)
);

This allows React to detect state changes and re-render the interface correctly.


## 6. Search Flow

Search does not replace the original data.

Original State
↓
Search Keyword
↓
Filter Data
↓
Display Filtered Results

The original state remains available for later CRUD operations.


## 7. Dialog Flow

Create and Update use the same management dialog.


### Create

Click Create
↓
Open Dialog
↓
Empty Form
↓
Validate
↓
Add New Data


### Update

Click Update
↓
Open Dialog
↓
Load Existing Data
↓
Validate
↓
Replace Existing Data


### Delete

Click Delete
↓
Confirmation
↓
Confirm → Remove Data
Cancel  → Keep Data