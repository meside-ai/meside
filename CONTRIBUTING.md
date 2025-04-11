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
  ```
5. **Database Setup**:  
  ```bash 
  sh ./dev-docker-clean.sh
  sh ./dev-docker-start.sh
  ```

6. **Seed**
  ```bash
  bun run migrate && bun run seed
  ```

7. **Start the server**:  
  ```bash  
  bun run dev
  # localhost:3000
  ```
  
8. **Start opentelemetry observability**:
  open link [http://localhost:16686/](http://localhost:16686/)

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
