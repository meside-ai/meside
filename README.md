# meside  
**AI-First Data Transformation Tool**  

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)]

*Note: Meside is under active development. Expect breaking changes in early versions.*  

Meside is an open-source, AI-driven data transformation tool designed to streamline complex data workflows. By integrating machine learning models, Meside automates schema inference, format conversion, and data normalization, reducing manual effort in ETL (Extract, Transform, Load) processes. Built for flexibility, it supports structured and semi-structured data formats like JSON, CSV, and XML, with plans to expand to unstructured data.

### Key Features  
- **AI-Powered Transformations**: Leverage pre-trained models to auto-detect data patterns and suggest optimizations.  
- **Extensible Architecture**: Plugin system for custom AI models or transformation rules.  
- **Real-Time Debugging**: Interactive previews of transformation steps.  
- **Multi-Format Support**: Seamlessly convert between JSON, CSV, YAML, and more.  
- **Metadata Awareness**: Preserve and enrich data context during transformations.  

### Installation & Setup  
1. **Prerequisites**: Ensure [Bun](https://bun.sh/) (v1.0+) and [Docker](https://www.docker.com/) are installed.  
2. **Database Setup**:  
   ```bash 
   sh ./dev-docker-start.sh
   ```
3. **Backend Setup**:  
   ```bash  
   cd ./server  
   cp .env.default .env
   echo 'AI_MODEL=gpt-4o' >> .env
   echo 'OPENAI_API_KEY=<your-api-key>' >> .env
   # if you want to use DeepSeek-R1, but currently only support DeepSeek official platform
   # echo 'AI_MODEL=deepseek-reasoner' >> .env
   # echo 'DEEPSEEK_API_KEY=<your-api-key>' >> .env
   bun install  
   bun run migrate  # Initialize database  
   bun run reset    # Reset dev environment  
   bun run seed     # Load sample data  
   bun run dev      # Start backend server  
   ```  
4. **Frontend Setup**:  
   ```bash  
   cd ./frontend  
   bun install  
   bun run dev      # Launch development client  
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
