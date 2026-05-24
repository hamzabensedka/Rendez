/**
 * Fallback typings when `@tanstack/react-query` is not installed in the current pnpm virtual store.
 * Delete this file after a successful `pnpm install` at the repo root so real package types apply.
 */
declare module '@tanstack/react-query' {
  import type { ComponentType, ReactNode } from 'react';

  export class QueryClient {
    constructor(config?: Record<string, unknown>);
    clear(): void;
  }

  export const QueryClientProvider: ComponentType<{
    client: QueryClient;
    children?: ReactNode;
  }>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useQuery(options: any): any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useMutation(options: any): any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useQueryClient(): any;
}
