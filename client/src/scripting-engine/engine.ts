import { LuaFactory } from "lua.js";

export class ScriptingEngine {
  private lua: any;

  constructor() {
    this.lua = new LuaFactory().create();
  }

  runScript(script: string) {
    try {
      this.lua.doString(script);
    } catch (error) {
      console.error("Lua script error:", error);
    }
  }
}

