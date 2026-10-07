# Orchid REST API — API Contract Specification

## 1. Overview & General Conventions

- **Base URL:** `http://localhost:8080/api/orchids`
- **Data Interchange Format:** `application/json; charset=UTF-8`
- **Authentication:** None (Public Lab API)
- **Error Response Standard Format:**
  Every error payload returned by the API follows a consistent JSON format:
  ```json
  {
    "message": "<Error description>"
  }
  ```

---

## 2. Resource Endpoints

### 2.1 Get All Orchids

Retrieve a list of all orchids, or search orchids by name using an optional query parameter.

- **Method:** `GET`
- **Path:** `/api/orchids`
- **Query Parameters:**
  | Parameter | Type | Required | Description |
  |---|---|---|---|
  | `name` | `string` | No | Case-insensitive substring to filter by orchid name |

#### Request Examples
1. Get all:
   ```http
   GET /api/orchids HTTP/1.1
   Host: localhost:8080
   ```
2. Search by name:
   ```http
   GET /api/orchids?name=CATTLEYA HTTP/1.1
   Host: localhost:8080
   ```

#### Response Example (`200 OK`)
```json
[
  {
    "orchidID": 1,
    "orchidName": "SBA301 TCASE Cattleya Queen 20261007",
    "isNatural": true,
    "orchidDescription": "Test TC05 create Orchid with valid Cattleya category",
    "orchidCategory": {
      "categoryId": 1,
      "categoryName": "Cattleya"
    },
    "isAttractive": true,
    "orchidURL": "https://example.com/testcases/tc05-cattleya.jpg"
  }
]
```

- When no orchids match the search query, returns `200 OK` with an empty array `[]`.

---

### 2.2 Get Orchid by ID

Retrieve detailed information of a single orchid by its primary key.

- **Method:** `GET`
- **Path:** `/api/orchids/{id}`
- **Path Parameters:**
  | Parameter | Type | Required | Description |
  |---|---|---|---|
  | `id` | `integer (Long)` | Yes | The primary key `orchid_id` |

#### Request Example
```http
GET /api/orchids/1 HTTP/1.1
Host: localhost:8080
```

#### Response Examples
- **Status `200 OK`:**
  ```json
  {
    "orchidID": 1,
    "orchidName": "SBA301 TCASE Cattleya Queen 20261007",
    "isNatural": true,
    "orchidDescription": "Test TC05 create Orchid with valid Cattleya category",
    "orchidCategory": {
      "categoryId": 1,
      "categoryName": "Cattleya"
    },
    "isAttractive": true,
    "orchidURL": "https://example.com/testcases/tc05-cattleya.jpg"
  }
  ```
- **Status `404 Not Found`:**
  Empty body when the specified ID does not exist.

---

### 2.3 Create Orchid

Create a new orchid record associated with an existing category.

