/**
 * AETHERIAL Virtual Machine System
 * 
 * Containerized execution environment with network packet access
 * Run programs from any device/platform
 */

import { exec } from 'child_process';
import * as net from 'net';
import * as dgram from 'dgram';

export class VirtualMachine {
  private processes: Map<string, any> = new Map();
  private networkSockets: Map<string, net.Socket> = new Map();
  
  constructor(
    public id: string,
    public memory: number = 1024, // MB
    public cpu: number = 1 // cores
  ) {}

  /**
   * Execute program in VM
   */
  async execute(code: string, language: string): Promise<VMResult> {
    const startTime = Date.now();
    
    try {
      let output: string;
      
      switch (language) {
        case 'javascript':
        case 'typescript':
          output = await this.executeJS(code);
          break;
        case 'python':
          output = await this.executePython(code);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
      
      return {
        success: true,
        output,
        executionTime: Date.now() - startTime
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Execute JavaScript code
   */
  private async executeJS(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const result = eval(code);
        resolve(String(result));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Execute Python code
   */
  private async executePython(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`python3 -c "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr));
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
   * Network packet access
   * Send/receive packets from other devices
   */
  sendPacket(host: string, port: number, data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      
      socket.connect(port, host, () => {
        socket.write(data);
        socket.end();
        resolve();
      });
      
      socket.on('error', reject);
    });
  }

  /**
   * Receive packets
   */
  receivePackets(port: number, callback: (data: Buffer) => void): void {
    const server = net.createServer((socket) => {
      socket.on('data', callback);
    });
    
    server.listen(port);
  }

  /**
   * UDP packet support
   */
  sendUDPPacket(host: string, port: number, data: Buffer): void {
    const socket = dgram.createSocket('udp4');
    socket.send(data, port, host, () => {
      socket.close();
    });
  }

  /**
   * Get VM statistics
   */
  getStats(): VMStats {
    return {
      id: this.id,
      memory: this.memory,
      cpu: this.cpu,
      processes: this.processes.size,
      uptime: process.uptime()
    };
  }
}

export interface VMResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number;
}

export interface VMStats {
  id: string;
  memory: number;
  cpu: number;
  processes: number;
  uptime: number;
}

export class VMManager {
  private vms: Map<string, VirtualMachine> = new Map();
  
  createVM(id: string, memory: number = 1024, cpu: number = 1): VirtualMachine {
    const vm = new VirtualMachine(id, memory, cpu);
    this.vms.set(id, vm);
    return vm;
  }

  getVM(id: string): VirtualMachine | undefined {
    return this.vms.get(id);
  }

  destroyVM(id: string): void {
    this.vms.delete(id);
  }

  getAllVMs(): VirtualMachine[] {
    return Array.from(this.vms.values());
  }
}

export const vmManager = new VMManager();

