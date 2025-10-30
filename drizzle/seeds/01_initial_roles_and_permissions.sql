-- Insert default roles
INSERT INTO roles (name, description) VALUES 
  ('admin', 'Administrator with full access to the system'),
  ('moderator', 'Moderator with elevated permissions'),
  ('user', 'Regular authenticated user'),
  ('guest', 'Unauthenticated user')
ON CONFLICT (name) DO NOTHING;

-- Insert common permissions
INSERT INTO permissions (name, description) VALUES
  -- User permissions
  ('user:create', 'Create new users'),
  ('user:read', 'View user profiles'),
  ('user:update', 'Update user information'),
  ('user:delete', 'Delete users'),
  
  -- Role permissions
  ('role:create', 'Create new roles'),
  ('role:read', 'View roles'),
  ('role:update', 'Update roles'),
  ('role:delete', 'Delete roles'),
  ('role:assign', 'Assign roles to users'),
  
  -- Content permissions
  ('content:create', 'Create content'),
  ('content:read', 'View content'),
  ('content:update', 'Update content'),
  ('content:delete', 'Delete content'),
  
  -- Admin permissions
  ('admin:access', 'Access admin dashboard'),
  ('admin:settings', 'Modify system settings'),
  ('admin:audit', 'View audit logs'),
  
  -- Authentication permissions
  ('auth:login', 'Log in to the system'),
  ('auth:register', 'Register new account'),
  ('auth:reset-password', 'Reset password'),
  ('auth:verify-email', 'Verify email address'),
  ('auth:2fa', 'Use two-factor authentication')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to admin role
WITH admin_role AS (
  SELECT id FROM roles WHERE name = 'admin' LIMIT 1
),
admin_permissions AS (
  SELECT id FROM permissions
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT admin_role.id, admin_permissions.id
FROM admin_role, admin_permissions
ON CONFLICT DO NOTHING;

-- Assign basic permissions to user role
WITH user_role AS (
  SELECT id FROM roles WHERE name = 'user' LIMIT 1
),
user_permissions AS (
  SELECT id FROM permissions 
  WHERE name IN (
    'user:read', 'user:update',
    'content:create', 'content:read', 'content:update', 'content:delete',
    'auth:login', 'auth:register', 'auth:reset-password', 'auth:verify-email', 'auth:2fa'
  )
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT user_role.id, user_permissions.id
FROM user_role, user_permissions
ON CONFLICT DO NOTHING;

-- Assign guest permissions
WITH guest_role AS (
  SELECT id FROM roles WHERE name = 'guest' LIMIT 1
),
guest_permissions AS (
  SELECT id FROM permissions 
  WHERE name IN (
    'user:create', 'auth:login', 'auth:register', 'auth:reset-password'
  )
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT guest_role.id, guest_permissions.id
FROM guest_role, guest_permissions
ON CONFLICT DO NOTHING;

-- Create initial admin user (password will be hashed in the application)
-- Default password: ChangeMe123!
INSERT INTO users (
  email, 
  username, 
  password_hash, 
  display_name, 
  is_verified,
  created_at,
  updated_at
) VALUES (
  'admin@aetherial.example',
  'admin',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'ChangeMe123!'
  'System Administrator',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Assign admin role to the admin user
WITH admin_user AS (
  SELECT id FROM users WHERE email = 'admin@aetherial.example' LIMIT 1
),
admin_role AS (
  SELECT id FROM roles WHERE name = 'admin' LIMIT 1
)
INSERT INTO user_roles (user_id, role_id)
SELECT admin_user.id, admin_role.id
FROM admin_user, admin_role
ON CONFLICT DO NOTHING;
