import { TenantContext } from "../../tanancy";
// import { bufferedTransporter } from "../../utils";
import { shutdownLogger } from '@abimongo/logger';

describe("TenantContext", () => {
	afterEach(() => {
		// Clear any tenant context after each test
		TenantContext.clear();
	});

	it("should run a callback with the specified tenantId", done => {
		const tenantId = "tenant-123";
		TenantContext.run(tenantId, () => {
			expect(TenantContext.getTenantId()).toBe(tenantId);
			done();
		});
	});

	it("should return undefined if no tenantId is set", () => {
		expect(TenantContext.getTenantId()).toBeUndefined();
	});

	it("should allow setting and getting tenantId in the current context", done => {
		TenantContext.run("tenant-abc", () => {
			TenantContext.setTenantId("tenant-def");
			expect(TenantContext.getTenantId()).toBe("tenant-def");
			done();
		});
	});

	it("should clear the tenantId in the current context", done => {
		TenantContext.run("tenant-xyz", () => {
			expect(TenantContext.getTenantId()).toBe("tenant-xyz");
			TenantContext.clear();
			expect(TenantContext.getTenantId()).toBeUndefined();
			done();
		});
	});

	it("should isolate tenantId between different async contexts", done => {
		TenantContext.run("tenant-1", () => {
			setTimeout(() => {
				expect(TenantContext.getTenantId()).toBe("tenant-1");
				done();
			}, 10);
		});
	});

	it("should not leak tenantId between different runs", done => {
		TenantContext.run("tenant-a", () => {
			expect(TenantContext.getTenantId()).toBe("tenant-a");
			setImmediate(() => {
				TenantContext.run("tenant-b", () => {
					expect(TenantContext.getTenantId()).toBe("tenant-b");
					done();
				});
			});
		});
	});

	afterAll(async () => {
		jest.resetAllMocks();
		// await bufferedTransporter.stop();
		await shutdownLogger();
	});
});