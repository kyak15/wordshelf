"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClientWeb = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

interface QueryProviderWebProps {
  children: ReactNode;
}

export function QueryProviderWeb({ children }: QueryProviderWebProps) {
  return (
    <QueryClientProvider client={queryClientWeb}>
      {children}
    </QueryClientProvider>
  );
}

export { queryClientWeb };
