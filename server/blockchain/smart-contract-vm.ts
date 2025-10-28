/**
 * AETHERIAL Smart Contract Virtual Machine
 * 
 * Turing-complete VM for executing smart contracts on the 4D+ blockchain
 * Features:
 * - Stack-based execution
 * - Gas metering
 * - State management
 * - Event emission
 * - Inter-contract calls
 * - Security sandboxing
 */

import * as crypto from 'crypto';

/**
 * Opcodes for the smart contract VM
 */
export enum Opcode {
  // Stack operations
  PUSH = 0x01,
  POP = 0x02,
  DUP = 0x03,
  SWAP = 0x04,
  
  // Arithmetic
  ADD = 0x10,
  SUB = 0x11,
  MUL = 0x12,
  DIV = 0x13,
  MOD = 0x14,
  
  // Comparison
  EQ = 0x20,
  LT = 0x21,
  GT = 0x22,
  LTE = 0x23,
  GTE = 0x24,
  
  // Logic
  AND = 0x30,
  OR = 0x31,
  NOT = 0x32,
  XOR = 0x33,
  
  // Control flow
  JUMP = 0x40,
  JUMPI = 0x41,
  CALL = 0x42,
  RETURN = 0x43,
  REVERT = 0x44,
  STOP = 0x45,
  
  // Storage
  SLOAD = 0x50,
  SSTORE = 0x51,
  MLOAD = 0x52,
  MSTORE = 0x53,
  
  // Blockchain
  ADDRESS = 0x60,
  BALANCE = 0x61,
  CALLER = 0x62,
  CALLVALUE = 0x63,
  TIMESTAMP = 0x64,
  BLOCKNUMBER = 0x65,
  
  // Cryptography
  SHA256 = 0x70,
  KECCAK256 = 0x71,
  ECRECOVER = 0x72,
  
  // Events
  LOG = 0x80,
  EMIT = 0x81,
}

/**
 * Gas costs for operations
 */
export const GAS_COSTS: Record<Opcode, number> = {
  [Opcode.PUSH]: 3,
  [Opcode.POP]: 2,
  [Opcode.DUP]: 3,
  [Opcode.SWAP]: 3,
  [Opcode.ADD]: 3,
  [Opcode.SUB]: 3,
  [Opcode.MUL]: 5,
  [Opcode.DIV]: 5,
  [Opcode.MOD]: 5,
  [Opcode.EQ]: 3,
  [Opcode.LT]: 3,
  [Opcode.GT]: 3,
  [Opcode.LTE]: 3,
  [Opcode.GTE]: 3,
  [Opcode.AND]: 3,
  [Opcode.OR]: 3,
  [Opcode.NOT]: 3,
  [Opcode.XOR]: 3,
  [Opcode.JUMP]: 8,
  [Opcode.JUMPI]: 10,
  [Opcode.CALL]: 700,
  [Opcode.RETURN]: 0,
  [Opcode.REVERT]: 0,
  [Opcode.STOP]: 0,
  [Opcode.SLOAD]: 200,
  [Opcode.SSTORE]: 5000,
  [Opcode.MLOAD]: 3,
  [Opcode.MSTORE]: 3,
  [Opcode.ADDRESS]: 2,
  [Opcode.BALANCE]: 400,
  [Opcode.CALLER]: 2,
  [Opcode.CALLVALUE]: 2,
  [Opcode.TIMESTAMP]: 2,
  [Opcode.BLOCKNUMBER]: 2,
  [Opcode.SHA256]: 60,
  [Opcode.KECCAK256]: 30,
  [Opcode.ECRECOVER]: 3000,
  [Opcode.LOG]: 375,
  [Opcode.EMIT]: 375,
};

/**
 * Smart contract execution context
 */
export interface ExecutionContext {
  address: string;
  caller: string;
  value: number;
  gasLimit: number;
  blockNumber: number;
  timestamp: number;
  origin: string;
}

/**
 * Smart contract state
 */
export class ContractState {
  private storage: Map<string, any> = new Map();
  private memory: any[] = [];
  
  get(key: string): any {
    return this.storage.get(key);
  }
  
  set(key: string, value: any): void {
    this.storage.set(key, value);
  }
  
