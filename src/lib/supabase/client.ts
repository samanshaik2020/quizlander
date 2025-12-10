import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Use default cookie handling but ensure persistence
        get(name) {
          const cookies = document.cookie.split("; ");
          const cookie = cookies.find((c) => c.startsWith(`${name}=`));
          return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
        },
        set(name, value, options) {
          let cookieStr = `${name}=${encodeURIComponent(value)}`;
          if (options?.maxAge) {
            cookieStr += `; max-age=${options.maxAge}`;
          } else {
            // Default to 7 days if no maxAge specified
            cookieStr += `; max-age=${60 * 60 * 24 * 7}`;
          }
          cookieStr += `; path=${options?.path ?? "/"}`;
          if (options?.domain) cookieStr += `; domain=${options.domain}`;
          if (options?.sameSite) cookieStr += `; samesite=${options.sameSite}`;
          if (options?.secure) cookieStr += "; secure";
          document.cookie = cookieStr;
        },
        remove(name, options) {
          document.cookie = `${name}=; max-age=0; path=${options?.path ?? "/"}`;
        },
      },
    }
  );
}
