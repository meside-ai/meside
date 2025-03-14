# Contributing to Meside

Thank you for your interest in contributing to Meside! This document provides guidelines and instructions to help you contribute effectively.

## Getting Started

1. **Fork the Repository**: Start by forking the [Meside repository](https://github.com/meside-ai/meside) to your GitHub account.

2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/YOUR-USERNAME/meside.git
   cd meside
   ```

3. **Create a Branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

Follow the installation and setup instructions in the [README.md](README.md) to set up your development environment.

## Coding Standards

- **Code Formatting**: We use standard formatting tools for each language:
  - JavaScript/TypeScript: [Biome](https://github.com/biomejs/biome)

- **Naming Conventions**:
  - Use descriptive variable and function names
  - Follow camelCase for JavaScript/TypeScript variables and functions
  - Use PascalCase for classes and components
  - Use kebab-case for file names

- **Documentation**:
  - Document all public APIs, functions, and classes
  - Include inline comments for complex logic
  - Update relevant documentation when making changes

## Pull Request Process

1. **Update Your Fork**: Before submitting a PR, make sure your fork is up to date with the main repository:
   ```bash
   git remote add upstream https://github.com/meside-ai/meside.git
   git fetch upstream
   git merge upstream/main
   ```

2. **Test Your Changes**: Ensure all tests pass and add new tests for new functionality.

3. **Submit a Pull Request**: 
   - Provide a clear, descriptive title
   - Include a detailed description of changes
   - Reference any related issues
   - Include screenshots or examples if applicable

4. **Code Review**: Address any feedback from maintainers promptly.

## Development Environment Installation & Setup

1. **Prerequisites**: Ensure [Bun](https://bun.sh/) (v1.0+) and [Docker](https://www.docker.com/) are installed.  
2. **Database Setup**:  
   ```bash 
   sh ./dev-docker-start.sh
   ```
3. **Backend Setup**:  
   ```bash  
   cd ./server  
   cp .env.default .env
   echo 'AI_MODEL=o3-mini' >> .env
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

## Reporting Issues

- Use the [issue tracker](https://github.com/meside-ai/meside/issues) to report bugs or suggest features
- Provide detailed steps to reproduce bugs
- Include relevant information like OS, browser, and Meside version

## Roadmap

Check our [roadmap](docs/ROADMAP.md) to see planned features and improvements. Feel free to pick up items from there or suggest additions.

## License

By contributing to Meside, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## Questions?

If you have any questions or need help, feel free to:
- Open an issue with your question
- Reach out to the maintainers

Thank you for contributing to Meside!