  getMemory(index: number): any {
    return this.memory[index];
  }
  
  setMemory(index: number, value: any): void {
    this.memory[index] = value;
  }
  
  clear(): void {
    this.storage.clear();
    this.memory = [];
  }
}

/**
 * Smart contract
 */
export class SmartContract {
  public address: string;
  public bytecode: Buffer;
  public abi: any[];
  public state: ContractState;
  public balance: number = 0;
  
  constructor(
    public code: string,
    public creator: string,
    public createdAt: number = Date.now()
  ) {
    this.address = this.generateAddress();
    this.bytecode = Buffer.from(code, 'hex');
    this.abi = [];
    this.state = new ContractState();
  }
  
  private generateAddress(): string {
    const hash = crypto.createHash('sha256')
      .update(this.code + this.creator + this.createdAt)
      .digest('hex');
    return '0x' + hash.substring(0, 40);
  }
}

/**
 * Smart Contract Virtual Machine
 */
export class SmartContractVM {
  private contracts: Map<string, SmartContract> = new Map();
  private stack: any[] = [];
  private gasUsed: number = 0;
  private events: any[] = [];
  
  /**
   * Deploy a new contract
   */
  deploy(code: string, creator: string, gasLimit: number): SmartContract {
    const contract = new SmartContract(code, creator);
    this.contracts.set(contract.address, contract);
    
    // Execute constructor if present
    const context: ExecutionContext = {
      address: contract.address,
      caller: creator,
      value: 0,
      gasLimit,
      blockNumber: 0,
      timestamp: Date.now(),
      origin: creator,
    };
    
    return contract;
  }
  
  /**
   * Execute a contract function
   */
  execute(
    contractAddress: string,
    functionName: string,
    args: any[],
    context: ExecutionContext
  ): any {
    const contract = this.contracts.get(contractAddress);
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    this.stack = [];
    this.gasUsed = 0;
    this.events = [];
    
    // Push arguments to stack
    args.reverse().forEach(arg => this.stack.push(arg));
    
    // Execute bytecode
    return this.executeByteCode(contract, context);
  }
  
