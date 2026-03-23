// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = () => {
  try {
    return createBrowserClient(supabaseUrl!, supabaseKey!);
  } catch {
    // this doesn't need cookies
    return createSupabaseClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
};