- **Method:** `POST`
- **Path:** `/api/orchids`
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "orchidName": "SBA301 TCASE Cattleya Queen 20261007",
  "isNatural": true,
  "orchidDescription": "Test TC05 create Orchid with valid Cattleya category",
  "orchidCategory": {
    "categoryId": 1
  },
  "isAttractive": true,
  "orchidURL": "https://example.com/testcases/tc05-cattleya.jpg"
}
```

#### Field Specifications & Validation Rules
| Field | Type | Mandatory | Validation / Rules |
|---|---|---|---|
| `orchidName` | `string` | Yes | Cannot be null, empty, or whitespace-only. Returns `400 Bad Request` if blank. |
| `isNatural` | `boolean` | No | Nullable |
| `orchidDescription`| `string` | No | Max 1000 characters |
| `orchidCategory` | `object` | Yes | Must contain `categoryId`. Returns `400 Bad Request` if missing. |
| `orchidCategory.categoryId` | `integer (Long)` | Yes | Must reference an existing category in database. Returns `400 Bad Request` if not found. |
| `isAttractive` | `boolean` | No | Nullable |
| `orchidURL` | `string` | No | Max 2048 characters |

#### Response Examples
- **Status `201 Created`:**
  ```json
  {
    "orchidID": 1,
    "orchidName": "SBA301 TCASE Cattleya Queen 20261007",
    "isNatural": true,
    "orchidDescription": "Test TC05 create Orchid with valid Cattleya category",
    "orchidCategory": {
      "categoryId": 1,
      "categoryName": "Cattleya"
    },
    "isAttractive": true,
    "orchidURL": "https://example.com/testcases/tc05-cattleya.jpg"
  }
  ```

- **Status `400 Bad Request` (Missing category):**
  ```json
  {
    "message": "categoryId is required"
  }
  ```

- **Status `400 Bad Request` (Invalid category):**
  ```json
  {
    "message": "Category not found: 99999999"
  }
  ```

- **Status `400 Bad Request` (Blank orchid name):**
  ```json
  {
    "message": "orchidName must not be blank"
  }
  ```

- **Status `400 Bad Request` (Malformed JSON):**
  ```json
  {
    "message": "Request body must contain valid JSON"
  }
  ```

---

### 2.4 Update Orchid

Perform a full update on an existing orchid, including modifying its relationship to a new category.

- **Method:** `PUT`
- **Path:** `/api/orchids/{id}`
- **Headers:** `Content-Type: application/json`

#### Request Body Example
```json
{
  "orchidName": "SBA301 TCASE Cattleya Queen Updated 20261007",
  "isNatural": false,
  "orchidDescription": "Test TC10 full update and category replacement",
  "orchidCategory": {
    "categoryId": 2
  },
  "isAttractive": false,
  "orchidURL": "https://example.com/testcases/tc10-updated.jpg"
}
```

#### Behavior & Transaction Rules
- The orchid primary key (`orchidID`) cannot be changed.
- If the orchid ID does not exist in the database, returns `404 Not Found` without creating any new orchid.
- If the referenced category does not exist, returns `400 Bad Request` with message `Category not found: <id>`. Transaction rollbacks ensure NO partial updates occur.
- If `orchidName` is blank, returns `400 Bad Request` with message mentioning `orchidName`. Original database state remains unchanged.

#### Response Examples
- **Status `200 OK`:**
  ```json
  {
    "orchidID": 1,
    "orchidName": "SBA301 TCASE Cattleya Queen Updated 20261007",
    "isNatural": false,
    "orchidDescription": "Test TC10 full update and category replacement",
    "orchidCategory": {
      "categoryId": 2,
      "categoryName": "Dendrobium"
    },
    "isAttractive": false,
    "orchidURL": "https://example.com/testcases/tc10-updated.jpg"
  }
  ```
- **Status `404 Not Found`:** (When Orchid ID does not exist)
- **Status `400 Bad Request`:** (When validation fails or category not found)

---

### 2.5 Delete Orchid

Delete an existing orchid by its ID.

- **Method:** `DELETE`
- **Path:** `/api/orchids/{id}`

#### Response Examples
- **Status `204 No Content`:**
  Empty body. The orchid was successfully deleted.
- **Status `404 Not Found`:**
  When no orchid exists with the given ID.

---

## 3. Summary of HTTP Status Codes

| Status Code | Meaning | Occurrences |
|---|---|---|
| `200 OK` | Request succeeded | `GET /api/orchids`, `GET /api/orchids/{id}`, `PUT /api/orchids/{id}` |
| `201 Created` | Resource created | `POST /api/orchids` |
| `204 No Content` | Succeeded with empty response body | `DELETE /api/orchids/{id}` |
| `400 Bad Request` | Client validation failure or malformed JSON | Blank name, missing category, invalid category ID, invalid JSON syntax |
| `404 Not Found` | Target resource does not exist | `GET /api/orchids/{missingId}`, `PUT /api/orchids/{missingId}`, `DELETE /api/orchids/{missingId}` |
