import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { users, userRoles, roles, rolePermissions, permissions } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
      const userRoleLinks = await db.select().from(userRoles).where(eq(userRoles.userId, req.user.userId));
      const roleIds = userRoleLinks.map(link => link.roleId);

      if (roleIds.length === 0) {
        return res.status(403).json({ success: false, message: "Forbidden: No roles assigned" });
      }

      const rolePermissionLinks = await db.select().from(rolePermissions).where(inArray(rolePermissions.roleId, roleIds));
      const permissionIds = rolePermissionLinks.map(link => link.permissionId);

      if (permissionIds.length === 0) {
        return res.status(403).json({ success: false, message: "Forbidden: No permissions assigned to roles" });
      }

      const userPermissions = await db.select().from(permissions).where(inArray(permissions.id, permissionIds));
      const hasPermission = userPermissions.some(p => p.name === requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ success: false, message: "Internal server error during permission check" });
    }
  };
};
