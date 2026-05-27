import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Removed throwIfResNotOk function to eliminate SSRF vulnerability

export async function apiRequest(
_url: string, _options?: RequestInit): Promise<Response> {
  // For static website, return mock response
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T>(_options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T | null> =>
  async ({ queryKey }) => {
    // For static website, return null for auth queries
    if (queryKey[0] === '/api/auth/user') {
      return null;
    }
    return null as T | null;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn<any>({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
