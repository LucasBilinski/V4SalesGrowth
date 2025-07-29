import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Use a global variable to cache the admin client instance.
// This prevents creating a new client on every call in development due to hot-reloading.
declare global {
  var supabaseAdminInstance: SupabaseClient | undefined
}

/**
 * Returns a singleton instance of the Supabase admin client.
 * Lazily initializes the client on the first call.
 */
export const getSupabaseAdmin = (): SupabaseClient => {
  if (global.supabaseAdminInstance) {
    return global.supabaseAdminInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // This provides a clearer error message than the Supabase client's default.
    throw new Error("Supabase URL or Service Role Key is missing from environment variables.")
  }

  global.supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return global.supabaseAdminInstance
}
