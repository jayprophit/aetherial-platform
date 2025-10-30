# AETHERIAL Platform: Role-Based Access Control (RBAC) Strategy

**INCREMENT 109**

## 1. Overview

This document outlines the Role-Based Access Control (RBAC) strategy for the AETHERIAL platform. RBAC will provide a flexible and scalable way to manage user permissions, ensuring that users only have access to the resources and actions appropriate for their role.

## 2. Roles

The following roles will be implemented:

-   **User:** The default role for all registered users. Users can create content, interact with other users, and manage their own profile.
-   **Moderator:** Responsible for content moderation and community management. Moderators can edit or delete user-generated content that violates community guidelines.
-   **Admin:** Has broad access to manage the platform, including user management, content management, and viewing platform analytics.
-   **Owner:** The highest level of access. Owners can manage all aspects of the platform, including system configuration, billing, and assigning the Admin role.

## 3. Permissions

Permissions will be defined as specific actions that can be performed on a resource (e.g., `post:create`, `user:edit`, `audit:view`). Roles will be assigned a set of permissions.

### Example Permissions:

| Role      | Permissions                                                                                                                                                           |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User      | `post:create`, `post:edit:own`, `post:delete:own`, `comment:create`, `comment:edit:own`, `comment:delete:own`, `profile:edit:own`                                          |
| Moderator | All User permissions + `post:edit:any`, `post:delete:any`, `comment:edit:any`, `comment:delete:any`, `user:view:basic`                                                     |
| Admin     | All Moderator permissions + `user:edit:any`, `user:delete:any`, `user:view:full`, `audit:view`, `dashboard:view`                                                         |
| Owner     | All Admin permissions + `role:assign`, `system:config`, `billing:manage`                                                                                              |

## 4. Database Schema

The following tables will be added to the database to support RBAC:

-   `roles`: Stores the available roles (e.g., `user`, `moderator`).
-   `permissions`: Stores the available permissions (e.g., `post:create`).
-   `role_permissions`: Maps permissions to roles.
-   `user_roles`: Maps users to roles.

```sql
-- roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- permissions table
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL -- e.g., post:create
);

-- role_permissions table (many-to-many)
CREATE TABLE role_permissions (
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- user_roles table (many-to-many)
CREATE TABLE user_roles (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);
```

## 5. Implementation Plan

1.  **Database Migration:** Create a migration file to add the new RBAC tables to the database.
2.  **Seed Data:** Seed the `roles` and `permissions` tables with the initial data.
3.  **RBAC Middleware:** Create a middleware function that:
    -   Retrieves the user's roles from the database.
    -   Retrieves the permissions for those roles.
    -   Checks if the user has the required permission for the requested action.
4.  **Route Protection:** Apply the RBAC middleware to all relevant API routes.
5.  **Admin UI:** Create a UI for Admins/Owners to manage user roles.

