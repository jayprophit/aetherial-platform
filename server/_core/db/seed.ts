import { db } from './index';
import { sql } from 'drizzle-orm';
import { users, roles, permissions, userRoles, rolePermissions } from './schema';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Config } from '../config';
import logger from '../utils/logger';

// Default admin user credentials
const ADMIN_EMAIL = 'admin@aetherial.com';
const ADMIN_PASSWORD = 'ChangeMe123!';

// Available permissions
const PERMISSIONS = [
  // User permissions
  'user:create',
  'user:read',
  'user:update',
  'user:delete',
  
  // Role permissions
  'role:create',
  'role:read',
  'role:update',
  'role:delete',
  
  // Post permissions
  'post:create',
  'post:read',
  'post:update',
  'post:delete',
  
  // Comment permissions
  'comment:create',
  'comment:read',
  'comment:update',
  'comment:delete',
  
  // Admin permissions
  'admin:access',
  'admin:manage_users',
  'admin:manage_roles',
  'admin:manage_content',
  'admin:manage_settings',
];

// Default roles and their permissions
const ROLES = [
  {
    name: 'admin',
    description: 'Administrator with full access',
    permissions: [...PERMISSIONS],
  },
  {
    name: 'moderator',
    description: 'Moderator with content management access',
    permissions: [
      'user:read',
      'post:read',
      'post:update',
      'post:delete',
      'comment:read',
      'comment:update',
      'comment:delete',
    ],
  },
  {
    name: 'user',
    description: 'Regular user',
    permissions: [
      'user:read',
      'post:create',
      'post:read',
      'post:update:own',
      'post:delete:own',
      'comment:create',
      'comment:read',
      'comment:update:own',
      'comment:delete:own',
    ],
  },
  {
    name: 'guest',
    description: 'Unauthenticated user',
    permissions: [
      'user:read',
      'post:read',
      'comment:read',
    ],
  },
];

// Create default admin user
async function createAdminUser() {
  try {
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, ADMIN_EMAIL),
    });

    if (existingAdmin) {
      logger.info('Admin user already exists');
      return existingAdmin.id;
    }

    const hashedPassword = await hash(ADMIN_PASSWORD, 12);
    const [admin] = await db.insert(users).values({
      id: uuidv4(),
      email: ADMIN_EMAIL,
      username: 'admin',
      displayName: 'Administrator',
      password: hashedPassword,
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    logger.info('Admin user created');
    return admin.id;
  } catch (error) {
    logger.error('Error creating admin user:', error);
    throw error;
  }
}

// Create default roles
async function createRoles() {
  const roleMap: Record<string, string> = {};
  
  for (const roleData of ROLES) {
    const [role] = await db.insert(roles)
      .values({
        id: uuidv4(),
        name: roleData.name,
        description: roleData.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: roles.name,
        set: {
          description: roleData.description,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    roleMap[roleData.name] = role.id;
  }
  
  return roleMap;
}

// Create permissions
async function createPermissions() {
  const permissionMap: Record<string, string> = {};
  
  for (const permissionName of PERMISSIONS) {
    const [permission] = await db.insert(permissions)
      .values({
        id: uuidv4(),
        name: permissionName,
        description: `${permissionName.replace(':', ' ')} permission`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: permissions.name,
        set: {
          updatedAt: new Date(),
        },
      })
      .returning();
    
    permissionMap[permissionName] = permission.id;
  }
  
  return permissionMap;
}

// Assign permissions to roles
async function assignPermissions(roleMap: Record<string, string>, permissionMap: Record<string, string>) {
  for (const roleData of ROLES) {
    const roleId = roleMap[roleData.name];
    
    for (const permissionName of roleData.permissions) {
      const permissionId = permissionMap[permissionName];
      
      if (!permissionId) {
        logger.warn(`Permission not found: ${permissionName}`);
        continue;
      }
      
      await db.insert(rolePermissions)
        .values({
          id: uuidv4(),
          roleId,
          permissionId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();
    }
  }
}

// Assign admin role to admin user
async function assignAdminRole(userId: string, roleMap: Record<string, string>) {
  const adminRoleId = roleMap['admin'];
  
  if (!adminRoleId) {
    throw new Error('Admin role not found');
  }
  
  await db.insert(userRoles)
    .values({
      id: uuidv4(),
      userId,
      roleId: adminRoleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoNothing();
}

// Main seed function
export async function seed() {
  try {
    logger.info('Starting database seeding...');
    
    // Create permissions first
    const permissionMap = await createPermissions();
    logger.info(`Created/updated ${Object.keys(permissionMap).length} permissions`);
    
    // Create roles
    const roleMap = await createRoles();
    logger.info(`Created/updated ${Object.keys(roleMap).length} roles`);
    
    // Assign permissions to roles
    await assignPermissions(roleMap, permissionMap);
    logger.info('Assigned permissions to roles');
    
    // Create admin user
    const adminUserId = await createAdminUser();
    
    // Assign admin role to admin user
    await assignAdminRole(adminUserId, roleMap);
    logger.info('Assigned admin role to admin user');
    
    logger.info('Database seeding completed successfully');
    
    // Log admin credentials (only in development)
    if (Config.env === 'development') {
      logger.info('\n=== ADMIN CREDENTIALS ===');
      logger.info(`Email: ${ADMIN_EMAIL}`);
      logger.info(`Password: ${ADMIN_PASSWORD}`);
      logger.info('========================\n');
    }
    
    return {
      adminUser: {
        email: ADMIN_EMAIL,
        password: Config.env === 'development' ? ADMIN_PASSWORD : '*****',
      },
      roles: Object.keys(roleMap),
      permissions: Object.keys(permissionMap),
    };
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding database:', error);
      process.exit(1);
    });
}

export default seed;
