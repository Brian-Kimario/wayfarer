import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./database.types";

export async function createRequestClient(
  authHeader?: string
): Promise<ReturnType<typeof createServerClient<Database>>> {
  const cookieStore = await cookies();

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in API routes
          }
        },
      },
    }
  );

  // If an Authorization header is provided (e.g., Bearer token), use it
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { error } = await client.auth.getUser(token);
    if (error) {
      // Return a client without the token; will fail at RLS level
      return client;
    }
    // Set session on client
    await client.auth.setSession({
      access_token: token,
      refresh_token: "",
    });
  }

  return client;
}
