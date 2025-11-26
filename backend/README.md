Backend (Express + MSSQL) - Woods International Report Panel

Environment variables (create a file named .env in this folder using the keys below):

PORT=4000

# Woods International database
WOODS_INTERNATIONAL_SERVER=103.127.31.218
WOODS_INTERNATIONAL_PORT=1433
WOODS_INTERNATIONAL_USER=woodsoft
WOODS_INTERNATIONAL_PASSWORD=Woods#3434
WOODS_INTERNATIONAL_DATABASE=ud_woodsoft

Scripts:
- npm run start – starts the API on PORT
- node test-connection.js – tests database connection and verifies stored procedures

Endpoints:
- GET /health – health check
- GET /api/store – get Woods International info
- POST /api/exec – body: { procedure: "sp_name", params: { key: value } }
- POST /api/query – body: { query: "SELECT * FROM table", params: { key: value } }
- GET /api/dashboard – Returns dashboard data from Woods International database

Example requests:

```json
POST /api/exec
{
  "procedure": "proc_SalesSummary",
  "params": {
    "StartDate": "2025-01-01",
    "EndDate": "2025-01-31"
  }
}
```

```json
POST /api/query
{
  "query": "SELECT * FROM Products WHERE Category = @Category",
  "params": {
    "Category": "Electronics"
  }
}
```


