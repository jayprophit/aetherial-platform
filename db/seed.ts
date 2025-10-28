import { getDb } from "../server/db";
import { dbStore } from "../server/in-memory-db";

function main() {
  console.log("Seeding in-memory database...");

  const db = getDb();

  // Clear existing data
  dbStore.roles = [];
  dbStore.permissions = [];
  dbStore.rolePermissions = [];
  dbStore.userRoles = [];
  console.log("Cleared existing RBAC data.");

  // Create roles
  console.log("Creating roles...");
  db.insert("roles").values([
    { id: 1, name: "User" },
    { id: 2, name: "Moderator" },
    { id: 3, name: "Admin" },
    { id: 4, name: "Owner" },
  ]);
  const allRoles = db.select().from("roles").all();
  const userRole = allRoles.find(r => r.name === "User")!;
  const moderatorRole = allRoles.find(r => r.name === "Moderator")!;
  const adminRole = allRoles.find(r => r.name === "Admin")!;
  const ownerRole = allRoles.find(r => r.name === "Owner")!;
  console.log("Roles created.");

  // Create permissions
  console.log("Creating permissions...");
  const permissionNames = [
    "post:create", "post:edit:own", "post:delete:own",
    "comment:create", "comment:edit:own", "comment:delete:own",
    "profile:edit:own", "post:edit:any", "post:delete:any",
    "comment:edit:any", "comment:delete:any", "user:view:basic",
    "user:edit:any", "user:delete:any", "user:view:full",
    "audit:view", "dashboard:view", "order:view:any", "order:edit:any",
    "analytics:view", "post:view:any"
  ];
  db.insert("permissions").values(permissionNames.map((name, i) => ({ id: i + 1, name })));
  const allPermissions = db.select().from("permissions").all();
  console.log("Permissions created.");

  const permissionMap = new Map(allPermissions.map(p => [p.name, p.id]));

  const userPerms = ["post:create", "post:edit:own", "post:delete:own", "comment:create", "comment:edit:own", "comment:delete:own", "profile:edit:own"];
  const moderatorPerms = [...userPerms, "post:edit:any", "post:delete:any", "comment:edit:any", "comment:delete:any", "user:view:basic", "post:view:any"];
  const adminPerms = [...moderatorPerms, "user:edit:any", "user:delete:any", "user:view:full", "audit:view", "dashboard:view", "order:view:any", "order:edit:any", "analytics:view"];
  const ownerPerms = [...adminPerms];

  // Assign permissions to roles
  console.log("Assigning permissions to roles...");
  db.insert("rolePermissions").values([
    ...userPerms.map(name => ({ roleId: userRole.id, permissionId: permissionMap.get(name)! })),
    ...moderatorPerms.map(name => ({ roleId: moderatorRole.id, permissionId: permissionMap.get(name)! })),
    ...adminPerms.map(name => ({ roleId: adminRole.id, permissionId: permissionMap.get(name)! })),
    ...ownerPerms.map(name => ({ roleId: ownerRole.id, permissionId: permissionMap.get(name)! })),
  ]);
  console.log("Permissions assigned.");

  // Assign a default role to a dummy user for testing
  dbStore.users.push({ id: 1 });
  db.insert("userRoles").values([{ userId: 1, roleId: userRole.id }]);
  console.log("Assigned default role to dummy user.");

  console.log("In-memory database seeded successfully!");
}

main();
