
export interface AbimongoGraphQLOptions {
  useRedis?: boolean;
  defaultResolvers?: any[];
  customTypeDefs?: string[];
  customResolvers?: any[];
  enablePlayground?: boolean;
  enableSubscriptions?: boolean;
  schemaOutputPath?: string;
}
