# AbimongoBootstrap: Rapid Project Initialization

The `AbimongoBootstrap` class is a core utility in the **Abimongo_Core** ecosystem, designed to streamline the process of bootstrapping new Abimongo_Core applications. It automates the creation of essential configuration files, scaffolds project structure, and installs required dependencies, enabling developers to get started quickly and consistently.

---

## Key Features

- **Automated Project Scaffolding**: Sets up the recommended folder structure for Abimongo_Core projects.
- **JSON Configuration Generation**: Creates a ready-to-use `abimongo.config.json` file for project settings.
- **Dependency Installation**: Installs `abimongo_core` and other required packages automatically.
- **Interactive Setup**: Provides an intuitive command-line interface for project configuration.
- **Multi-Tenancy Support**: Built-in configuration options for multi-tenant applications.
- **GraphQL Integration**: Optional GraphQL setup with auto-generated schemas and resolvers.
- **Best Practices**: Ensures your project follows Abimongo_Core conventions from the start.

---

## How It Works

When you run the bootstrap command, `AbimongoBootstrap`:

1. **Interactive Project Configuration**: Guides you through project setup with intelligent prompts.
2. **Dependency Management**: Automatically installs and configures required packages.
3. **Project Structure Creation**: Establishes a professional folder hierarchy.
4. **Configuration File Generation**: Creates optimized `abimongo.config.json` with your preferences.
5. **Example Code Generation**: Optionally scaffolds starter models, schemas, and GraphQL resolvers.
6. **Environment Setup**: Configures development environment with logging and debugging tools.

---

## Usage

### Step 1: Initialize a New Project

Start a new Abimongo_Core project using the CLI:

```bash
npx abimongo-core init
```

The interactive setup will prompt you for:

- **Project Name**: A descriptive name for your application
- **MongoDB Connection URI**: Your database connection string
- **Multi-Tenancy**: Enable tenant-specific database isolation
- **GraphQL Integration**: Auto-generate GraphQL schemas and resolvers
- **Logging Configuration**: Set up structured logging with customizable transports
- **Development Tools**: Include debugging utilities and development middleware

### Step 2: Quick Setup with Flags

For rapid prototyping, use command-line flags:

```bash
npx abimongo-core init my-enterprise-app \
  --uri mongodb://localhost:27017/mydb \
  --multi-tenant \
  --graphql \
  --logger \
  --typescript
```

### Step 3: Advanced Configuration

For enterprise applications, use the comprehensive configuration:

```bash
npx abimongo-core init enterprise-api \
  --uri mongodb+srv://user:pass@cluster.mongodb.net/production \
  --multi-tenant \
  --graphql \
  --rbac \
  --redis redis://localhost:6379 \
  --logger \
  --docker
```

---

## Generated Project Structure

After bootstrapping, your project will have the following structure:

```
my-abimongo-app/
├── src/
│   ├── models/          # MongoDB model definitions
│   ├── schemas/         # Schema validation and middleware
│   ├── graphql/         # GraphQL types and resolvers (if enabled)
│   ├── middleware/      # Custom middleware and RBAC
│   ├── controllers/     # Business logic controllers
│   ├── config/          # Application configuration
│   └── index.ts         # Application entry point
├── tests/               # Test suites and fixtures
├── docs/                # API documentation
├── abimongo.config.json # Main configuration file
├── package.json         # Node.js dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore patterns
└── README.md            # Project documentation
```

---

## Configuration Options

### Basic Configuration

```json
{
  "projectName": "my-abimongo-app",
  "mongoUri": "mongodb://localhost:27017/mydb",
  "multiTenancy": {
    "enabled": true,
    "strategy": "database-per-tenant"
  }
}
```

### Advanced Enterprise Configuration

