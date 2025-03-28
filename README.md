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

### How to use MCP Server (Data warehouse)

We only support SSE MCP currently, the Claude Desktop is not support SSE, the Cursor or other IDE support it.

* [Cursor docs](https://docs.cursor.com/context/model-context-protocol)

``` json
{
  "mcpServers": {
    "database": {
      "type": "sse",
      "url": "http://localhost:6333/meside/warehouse/api/mcp",
    }
  }
}
```

### Installation & Setup in development
Look into [CONTRIBUTING.md](CONTRIBUTING.md).

### Contributing  
Follow these steps:  
1. Fork the repository and create a feature branch.  
2. Adhere to the coding standards in [CONTRIBUTING.md](CONTRIBUTING.md).  
3. Submit a pull request with detailed documentation.  

### License  
Distributed under the MIT License. See `LICENSE` for details.  

### Disclaimer  
*Meside is in alpha. APIs and workflows may change without notice. Use in production at your own risk.*  
