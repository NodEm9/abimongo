import { QueryInstrumentationMeta } from "./measureQueryWithErrors.js";

export async function measureQueryForBrowser<T>(
  _meta: QueryInstrumentationMeta,
  executor: () => Promise<T>
): Promise<T> {
  return executor();
}