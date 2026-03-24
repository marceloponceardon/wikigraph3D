// src/lib/supabase/server.ts
import { createClient as createServerClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

export const createClient = async () =>
  createServerClient(supabaseUrl!, supabaseKey!);
