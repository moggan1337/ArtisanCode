import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs/promises';

export interface MCPServer {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export class MCPClient extends EventEmitter {
  private servers: Map<string, MCPServer> = new Map();
  private processes: Map<string, ChildProcess> = new Map();
  private tools: Map<string, MCPTool> = new Map();
  private resources: Map<string, MCPResource> = new Map();
  
  constructor() {
    super();
  }
  
  async addServer(name: string, server: MCPServer): Promise<void> {
    this.servers.set(name, server);
  }
  
  async addServerFromConfig(configPath: string): Promise<void> {
    const content = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(content);
    
    if (config.mcpServers) {
      for (const [name, server] of Object.entries(config.mcpServers)) {
        this.servers.set(name, server as MCPServer);
      }
    }
  }
  
  async initialize(): Promise<void> {
    console.log('Initializing MCP servers...');
    
    for (const [name, server] of this.servers) {
      await this.startServer(name, server);
    }
    
    console.log(`MCP: ${this.tools.size} tools, ${this.resources.size} resources available`);
  }
  
  private async startServer(name: string, server: MCPServer): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const proc = spawn(server.command, server.args, {
          env: { ...process.env, ...server.env },
          stdio: ['pipe', 'pipe', 'pipe']
        });
        
        this.processes.set(name, proc);
        
        proc.on('error', (err) => {
          console.error(`MCP server ${name} error:`, err.message);
          this.emit('error', { server: name, error: err });
        });
        
        proc.on('exit', (code) => {
          console.log(`MCP server ${name} exited with code ${code}`);
          this.emit('exit', { server: name, code });
        });
        
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  private sendRequest(proc: ChildProcess, request: any): void {
    if (proc.stdin) {
      proc.stdin.write(JSON.stringify(request) + '\n');
    }
  }
  
  listTools(): MCPTool[] {
    return [...this.tools.values()];
  }
  
  listResources(): MCPResource[] {
    return [...this.resources.values()];
  }
  
  async callTool(name: string, args: any): Promise<any> {
    const proc = [...this.processes.values()][0];
    if (!proc) {
      throw new Error('No MCP server running');
    }
    
    return new Promise((resolve, reject) => {
      const id = Date.now();
      
      const handler = (data: Buffer) => {
        const response = JSON.parse(data.toString());
        if (response.id === id) {
          if (proc.stdout) proc.stdout.off('data', handler);
          resolve(response.result);
        }
      };
      
      if (proc.stdout) {
        proc.stdout.on('data', handler);
      }
      
      this.sendRequest(proc, {
        jsonrpc: '2.0',
        id,
        method: 'tools/call',
        params: { name, arguments: args }
      });
      
      setTimeout(() => reject(new Error('MCP tool call timeout')), 30000);
    });
  }
  
  async readResource(uri: string): Promise<string> {
    const proc = [...this.processes.values()][0];
    if (!proc) {
      throw new Error('No MCP server running');
    }
    
    return new Promise((resolve, reject) => {
      const id = Date.now();
      
      const handler = (data: Buffer) => {
        const response = JSON.parse(data.toString());
        if (response.id === id) {
          if (proc.stdout) proc.stdout.off('data', handler);
          resolve(response.result);
        }
      };
      
      if (proc.stdout) {
        proc.stdout.on('data', handler);
      }
      
      this.sendRequest(proc, {
        jsonrpc: '2.0',
        id,
        method: 'resources/read',
        params: { uri }
      });
      
      setTimeout(() => reject(new Error('MCP resource read timeout')), 30000);
    });
  }
  
  stop(): void {
    for (const proc of this.processes.values()) {
      proc.kill();
    }
    this.processes.clear();
    this.servers.clear();
    this.tools.clear();
    this.resources.clear();
  }
}
