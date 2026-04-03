import { AbimongoNestAdapterModule } from '../nestjs-adapter.module.js';

describe('AbimongoNestAdapterModule', () => {
  it('should create a dynamic module', () => {
    const mod = AbimongoNestAdapterModule.forRoot({
      tenancy: {
        header: 'x-tenant-id',
        fallback: 'default'
      },
      enableTransactions: true
    });

    expect(mod.module).toBe(AbimongoNestAdapterModule);
    expect(mod.providers).toBeDefined();
  });
});