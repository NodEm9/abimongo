## Troubleshooting: Context Resolution

If you encounter issues where `AbimongoContext` is `undefined` or tenant/session data is missing, review the following common scenarios:

---

### 1. Context Loss in Asynchronous Operations

`AsyncLocalStorage` preserves context across most async boundaries, but context can be lost when execution is detached from the original request lifecycle.

**The issue:**
- Using `setTimeout`, background jobs, or event emitters
- Fire-and-forget async functions (not awaited)
- External libraries that do not preserve async context

**The fix:**
- Ensure all async operations are properly awaited within the request handler
- For out-of-band execution, explicitly re-bind context:

```ts
AbimongoContext.run({ tenantId, requestId }, async () => {
  // safe execution
});