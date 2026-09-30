# SBA301 Slot 09 - Fetching, Caching & React Data

## 1. Student Information

- Name: Võ Anh Hào
- Student ID: CE191463
- Course: SBA301
- Slot: 09

## 2. Project Overview

This project practices asynchronous data handling in React, including:

- Promise and async/await
- Fetch API
- Axios
- Loading/Error/Data states
- HTTP cache
- AbortController
- Race conditions

The project also includes a Mini Project: User List Data Client.

## 3. How to Run

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

Check code quality:

```bash
npm run lint
```

Build the project:

```bash
npm run build
```

## 4. Exercises

The project contains 10 exercises:

1. Async Trace
2. Promise Creation
3. Promise Composition
4. async/await
5. Fetch GET
6. Fetch POST
7. Axios
8. HTTP Cache
9. React State Machine
10. Race Condition + AbortController

## 5. Mini Project - User List Data Client

The Mini Project loads users from:

```text
https://jsonplaceholder.typicode.com/users
```

### Features

- Loading state
- Error state
- Success/Data state
- Empty state
- Search by name or email
- Reload
- Retry
- AbortController
- Application-level cache

### Service Layer

API logic is separated into:

```text
src/mini-project/userApi.js
```

The main UI is implemented in:

```text
src/mini-project/UserListDataClient.jsx
```

## 6. Cache Policy

The Mini Project uses `sessionStorage` for application-level caching.

```text
Cache Key: slot9-users-cache
TTL: 30 seconds
```

- Cache HIT → use fresh cached data
- Cache MISS → request data from API
- Reload → bypass cache and request fresh data

## 7. Fetch vs Axios

The Mini Project uses native Fetch.

Axios is practiced separately in Exercise 7 for comparison.

Fetch is used because the Mini Project only requires:

- GET requests
- JSON parsing
- HTTP status checking
- AbortController cancellation

## 8. Evidence

Evidence is stored in the `evidence/` folder.

| Evidence | Description |
|---|---|
| E02 | Async Trace |
| E03 | Promise Exercise |
| E04 | Fetch Network |
| E05 | Axios Comparison |
| E06 | Loading/Error/Data |
| E07 | Abort/Race |
| E08 | HTTP Cache |
| E10 | Mini Project |

## 9. Test Matrix

| ID | Test Case | Expected Result | Status |
|---|---|---|---|
| TC01 | Open application | App loads successfully | PASS |
| TC02 | Fetch GET | 10 users displayed | PASS |
| TC03 | Fetch POST | POST response displayed | PASS |
| TC04 | Axios GET | Users displayed | PASS |
| TC05 | Promise resolve | Promise resolves successfully | PASS |
| TC06 | Promise reject | Error is displayed | PASS |
| TC07 | Search valid user | Matching users displayed | PASS |
| TC08 | Search no result | Empty state displayed | PASS |
| TC09 | Reload | New API request is created | PASS |
| TC10 | Abort/Race | Old request is aborted | PASS |
| TC11 | Cache HIT | Cached data is reused | PASS |
| TC12 | Cache MISS | API request is sent | PASS |
| TC13 | HTTP error | Error state is displayed | PASS |
| TC14 | Loading state | Loading UI is displayed | PASS |

## 10. Project Structure

```text
slot9/
├── src/
│   ├── exercises/
│   │   ├── AsyncTrace.jsx
│   │   ├── PromiseCreation.jsx
│   │   ├── PromiseComposition.jsx
│   │   ├── AsyncAwait.jsx
│   │   ├── FetchGet.jsx
│   │   ├── FetchPost.jsx
│   │   ├── AxiosDemo.jsx
│   │   ├── HttpCache.jsx
│   │   ├── ReactStateMachine.jsx
│   │   └── RaceCondition.jsx
│   ├── mini-project/
│   │   ├── userApi.js
│   │   └── UserListDataClient.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── evidence/
├── README.md
└── package.json
```

## 11. Reflection and Quality Checklist

### What I learned

1. Fetch and Promise are asynchronous operations.
2. React state controls the UI during the request lifecycle.
3. AbortController helps handle request cancellation and race conditions.
4. Application-level caching can reduce unnecessary API requests.

### Hardest Problem

The hardest part was understanding race conditions and why an old request should be cancelled when a newer request starts.

### Quality Checklist

- [x] 10 exercises completed
- [x] Fetch GET implemented
- [x] Fetch POST implemented
- [x] Axios practiced
- [x] Loading state implemented
- [x] Error state implemented
- [x] Empty state implemented
- [x] Search implemented
- [x] Reload implemented
- [x] Retry implemented
- [x] AbortController implemented
- [x] Race condition handled
- [x] HTTP cache practiced
- [x] Application-level cache implemented
- [x] Cache TTL implemented
- [x] Evidence captured
- [x] Test matrix completed
