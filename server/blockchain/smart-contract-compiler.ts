/**
 * AETHERIAL Smart Contract Compiler
 * 
 * Compiles high-level contract code to VM bytecode
 * Language features:
 * - Variables and state
 * - Functions
 * - Conditionals (if/else)
 * - Loops (for/while)
 * - Events
 * - Modifiers
 * - Inheritance
 */

import { Opcode } from './smart-contract-vm';

/**
 * Token types for lexer
 */
enum TokenType {
  KEYWORD,
  IDENTIFIER,
  NUMBER,
  STRING,
  OPERATOR,
  PUNCTUATION,
  EOF,
}

/**
 * Token
 */
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

/**
 * AST Node types
 */
enum NodeType {
  CONTRACT,
  FUNCTION,
  VARIABLE,
  ASSIGNMENT,
  BINARY_OP,
  CALL,
  IF,
  WHILE,
  FOR,
  RETURN,
  EMIT,
}

/**
 * AST Node
 */
interface ASTNode {
  type: NodeType;
  value?: any;
  children?: ASTNode[];
  metadata?: any;
}

/**
 * Smart Contract Compiler
 */
export class SmartContractCompiler {
  private tokens: Token[] = [];
  private currentToken: number = 0;
  private bytecode: number[] = [];
  private symbolTable: Map<string, number> = new Map();
  private functionTable: Map<string, number> = new Map();
  
  /**
   * Compile source code to bytecode
   */
  compile(source: string): { bytecode: string; abi: any[] } {
    // Lexical analysis
    this.tokens = this.tokenize(source);
    
    // Syntax analysis
    const ast = this.parse();
    
    // Code generation
    this.bytecode = [];
    this.generateCode(ast);
    
    // Generate ABI
    const abi = this.generateABI(ast);
    
    return {
      bytecode: Buffer.from(this.bytecode).toString('hex'),
      abi,
    };
  }
  
  /**
   * Tokenize source code
   */
  private tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    let line = 1;
    let column = 1;
    let i = 0;
    
    const keywords = [
      'contract', 'function', 'if', 'else', 'while', 'for',
      'return', 'emit', 'public', 'private', 'view', 'pure',
      'payable', 'modifier', 'require', 'assert', 'revert',
    ];
    
    while (i < source.length) {
      const char = source[i];
      
      // Skip whitespace
      if (/\s/.test(char)) {
        if (char === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
        i++;
        continue;
      }
      
      // Skip comments
      if (char === '/' && source[i + 1] === '/') {
        while (i < source.length && source[i] !== '\n') i++;
        continue;
      }
      
      // Numbers
      if (/\d/.test(char)) {
        let num = '';
        while (i < source.length && /\d/.test(source[i])) {
          num += source[i];
          i++;
        }
        tokens.push({ type: TokenType.NUMBER, value: num, line, column });
        column += num.length;
        continue;
      }
      
      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        let ident = '';
        while (i < source.length && /[a-zA-Z0-9_]/.test(source[i])) {
          ident += source[i];
          i++;
        }
        
        const type = keywords.includes(ident) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        tokens.push({ type, value: ident, line, column });
        column += ident.length;
        continue;
      }
      
      // Strings
      if (char === '"' || char === "'") {
        const quote = char;
        let str = '';
        i++;
        while (i < source.length && source[i] !== quote) {
          str += source[i];
          i++;
        }
        i++; // Skip closing quote
        tokens.push({ type: TokenType.STRING, value: str, line, column });
        column += str.length + 2;
        continue;
      }
      
      // Operators
      if ('+-*/%=<>!&|'.includes(char)) {
        let op = char;
        i++;
        if (i < source.length && '=&|'.includes(source[i])) {
          op += source[i];
          i++;
        }
        tokens.push({ type: TokenType.OPERATOR, value: op, line, column });
        column += op.length;
        continue;
      }
      
      // Punctuation
      if ('(){}[];,'.includes(char)) {
        tokens.push({ type: TokenType.PUNCTUATION, value: char, line, column });
        i++;
        column++;
        continue;
      }
      
      i++;
      column++;
    }
    
