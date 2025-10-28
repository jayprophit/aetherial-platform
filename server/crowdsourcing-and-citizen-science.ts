import { getDb } from "./db";

export class CrowdsourcingAndCitizenScienceService {
  async createProject(userId: number, name: string, description: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "INSERT INTO crowdsourcing_projects (user_id, name, description) VALUES (?, ?, ?)",
      userId,
      name,
      description
    );
    return result;
  }

  async getProject(projectId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const project = await db.get(
      "SELECT * FROM crowdsourcing_projects WHERE id = ?",
      projectId
    );
    return project;
  }

  async getProjects() {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const projects = await db.all(
      "SELECT * FROM crowdsourcing_projects"
    );
    return projects;
  }

  async submitData(userId: number, projectId: number, data: any) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "INSERT INTO crowdsourcing_data (user_id, project_id, data) VALUES (?, ?, ?)",
      userId,
      projectId,
      JSON.stringify(data)
    );
    return result;
  }

  async getProjectData(projectId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const data = await db.all(
      "SELECT * FROM crowdsourcing_data WHERE project_id = ?",
      projectId
    );
    return data;
  }
}