```json
{
  "projectName": "enterprise-api",
  "mongoUri": "mongodb+srv://cluster.mongodb.net/production",
  "multiTenancy": {
    "enabled": true,
    "strategy": "database-per-tenant",
    "lazyLoading": true
  },
  "graphql": {
    "enabled": true,
    "playground": true,
    "introspection": false,
    "subscriptions": true
  },
  "security": {
    "rbac": {
      "enabled": true,
      "caching": true
    },
    "rateLimit": {
      "enabled": true,
      "windowMs": 15000,
      "max": 100
    }
  },
  "caching": {
    "redis": {
      "uri": "redis://localhost:6379",
      "ttl": 3600
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "transports": ["console", "file"]
  }
}
```

---

## CLI Commands

### Project Initialization

```bash
# Interactive setup
npx abimongo-core init

# Quick setup with minimal prompts
npx abimongo-core init --quick

# Enterprise setup with all features
npx abimongo-core init --enterprise
```

### Development Commands

```bash
# Generate new model
npx abimongo-core generate model User

# Generate GraphQL schema
npx abimongo-core generate graphql User

# Add multi-tenancy to existing project
npx abimongo-core add multi-tenant

# Update dependencies
npx abimongo-core update
```

---

## Best Practices

### Project Organization

- **Use TypeScript**: Enable type safety for better development experience
- **Follow Naming Conventions**: Use PascalCase for models, camelCase for properties
- **Implement Proper Error Handling**: Use structured error responses and logging
- **Enable Security Features**: Always configure RBAC and rate limiting for production

### Configuration Management

- **Environment Variables**: Store sensitive data in environment variables
- **Configuration Validation**: Validate configuration at startup
- **Documentation**: Keep your `abimongo.config.json` well-documented
- **Version Control**: Include configuration files in version control (excluding secrets)

### Development Workflow

```bash
# 1. Initialize project with security features
npx abimongo-core init my-app --typescript --graphql --rbac --rate-limit

# 2. Install dependencies
cd my-app && npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your security settings

# 4. Start development server with security enabled
npm run dev

# 5. Generate secure components
npx abimongo-core generate model User --rbac
npx abimongo-core generate graphql User --rbac
```

---

## Troubleshooting

### Common Issues

**Permission Denied**
```bash
# Fix: Ensure proper permissions
sudo chown -R $USER:$USER ./my-project
```

**MongoDB Connection Failed**
```bash
# Fix: Verify connection string and network access
npx abimongo-core validate --uri mongodb://localhost:27017/mydb
```

**Dependency Installation Issues**
```bash
# Fix: Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Compilation Errors**
```bash
# Fix: Update TypeScript configuration
npx abimongo-core update --typescript-config
```

### Advanced Debugging

Enable debug mode for detailed troubleshooting:

```bash
DEBUG=abimongo:* npx abimongo-core init --verbose
```

---

## Migration and Updates

### Upgrading Existing Projects

```bash
# Update to latest version
npx abimongo-core update

# Migrate configuration format
npx abimongo-core migrate --from 1.0 --to 2.0

# Add new features to existing project
npx abimongo-core add graphql rbac caching
```

### Breaking Changes

<!-- Refer to the [CHANGELOG.md](../../../CHANGELOG.md) for version-specific migration guides. -->

---

## Next Steps

- **Development**: Explore the [Getting Started Guide](../getting-started/installation.md)
- **API Reference**: Check the [API Documentation](../../api) for detailed method references
- **Advanced Features**: Learn about [Multi-Tenancy](../../docs/core-concepts/MultiTenancy.md) and [GraphQL Integration](../../docs/features/AbimongoGraphQL.md)
- **CLI Tools**: Master the [CLI Scaffolding Guide](../../docs/AbimongoCLI/CLI-Scaffolding.md)
<!-- - **Deployment**: Follow the [Production Deployment Guide](../../docs/guides/Deployment.md) -->

---

## Support and Community

- **GitHub Issues**: [Report bugs and request features](https://github.com/your-repo/abimongo_core_library/issues)
- **Documentation**: [Browse comprehensive guides](https://abimongo-core.github.io/docs)
- **Community**: [Join discussions on Discord](https://discord.gg/abimongo-core)
- **Enterprise Support**: [Contact us for commercial support](mailto:enterprise@abimongo-core.com)

---

## Security Features Integration

### RBAC (Role-Based Access Control) Configuration

When enabling RBAC during bootstrap, the following files are automatically generated:

**Generated `src/middleware/rbac.ts`**:
```typescript
import { enforceRBAC, checkPermission } from 'abimongo_core';