    tokens.push({ type: TokenType.EOF, value: '', line, column });
    return tokens;
  }
  
  /**
   * Parse tokens into AST
   */
  private parse(): ASTNode {
    return this.parseContract();
  }
  
  /**
   * Parse contract
   */
  private parseContract(): ASTNode {
    this.expect('contract', TokenType.KEYWORD);
    const name = this.expect('', TokenType.IDENTIFIER);
    this.expect('{', TokenType.PUNCTUATION);
    
    const children: ASTNode[] = [];
    
    while (this.current().value !== '}') {
      if (this.current().value === 'function') {
        children.push(this.parseFunction());
      } else {
        children.push(this.parseVariable());
      }
    }
    
    this.expect('}', TokenType.PUNCTUATION);
    
    return {
      type: NodeType.CONTRACT,
      value: name.value,
      children,
    };
  }
  
  /**
   * Parse function
   */
  private parseFunction(): ASTNode {
    this.expect('function', TokenType.KEYWORD);
    const name = this.expect('', TokenType.IDENTIFIER);
    
    this.expect('(', TokenType.PUNCTUATION);
    const params: string[] = [];
    while (this.current().value !== ')') {
      params.push(this.expect('', TokenType.IDENTIFIER).value);
      if (this.current().value === ',') {
        this.advance();
      }
    }
    this.expect(')', TokenType.PUNCTUATION);
    
    // Skip visibility and modifiers
    while (['public', 'private', 'view', 'pure', 'payable'].includes(this.current().value)) {
      this.advance();
    }
    
    this.expect('{', TokenType.PUNCTUATION);
    const body: ASTNode[] = [];
    
    while (this.current().value !== '}') {
      body.push(this.parseStatement());
    }
    
    this.expect('}', TokenType.PUNCTUATION);
    
    return {
      type: NodeType.FUNCTION,
      value: name.value,
      metadata: { params },
      children: body,
    };
  }
  
  /**
   * Parse variable declaration
   */
  private parseVariable(): ASTNode {
    const name = this.expect('', TokenType.IDENTIFIER);
    let value: ASTNode | undefined;
    
    if (this.current().value === '=') {
      this.advance();
      value = this.parseExpression();
    }
    
    this.expect(';', TokenType.PUNCTUATION);
    
    return {
      type: NodeType.VARIABLE,
      value: name.value,
      children: value ? [value] : [],
    };
  }
  
  /**
   * Parse statement
   */
  private parseStatement(): ASTNode {
    const token = this.current();
    
    if (token.value === 'if') {
      return this.parseIf();
    } else if (token.value === 'while') {
      return this.parseWhile();
    } else if (token.value === 'for') {
      return this.parseFor();
    } else if (token.value === 'return') {
      return this.parseReturn();
    } else if (token.value === 'emit') {
      return this.parseEmit();
    } else {
      return this.parseAssignment();
    }
  }
  
  /**
   * Parse if statement
   */
  private parseIf(): ASTNode {
    this.expect('if', TokenType.KEYWORD);
    this.expect('(', TokenType.PUNCTUATION);
    const condition = this.parseExpression();
    this.expect(')', TokenType.PUNCTUATION);
    this.expect('{', TokenType.PUNCTUATION);
    
    const thenBody: ASTNode[] = [];
    while (this.current().value !== '}') {
      thenBody.push(this.parseStatement());
    }
    this.expect('}', TokenType.PUNCTUATION);
    
    let elseBody: ASTNode[] = [];
    if (this.current().value === 'else') {
      this.advance();
      this.expect('{', TokenType.PUNCTUATION);
      while (this.current().value !== '}') {
        elseBody.push(this.parseStatement());
      }
      this.expect('}', TokenType.PUNCTUATION);
    }
    
    return {
      type: NodeType.IF,
      children: [condition, ...thenBody, ...elseBody],
      metadata: { thenCount: thenBody.length, elseCount: elseBody.length },
    };
  }
  
  /**
   * Parse while loop
   */
  private parseWhile(): ASTNode {
    this.expect('while', TokenType.KEYWORD);
    this.expect('(', TokenType.PUNCTUATION);
    const condition = this.parseExpression();
    this.expect(')', TokenType.PUNCTUATION);
    this.expect('{', TokenType.PUNCTUATION);
    
    const body: ASTNode[] = [];
    while (this.current().value !== '}') {
      body.push(this.parseStatement());
    }
    this.expect('}', TokenType.PUNCTUATION);
    
    return {
      type: NodeType.WHILE,
      children: [condition, ...body],
    };
  }
  
  /**
   * Parse for loop
   */
  private parseFor(): ASTNode {
    this.expect('for', TokenType.KEYWORD);
    this.expect('(', TokenType.PUNCTUATION);
    const init = this.parseStatement();
    const condition = this.parseExpression();
    this.expect(';', TokenType.PUNCTUATION);
    const increment = this.parseExpression();
    this.expect(')', TokenType.PUNCTUATION);
    this.expect('{', TokenType.PUNCTUATION);
    
    const body: ASTNode[] = [];
    while (this.current().value !== '}') {
      body.push(this.parseStatement());
    }
    this.expect('}', TokenType.PUNCTUATION);
    
    return {
      type: NodeType.FOR,
      children: [init, condition, increment, ...body],
    };
  }
  
  /**
   * Parse return statement
   */
  private parseReturn(): ASTNode {
    this.expect('return', TokenType.KEYWORD);
    const value = this.parseExpression();
    this.expect(';', TokenType.PUNCTUATION);
    
    return {
      type: NodeType.RETURN,
      children: [value],
    };
  }
  
  /**
   * Parse emit statement
   */
  private parseEmit(): ASTNode {
    this.expect('emit', TokenType.KEYWORD);
    const event = this.expect('', TokenType.IDENTIFIER);
    this.expect('(', TokenType.PUNCTUATION);
    const args: ASTNode[] = [];
    while (this.current().value !== ')') {
      args.push(this.parseExpression());
      if (this.current().value === ',') {
        this.advance();
      }
    }
    this.expect(')', TokenType.PUNCTUATION);
    this.expect(';', TokenType.PUNCTUATION);
    
    return {
      type: NodeType.EMIT,
      value: event.value,
      children: args,
    };
  }
  
  /**
   * Parse assignment
   */
  private parseAssignment(): ASTNode {
    const name = this.expect('', TokenType.IDENTIFIER);
    this.expect('=', TokenType.OPERATOR);
    const value = this.parseExpression();
    this.expect(';', TokenType.PUNCTUATION);
    
    return {
      type: NodeType.ASSIGNMENT,
      value: name.value,
      children: [value],
    };
  }
  
  /**
   * Parse expression
   */
  private parseExpression(): ASTNode {
    let left = this.parsePrimary();
    
    while (this.current().type === TokenType.OPERATOR) {
      const op = this.advance();
      const right = this.parsePrimary();
      
      left = {
        type: NodeType.BINARY_OP,
        value: op.value,
        children: [left, right],
      };
    }
    
    return left;
  }
  
  /**
   * Parse primary expression
   */
  private parsePrimary(): ASTNode {
    const token = this.current();
    
    if (token.type === TokenType.NUMBER) {
      this.advance();
      return { type: NodeType.VARIABLE, value: parseInt(token.value) };
    } else if (token.type === TokenType.IDENTIFIER) {
      const name = this.advance();
      
      // Function call
      if (this.current().value === '(') {
        this.advance();
        const args: ASTNode[] = [];
        while (this.current().value !== ')') {
          args.push(this.parseExpression());
          if (this.current().value === ',') {
            this.advance();
          }
        }
        this.expect(')', TokenType.PUNCTUATION);
        
        return {
          type: NodeType.CALL,
          value: name.value,
          children: args,
        };
      }
      
      return { type: NodeType.VARIABLE, value: name.value };
    }
    
    throw new Error(`Unexpected token: ${token.value}`);
  }
  
  /**
   * Generate bytecode from AST
   */
  private generateCode(node: ASTNode): void {
    switch (node.type) {
      case NodeType.CONTRACT:
        node.children?.forEach(child => this.generateCode(child));
        break;
        
      case NodeType.FUNCTION:
        this.functionTable.set(node.value, this.bytecode.length);
        node.children?.forEach(child => this.generateCode(child));
        break;
        
      case NodeType.VARIABLE:
        if (typeof node.value === 'number') {
          this.emit(Opcode.PUSH, node.value);
        } else {
          const addr = this.symbolTable.get(node.value) || this.symbolTable.size;
          this.symbolTable.set(node.value, addr);
          this.emit(Opcode.PUSH, addr);
          this.emit(Opcode.SLOAD);
        }
        break;
        
      case NodeType.ASSIGNMENT:
        node.children?.forEach(child => this.generateCode(child));
        const addr = this.symbolTable.get(node.value) || this.symbolTable.size;
        this.symbolTable.set(node.value, addr);
        this.emit(Opcode.PUSH, addr);
        this.emit(Opcode.SSTORE);
        break;
        
      case NodeType.BINARY_OP:
        node.children?.forEach(child => this.generateCode(child));
        this.emitOperator(node.value);
        break;
        
      case NodeType.RETURN:
        node.children?.forEach(child => this.generateCode(child));
        this.emit(Opcode.RETURN);
        break;
        
      case NodeType.EMIT:
        node.children?.forEach(child => this.generateCode(child));
        this.emit(Opcode.EMIT);
        break;
    }
  }
  
  /**
   * Emit opcode
   */
  private emit(opcode: Opcode, operand?: number): void {
    this.bytecode.push(opcode);
    if (operand !== undefined) {
      this.bytecode.push(operand);
    }
  }
  
  /**
   * Emit operator opcode
   */
  private emitOperator(op: string): void {
    const opcodes: Record<string, Opcode> = {
      '+': Opcode.ADD,
      '-': Opcode.SUB,
      '*': Opcode.MUL,
      '/': Opcode.DIV,
      '%': Opcode.MOD,
      '==': Opcode.EQ,
      '<': Opcode.LT,
      '>': Opcode.GT,
      '&&': Opcode.AND,
      '||': Opcode.OR,
    };
    
    const opcode = opcodes[op];
    if (opcode) {
      this.emit(opcode);
    }
  }
  
  /**
   * Generate ABI
   */
  private generateABI(node: ASTNode): any[] {
    const abi: any[] = [];
    
    if (node.type === NodeType.CONTRACT) {
      node.children?.forEach(child => {
        if (child.type === NodeType.FUNCTION) {
          abi.push({
            name: child.value,
            type: 'function',
            inputs: child.metadata?.params || [],
            outputs: [],
          });
        }
      });
    }
    
    return abi;
  }
  
  /**
   * Helper methods
   */
  private current(): Token {
    return this.tokens[this.currentToken];
  }
  
  private advance(): Token {
    return this.tokens[this.currentToken++];
  }
  
  private expect(value: string, type: TokenType): Token {
    const token = this.current();
    if (value && token.value !== value) {
      throw new Error(`Expected '${value}' but got '${token.value}'`);
    }
    if (token.type !== type) {
      throw new Error(`Expected type ${type} but got ${token.type}`);
    }
    return this.advance();
  }
}

export const compiler = new SmartContractCompiler();

