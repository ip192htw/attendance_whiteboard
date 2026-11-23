import * as Sentry from "@sentry/nextjs";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () => {
  const client = createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );

  Sentry.instrumentSupabaseClient(client);
  return client;
}
