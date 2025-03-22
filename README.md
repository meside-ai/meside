# meside  
**The better AI Agent for Data Analysis (multi agents and model context protocol)**

![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)

*Note: Meside is under active development. Expect breaking changes in early versions.*  

* Supported databases: PostgreSQL, BigQuery, MySQL, OracleDB
* Databases to be supported: Clickhouse, Snowflake, SQLite, SQLServer

Meside is an open-source, AI-driven MCP Client and Data Warehouse MCP Server. By integrating AI agents, Meside automates schema inference, format conversion, and data normalization, reducing manual effort in ETL (Extract, Transform, Load) processes. Built for flexibility, it supports structured and semi-structured data formats like JSON, CSV, and XML, with plans to expand to unstructured data.

### Key Features  
- **AI-Powered Transformations**: Leverage pre-trained models to auto-detect data patterns and suggest optimizations.  
- **Extensible Architecture**: Plugin system for custom AI models or transformation rules.  
- **Real-Time Debugging**: Interactive previews of transformation steps.  
- **Multi-Format Support**: Seamlessly convert between JSON, CSV, YAML, and more.  
- **Metadata Awareness**: Preserve and enrich data context during transformations.  

### Installation & Setup  
1. **Prerequisites**: Ensure [Bun](https://bun.sh/) (v1.0+) and [Docker](https://www.docker.com/) are installed.  
2. git clone
  ```bash
  git clone https://github.com/meside-ai/meside.git
  # git clone git@github.com:meside-ai/meside.git
  ```
3. install dependencies:
  ```bash
  bun install
  ```
4. **Prepare Environments**:
  ```bash
  cp apps/server/default.env apps/server/.env
  cp apps/web/default.env apps/web/.env
  cp apps/warehouse/default.env apps/warehouse/.env
  echo 'OPENAI_API_KEY=<your-api-key>' >> apps/web/.env
  ```
5. **Database Setup**:  
  ```bash 
  sh ./dev-docker-clean.sh
  sh ./dev-docker-start.sh
  ```
6. **Migrate and seed**
  ```bash
  cd apps/warehouse
  bun run migrate
  bun run reset
  bun run seed

  cd ../web
  bun run migrate
  bun run reset
  bun run seed
  ```
7. **Start the server**:  
  ```bash  
  bun run dev
  # localhost:3000
  ```  

### How to use MCP

We only support SSE MCP currently, the Claude Desktop is not support SSE, the Cursor or other IDE support it.

* [Cursor docs](https://docs.cursor.com/context/model-context-protocol)

``` json
{
  "mcpServers": {
    "database": {
      "url": "http://localhost:6333/meside/warehouse/api/mcp",
    }
  }
}
```

### Contributing  
We welcome contributions! Check out our [roadmap](docs/ROADMAP.md) and [issue tracker](https://github.com/meside-ai/meside/issues). Follow these steps:  
1. Fork the repository and create a feature branch.  
2. Adhere to the coding standards in `CONTRIBUTING.md`.  
3. Submit a pull request with detailed documentation.  

### License  
Distributed under the MIT License. See `LICENSE` for details.  

### Disclaimer  
*Meside is in alpha. APIs and workflows may change without notice. Use in production at your own risk.*  
