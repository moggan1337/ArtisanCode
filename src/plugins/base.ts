export interface Plugin {
  name: string;
  version: string;
  description?: string;
  tools?: string[];
  providers?: string[];
  hooks?: Record<string, Function>;
  onLoad?: () => Promise<void> | void;
  onUnload?: () => Promise<void> | void;
}

export interface PluginContext {
  cwd: string;
  config: Record<string, any>;
}
