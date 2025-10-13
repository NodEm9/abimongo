# CLI Scaffolding with Abimongo_CLI

The **Abimongo_CLI** is a command-line tool designed to simplify and accelerate the development process when using the **Abimongo_Core_Library**. It provides scaffolding capabilities to generate boilerplate code for models, schemas, and other components, ensuring consistency and reducing manual effort.

---
 
## Key Features

- **Model and Schema Generation**: Automatically generate MongoDB models and schemas.
- **Multi-Tenancy Support**: Generate tenant-aware models and configurations.
- **GraphQL Integration**: Scaffold GraphQL type definitions and resolvers.
- **Customizable Templates**: Use or modify templates to fit your project’s requirements.
- **Ease of Use**: Simple commands to scaffold components quickly.

---

## Installation

To use the CLI, install it globally or as a dev dependency in your project.

### Global Installation

```bash
npm install -g abimongo_cli
```

### Local Installation

```bash
npm install --save-dev abimongo_cli
```

---

## Getting Started

### Step 1: Initialize the Workspace

Run the following command to initialize your project with **Abimongo_CLI**:

```bash
abimongo init
```

This command sets up the necessary configuration files and directories for your project.

---

### Step 2: Generate a Model and Schema

Use the `generate` command to scaffold a new model and schema.

```bash
abimongo generate model User
```

This command generates the following files:

- `src/models/UserModel.ts`: The MongoDB model.
- `src/schemas/UserSchema.ts`: The schema definition.

#### Example Output

```plaintext
✔ Model generated: src/models/UserModel.ts
✔ Schema generated: src/schemas/UserSchema.ts
```

---

### Step 3: Generate GraphQL Components

To scaffold GraphQL type definitions and resolvers, use the `generate` command with the `--graphql` flag.

```bash
abimongo generate model User --graphql
```

This command generates the following additional files:

- `src/graphql/types/UserType.ts`: The GraphQL type definition.
- `src/graphql/resolvers/UserResolver.ts`: The GraphQL resolvers.

#### Example Output

```plaintext
✔ Model generated: src/models/UserModel.ts
✔ Schema generated: src/schemas/UserSchema.ts
✔ GraphQL type generated: src/graphql/types/UserType.ts
✔ GraphQL resolver generated: src/graphql/resolvers/UserResolver.ts
```

---

### Step 4: Generate Multi-Tenant Models

To generate tenant-aware models, use the `--multi-tenant` flag.

```bash
abimongo generate model User --multi-tenant
```

This command ensures that the generated model is compatible with the multi-tenancy features of **Abimongo_Core_Library**.

---

## CLI Commands

### `abimongo init`

Initializes the project with the necessary configuration files and directories.

#### Example

```bash
abimongo init
```

---

### `abimongo generate`

Generates boilerplate code for models, schemas, and other components.

#### Syntax

```bash
abimongo generate <type> <name> [options]
```

#### Parameters

- `<type>`: The type of component to generate (e.g., `model`, `schema`, `graphql`).
- `<name>`: The name of the component (e.g., `User`).

#### Options

- `--graphql`: Generates GraphQL type definitions and resolvers.
- `--multi-tenant`: Generates tenant-aware models.
- `--path <path>`: Specifies a custom path for the generated files.

#### Example

```bash
abimongo generate model Product --graphql --multi-tenant
```

---

### `abimongo help`

Displays help information for the CLI.

#### Example

```bash
abimongo help
```

---

## Customizing Templates

The CLI uses default templates to generate files. You can customize these templates to fit your project’s requirements.

### Step 1: Copy the Default Templates

Run the following command to copy the default templates to your project:

```bash
abimongo templates
```

This command creates a `templates` directory in your project.

---

### Step 2: Modify the Templates

Edit the templates in the `templates` directory to customize the generated files.

---

## Example Workflow

Here’s a complete example workflow using **Abimongo_CLI**:

1. **Initialize the Project**:
  
  ```bash
   abimongo init
   ```

2. **Generate a User Model with GraphQL Support**:

   ```bash
   abimongo generate model User --graphql
   ```

3. **Generate a Product Model with Multi-Tenancy**:

   ```bash
   abimongo generate model Product --multi-tenant
   ```

4. **Customize Templates**:

   ```bash
   abimongo templates
   ```

---

## Best Practices

1. **Use Consistent Naming**:
   - Follow a consistent naming convention for models and schemas.

2. **Leverage Multi-Tenancy**:
   - Use the `--multi-tenant` flag for tenant-aware applications.

3. **Customize Templates**:
   - Modify the default templates to align with your project’s coding standards.

4. **Integrate with Version Control**:
   - Commit the generated files to your version control system for better collaboration.

---

## Troubleshooting

### Common Issues

1. **Command Not Found**:
   - Ensure the CLI is installed globally or locally in your project.
   - Verify the installation with `abimongo --version`.

2. **File Overwrite**:
   - Use the `--path` option to specify a custom path for generated files to avoid overwriting existing files.

3. **Template Errors**:
   - Ensure the templates in the `templates` directory are correctly formatted.

---

## Next Steps

- Explore the [API Documentation](/api) for detailed information on the generated components.
- Check out the [Getting Started Guide](/getting-started/installation.md) for installation instructions.

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/your-repo/abimongo_core_library).
