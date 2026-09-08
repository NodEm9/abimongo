# NestJS Adapter

The NestJS adapter integrates Abimongo using interceptors.

---

## Installation

```bash
npm install @abimongo/adapter-nestjs
```

## Usage

```ts
import { Module } from '@nestjs/common';
import { AbimongoNestAdapterModule } from '@abimongo/adapter-nestjs';

@Module({
  imports: [
    AbimongoNestAdapterModule.forRoot({
      tenancy: {
        header: 'x-tenant-id',
        fallback: 'default'
      },
      enableTransactions: true
    })
  ]
})
export class AppModule {}
```

### How it works

- Registers a global NestJS interceptor.
- Intercepts every request.
- Initializes AbimongoContext.
- Wraps execution if transactions are enabled.

### Example service

```ts
@Injectable()
export class UserService {
  async getUsers() {
    return UserModel.find({});
  }
}
```

No manual session/context handling required.

### Why interceptor

NestJS interceptors:

- wrap request lifecycle.
- support async execution.
- integrate cleanly with DI.

### When to use

Use this adapter if:

- you are building enterprise apps with NestJS.
- you want structured architecture with DI.
