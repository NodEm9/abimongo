# AbimongoBootstrap: Rapid Project Initialization

The `AbimongoBootstrap` class is a core utility in the **Abimongo_Core** ecosystem, designed to streamline the process of bootstrapping new Abimongo_Core applications. It automates the creation of essential configuration files, scaffolds project structure, and installs required dependencies, enabling developers to get started quickly and consistently.

---

## Key Features

- **Automated Project Scaffolding**: Sets up the recommended folder structure for Abimongo_Core projects.
- **JSON Configuration Generation**: Creates a ready-to-use `abimongo.config.json` file for project settings.
- **Dependency Installation**: Installs `abimongo_core` and other required packages automatically.
- **Customizable Setup**: Allows you to specify project name, database URI, and other options interactively or via CLI flags.
- **Best Practices**: Ensures your project follows Abimongo_Core conventions from the start.

---

## How It Works

When you run the bootstrap command (typically via the CLI), `AbimongoBootstrap`:

1. **Prompts for Project Details**: Collects information such as project name, MongoDB URI, and other preferences.
2. **Generates Configuration Files**: Creates an `abimongo.config.json` file with your settings.
3. **Scaffolds Project Structure**: Sets up directories for models, schemas, controllers, and more.
4. **Installs Dependencies**: Runs `npm install abimongo_core` and any other required packages.
5. **Creates Example Files**: Optionally generates example models, schemas, and starter code.

---

## Usage

### Step 1: Run the Bootstrap Command

You can invoke the bootstrap process using the CLI:

```bash
 npx abimongo-core init 
```

You will be prompted for:

- Project name
- MongoDB connection URI
- Whether to enable multi-tenancy
- Whether to include example files

Alternatively, you can pass options directly:

```bash
 npx abimongo-core init --logger --projectName my-abimongo-app --uri mongodb://localhost:27017/mydb --multi-tenant
```

---

### Step 2: Review Generated Files

After running the bootstrap command, your project directory will include:

- `abimongo.config.json`: Main configuration file for your Abimongo_Core app.
- `src/models/`: Directory for your MongoDB models.
- `src/schemas/`: Directory for your schema definitions.
- `src/controllers/`: (Optional) Directory for controllers or business logic.
- `src/index.ts` or `src/app.ts`: Starter entry point for your application.
- `package.json`: Updated with `abimongo_core` as a dependency.

---

### Step 3: Install Dependencies

If not already done by the bootstrap process, install dependencies:

```bash
npm install
```

---

### Step 4: Start Developing

You can now start defining your schemas, models, and business logic using the Abimongo_Core framework.

---

## Example: Generated `abimongo.config.json`

```json
{
  "projectName": "my-abimongo-app",
  "mongoUri": "mongodb://localhost:27017/mydb",
  "multiTenancy": true,
  "graphql": {
    "enabled": true,
  },
  "features": {
    "modelsDir": "src/models",
    "schemasDir": "src/schemas"
  }
}
```

---

## Customization

You can edit the `abimongo.config.json` file to update your project settings at any time. The bootstrap process is designed to be idempotent—running it again will not overwrite your existing work unless you choose to.

---

## Best Practices

- **Use the Bootstrapper for Every New Project**: Ensures consistency and saves time.
- **Keep Configuration in Version Control**: Commit your `abimongo.config.json` and other generated files.
- **Review Example Files**: Use or modify the generated examples to fit your application needs.
- **Update Dependencies Regularly**: Keep `abimongo_core` and related packages up to date.

---

## Troubleshooting

### Common Issues

- **Permission Denied**: Ensure you have write permissions in your project directory.
- **Dependency Installation Fails**: Check your internet connection and npm registry settings.
- **Invalid MongoDB URI**: Double-check the format of your MongoDB connection string.

---

## Next Steps

- Explore the [Getting Started Guide](getting-started/installation.md) for more on using Abimongo_Core.
- Check out the [API Documentation](/api/) for details on available classes and methods.
- Use the [CLI Scaffolding Guide](./CLI-Scaffolding.md) for more advanced CLI features.

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/your-repo/abimongo_core_library).
