# MCP Crawl4AI RAG Repository Analysis

**Repository**: https://github.com/coleam00/mcp-crawl4ai-rag
**Stars**: 1.8k | **Forks**: 528

## Overview

A powerful implementation combining Model Context Protocol (MCP), Crawl4AI, and Supabase for advanced web crawling and RAG capabilities.

## Key Technologies

### Core Stack
- **Model Context Protocol (MCP)**: Framework for AI agent communication
- **Crawl4AI**: Web crawling engine
- **Supabase**: Vector database with pgvector extension
- **OpenAI API**: Embedding generation
- **Neo4j**: Knowledge graph (optional)
- **Docker**: Containerization
- **Python 3.12+**: Runtime environment

### RAG Strategies Implemented

1. **Contextual Embeddings**: Enriched semantic understanding
2. **Hybrid Search**: Vector + keyword search combination
3. **Agentic RAG**: Specialized code example extraction
4. **Reranking**: Cross-encoder models for relevance
5. **Knowledge Graph**: Hallucination detection and code analysis

## Architecture Components

### Tools Provided

#### Core Tools
1. `crawl_single_page` - Single page crawling
2. `smart_crawl_url` - Intelligent full website crawling
3. `get_available_sources` - List available data sources
4. `perform_rag_query` - Semantic search with filtering

#### Conditional Tools
5. `search_code_examples` - Code snippet retrieval (requires Agentic RAG)

#### Knowledge Graph Tools
6. `parse_github_repository` - Parse repo into Neo4j graph
7. `check_ai_script_hallucinations` - Validate code against graph
8. `query_knowledge_graph` - Explore Neo4j with Cypher queries

### Features

**Smart URL Detection**
- Automatically handles different URL types
- Supports sitemaps, text files, regular webpages

**Recursive Crawling**
- Follows internal links
- Discovers content automatically

**Parallel Processing**
- Efficient multi-page crawling
- Concurrent operations

**Content Chunking**
- Header-based splitting
- Size-optimized chunks
- Semantic meaning preservation

**Vector Search**
- RAG over crawled content
- Source filtering
- Precision retrieval

## Implementation Details

### Database Setup
- Uses pgvector extension in Supabase
- SQL schema: `crawled_pages.sql`
- Vector similarity search functions

### Knowledge Graph Setup
- Neo4j for graph database
- Bolt protocol connection
- Cypher query support
- Repository code analysis
- Hallucination detection

### Docker Configuration
- Containerized deployment
- Port configuration (default 8051)
- Environment variable support

### Advanced RAG Features

**Contextual Retrieval**
- Enriched embeddings with context
- Better semantic understanding

**Hybrid Search**
- Combines vector similarity
- Keyword matching
- Improved recall

**Agentic RAG**
- Specialized agents for code extraction
- Targeted snippet retrieval

**Reranking**
- Cross-encoder models
- Relevance scoring
- Result optimization

**Knowledge Graph Integration**
- Code structure analysis
- Import validation
- Method call verification
- Class usage tracking

## Future Vision

1. **Archon Integration**: Knowledge engine for AI coding assistants
2. **Multiple Embedding Models**: Support for Ollama, local models
3. **Advanced RAG Strategies**: Late chunking, contextual retrieval
4. **Enhanced Chunking**: Context 7-inspired approach
5. **Performance Optimization**: Faster crawling and indexing

## Key Learnings for Aetherial

### Architecture Patterns
- MCP protocol for AI agent communication
- Vector database for semantic search
- Knowledge graphs for code understanding
- Multi-strategy RAG for better retrieval

### Technical Stack
- Supabase for vector storage
- pgvector for similarity search
- Neo4j for knowledge graphs
- Docker for deployment

### RAG Best Practices
- Contextual embeddings
- Hybrid search approaches
- Reranking for precision
- Chunking strategies
- Source filtering

### Code Analysis
- Repository parsing
- Hallucination detection
- Import validation
- Method verification

## Implementation for Aetherial

We can adapt this architecture for:

1. **Self-Hosted RAG System**
   - Use Supabase or PostgreSQL with pgvector
   - Implement contextual embeddings
   - Add hybrid search
   - Build reranking pipeline

2. **Knowledge Graph**
   - Neo4j for platform knowledge
   - User behavior graphs
   - Content relationships
   - Recommendation engine

3. **Multi-Strategy RAG**
   - Contextual retrieval
   - Agentic approaches
   - Hybrid search
   - Reranking

4. **Web Crawling**
   - Documentation indexing
   - Content discovery
   - Knowledge base building
   - Real-time updates

## Files to Review
- `src/` - Core implementation
- `crawled_pages.sql` - Database schema
- `pyproject.toml` - Dependencies
- `.env.example` - Configuration
- `Dockerfile` - Container setup

