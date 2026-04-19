import * as fs from 'fs/promises';
import * as path from 'path';
import { Plugin, PluginContext } from './base.js';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context: PluginContext;
  
  constructor(context: PluginContext) {
    this.context = context;
  }
  
  async loadFromDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const pluginPath = path.join(dirPath, entry.name);
          await this.loadPlugin(pluginPath);
        }
      }
    } catch (error) {
      console.error('Failed to load plugins:', error);
    }
  }
  
  async loadPlugin(pluginPath: string): Promise<void> {
    try {
      const manifestPath = path.join(pluginPath, 'plugin.json');
      
      let manifest: any;
      try {
        const content = await fs.readFile(manifestPath, 'utf-8');
        manifest = JSON.parse(content);
      } catch {
        console.warn(`No plugin.json found at ${pluginPath}`);
        return;
      }
      
      const mainPath = path.join(pluginPath, manifest.main || 'index.js');
      const plugin = await import(mainPath);
      
      if (plugin.default?.onLoad) {
        await plugin.default.onLoad();
      }
      
      this.plugins.set(manifest.name, plugin.default || manifest);
      console.log(`Loaded plugin: ${manifest.name}@${manifest.version}`);
      
    } catch (error) {
      console.error(`Failed to load plugin from ${pluginPath}:`, error);
    }
  }
  
  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }
  
  list(): Plugin[] {
    return [...this.plugins.values()];
  }
  
  async unload(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (plugin?.onUnload) {
      await plugin.onUnload();
    }
    this.plugins.delete(name);
  }
}
