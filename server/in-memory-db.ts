interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
}

interface RolePermission {
  roleId: number;
  permissionId: number;
}

interface UserRole {
  userId: number;
  roleId: number;
}

// In-memory store
export const dbStore = {
  roles: [] as Role[],
  permissions: [] as Permission[],
  rolePermissions: [] as RolePermission[],
  userRoles: [] as UserRole[],
  users: [] as { id: number }[], // Simplified for this context
};

// Helper functions to mimic Drizzle's API
export const inMemoryDb = {
  insert: (table: keyof typeof dbStore) => ({
    values: (newValues: any[]) => {
      (dbStore[table] as any[]).push(...newValues);
      return { run: () => {} }; // Mock run()
    },
  }),
  select: (fields?: any) => ({
    from: (table: keyof typeof dbStore) => ({
      all: () => (dbStore[table] as any[]),
      where: (condition: (item: any) => boolean) => {
        return (dbStore[table] as any[]).filter(condition);
      },
    }),
  }),
  delete: (table: keyof typeof dbStore) => ({
      run: () => { (dbStore[table] as any[]) = []; } // Mock run()
  })
};