export const rbacConfig = {
  enabled: process.env.RBAC_ENABLED === 'true',
  caching: process.env.RBAC_CACHING === 'true',
  permissionTTL: parseInt(process.env.RBAC_TTL || '3600'),
};

export { enforceRBAC, checkPermission };
```

**Generated `config/roles.json`**:
```json
{
  "admin": ["create", "read", "update", "delete", "manage"],
  "user": ["create:own", "read:own", "update:own"],
  "guest": ["read:public"]
}
```

### Rate Limiting Setup

**Generated `src/middleware/rateLimit.ts`**:
```typescript
import rateLimit from 'express-rate-limit';

export const rateLimitConfig = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Bootstrap Integration Code

To integrate these security features in your bootstrap process, update your `AbimongoBootstrap` implementation:

**Update `src/core/bootstrap/AbimongoBootstrap.ts`**:
```typescript
export class AbimongoBootstrap {
  private async generateSecurityConfig(options: BootstrapOptions) {
    if (options.security?.rbac?.enabled) {
      await this.generateRBACFiles(options);
    }
    
    if (options.security?.rateLimit?.enabled) {
      await this.generateRateLimitFiles(options);
    }
  }

  private async generateRBACFiles(options: BootstrapOptions) {
    // Generate RBAC middleware
    const rbacMiddleware = `
import { enforceRBAC, checkPermission } from 'abimongo_core';

export const rbacConfig = {
  enabled: ${options.security.rbac.enabled},
  caching: ${options.security.rbac.caching},
};

export { enforceRBAC, checkPermission };
`;
    
    await this.writeFile('src/middleware/rbac.ts', rbacMiddleware);
    
    // Generate roles configuration
    const rolesConfig = {
      admin: ["create", "read", "update", "delete", "manage"],
      user: ["create:own", "read:own", "update:own"],
      guest: ["read:public"]
    };
    
    await this.writeFile('config/roles.json', JSON.stringify(rolesConfig, null, 2));
  }

  private async generateRateLimitFiles(options: BootstrapOptions) {
    const rateLimitMiddleware = `
import rateLimit from 'express-rate-limit';

export const rateLimitConfig = rateLimit({
  windowMs: ${options.security.rateLimit.windowMs},
  max: ${options.security.rateLimit.max},
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
`;
    
    await this.writeFile('src/middleware/rateLimit.ts', rateLimitMiddleware);
  }
}
```

### Environment Variables Setup

**Generated `.env.example`**:
```env
# Security Configuration
RBAC_ENABLED=true
RBAC_CACHING=true
RBAC_TTL=3600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX=100

# JWT Configuration (if authentication is enabled)
JWT_SECRET=your-super-secure-secret-key-here
JWT_EXPIRES_IN=24h
```

### CLI Command Integration

Update your CLI commands to support security flags:

```bash
# Enable RBAC during bootstrap
npx abimongo-core init my-app --rbac

# Enable rate limiting
npx abimongo-core init my-app --rate-limit

# Enable both security features
npx abimongo-core init my-app --rbac --rate-limit --auth
```

**CLI Implementation Example**:
```typescript
// In your CLI handler
export async function initCommand(projectName: string, options: CLIOptions) {
  const bootstrapOptions = {
    projectName,
    security: {
      rbac: {
        enabled: options.rbac || false,
        caching: options.rbacCaching || true,
      },
      rateLimit: {
        enabled: options.rateLimit || false,
        windowMs: options.rateLimitWindow || 15000,
        max: options.rateLimitMax || 100,
      }
    }
  };
  
  const bootstrap = new AbimongoBootstrap();
  await bootstrap.create(bootstrapOptions);
}
```
