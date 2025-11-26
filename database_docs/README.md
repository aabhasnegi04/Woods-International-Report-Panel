# Woods International Report Panel - Database Documentation

## 📋 Database: `ud_woodsoft`

**Server:** 103.127.31.218:1433  
**Login:** woodsoft  
**Password:** Woods#3434

---

## 🗄️ Tables

### **ReportPanelUsers**
User authentication table for report panel access.

| Column | Type | Description |
|--------|------|-------------|
| UserID | INT (PK) | Auto-increment user ID |
| Username | NVARCHAR(50) | Unique username |
| Password | NVARCHAR(255) | User password (plain text) |
| Role | NVARCHAR(50) | User role (Admin, Manager, Viewer) |
| IsActive | BIT | Active status (1=active, 0=inactive) |
| CreatedDate | DATETIME | Account creation date |
| LastLoginDate | DATETIME | Last successful login |

**Index:** `IX_ReportPanelUsers_Username` on Username column

---

## 📝 Stored Procedures

### **proc_logindone**
Authenticates user and returns user data.

**Parameters:**
- `@usrname` (NVARCHAR(50)) - Username
- `@passw` (NVARCHAR(255)) - Password

**Returns:**
- User record if credentials valid and account active
- Empty recordset if invalid credentials or inactive account

**Example:**
```sql
EXEC proc_logindone @usrname = 'admin', @passw = 'admin123';
```

---

## 🚀 Setup Instructions

### 1. Connect to Database
```
Server: 103.127.31.218,1433
Database: ud_woodsoft
Login: woodsoft
Password: Woods#3434
```

### 2. Run Scripts in Order
1. Execute `01_create_users_table.sql`
2. Execute `02_create_login_procedure.sql`

### 3. Test Login
```sql
EXEC proc_logindone @usrname = 'admin', @passw = 'admin123';
```

---

## 👤 Default User

| Username | Password | Role | Status |
|----------|----------|------|--------|
| admin | admin123 | Admin | Active |

⚠️ **Change password after first login!**

### Roles
- **Admin** - Full access to all reports and settings
- **Manager** - Access to all reports (future implementation)
- **Viewer** - Read-only access to reports (future implementation)

---

## 🔧 User Management

### Add New User
```sql
INSERT INTO ReportPanelUsers (Username, Password, Role, IsActive)
VALUES ('newuser', 'password123', 'Viewer', 1);
```

### Change Password
```sql
UPDATE ReportPanelUsers
SET Password = 'newpassword'
WHERE Username = 'admin';
```

### Deactivate User
```sql
UPDATE ReportPanelUsers
SET IsActive = 0
WHERE Username = 'olduser';
```

### View All Users
```sql
SELECT * FROM ReportPanelUsers;
```

---

## 🔐 Security Notes

- Passwords stored in **plain text** (not recommended for production)
- Consider implementing password hashing for production use
- Change default password immediately
- Role-based access control to be implemented in future

---

**Version:** 1.0.0  
**Last Updated:** November 25, 2025