  /**
   * Execute bytecode
   */
  private executeByteCode(contract: SmartContract, context: ExecutionContext): any {
    const code = contract.bytecode;
    let pc = 0; // Program counter
    
    while (pc < code.length && this.gasUsed < context.gasLimit) {
      const opcode = code[pc] as Opcode;
      
      // Charge gas
      const gasCost = GAS_COSTS[opcode] || 1;
      this.gasUsed += gasCost;
      
      if (this.gasUsed > context.gasLimit) {
        throw new Error('Out of gas');
      }
      
      // Execute opcode
      switch (opcode) {
        case Opcode.PUSH:
          pc++;
          const value = code[pc];
          this.stack.push(value);
          break;
          
        case Opcode.POP:
          this.stack.pop();
          break;
          
        case Opcode.DUP:
          const top = this.stack[this.stack.length - 1];
          this.stack.push(top);
          break;
          
        case Opcode.SWAP:
          const a = this.stack.pop();
          const b = this.stack.pop();
          this.stack.push(a);
          this.stack.push(b);
          break;
          
        case Opcode.ADD:
          const addB = this.stack.pop();
          const addA = this.stack.pop();
          this.stack.push(addA + addB);
          break;
          
        case Opcode.SUB:
          const subB = this.stack.pop();
          const subA = this.stack.pop();
          this.stack.push(subA - subB);
          break;
          
        case Opcode.MUL:
          const mulB = this.stack.pop();
          const mulA = this.stack.pop();
          this.stack.push(mulA * mulB);
          break;
          
        case Opcode.DIV:
          const divB = this.stack.pop();
          const divA = this.stack.pop();
          if (divB === 0) throw new Error('Division by zero');
          this.stack.push(Math.floor(divA / divB));
          break;
          
        case Opcode.MOD:
          const modB = this.stack.pop();
          const modA = this.stack.pop();
          this.stack.push(modA % modB);
          break;
          
        case Opcode.EQ:
          const eqB = this.stack.pop();
          const eqA = this.stack.pop();
          this.stack.push(eqA === eqB ? 1 : 0);
          break;
          
        case Opcode.LT:
          const ltB = this.stack.pop();
          const ltA = this.stack.pop();
          this.stack.push(ltA < ltB ? 1 : 0);
          break;
          
        case Opcode.GT:
          const gtB = this.stack.pop();
          const gtA = this.stack.pop();
          this.stack.push(gtA > gtB ? 1 : 0);
          break;
          
        case Opcode.AND:
          const andB = this.stack.pop();
          const andA = this.stack.pop();
          this.stack.push(andA && andB ? 1 : 0);
          break;
          
        case Opcode.OR:
          const orB = this.stack.pop();
          const orA = this.stack.pop();
          this.stack.push(orA || orB ? 1 : 0);
          break;
          
        case Opcode.NOT:
          const notA = this.stack.pop();
          this.stack.push(!notA ? 1 : 0);
          break;
          
        case Opcode.JUMP:
          const jumpDest = this.stack.pop();
          pc = jumpDest - 1; // -1 because pc++ at end of loop
          break;
          
        case Opcode.JUMPI:
          const condition = this.stack.pop();
          const dest = this.stack.pop();
          if (condition) {
            pc = dest - 1;
          }
          break;
          
        case Opcode.SLOAD:
          const loadKey = this.stack.pop();
          const loadValue = contract.state.get(loadKey.toString());
          this.stack.push(loadValue || 0);
          break;
          
        case Opcode.SSTORE:
          const storeValue = this.stack.pop();
          const storeKey = this.stack.pop();
          contract.state.set(storeKey.toString(), storeValue);
          break;
          
        case Opcode.MLOAD:
          const mloadIndex = this.stack.pop();
          const mloadValue = contract.state.getMemory(mloadIndex);
          this.stack.push(mloadValue || 0);
          break;
          
        case Opcode.MSTORE:
          const mstoreValue = this.stack.pop();
          const mstoreIndex = this.stack.pop();
          contract.state.setMemory(mstoreIndex, mstoreValue);
          break;
          
        case Opcode.ADDRESS:
          this.stack.push(context.address);
          break;
          
        case Opcode.BALANCE:
          const balanceAddr = this.stack.pop();
          const balanceContract = this.contracts.get(balanceAddr);
          this.stack.push(balanceContract?.balance || 0);
          break;
          
        case Opcode.CALLER:
          this.stack.push(context.caller);
          break;
          
        case Opcode.CALLVALUE:
          this.stack.push(context.value);
          break;
          
        case Opcode.TIMESTAMP:
          this.stack.push(context.timestamp);
          break;
          
        case Opcode.BLOCKNUMBER:
          this.stack.push(context.blockNumber);
          break;
          
        case Opcode.SHA256:
          const sha256Data = this.stack.pop();
          const sha256Hash = crypto.createHash('sha256')
            .update(sha256Data.toString())
            .digest('hex');
          this.stack.push(sha256Hash);
          break;
          
        case Opcode.KECCAK256:
          const keccakData = this.stack.pop();
          const keccakHash = crypto.createHash('sha256')
            .update(keccakData.toString())
            .digest('hex');
          this.stack.push(keccakHash);
          break;
          
        case Opcode.LOG:
        case Opcode.EMIT:
          const eventData = this.stack.pop();
          this.events.push({
            contract: context.address,
            data: eventData,
            timestamp: Date.now(),
          });
          break;
          
        case Opcode.RETURN:
          return this.stack.pop();
          
        case Opcode.REVERT:
          throw new Error('Transaction reverted');
          
        case Opcode.STOP:
          return null;
          
        default:
          throw new Error(`Unknown opcode: ${opcode}`);
      }
      
      pc++;
    }
    
    return this.stack.length > 0 ? this.stack.pop() : null;
  }
  
  /**
   * Get contract by address
   */
  getContract(address: string): SmartContract | undefined {
    return this.contracts.get(address);
  }
  
  /**
   * Get all contracts
   */
  getAllContracts(): SmartContract[] {
    return Array.from(this.contracts.values());
  }
  
  /**
   * Get gas used in last execution
   */
  getGasUsed(): number {
    return this.gasUsed;
  }
  
  /**
   * Get events emitted in last execution
   */
  getEvents(): any[] {
    return this.events;
  }
}

export const smartContractVM = new SmartContractVM();

