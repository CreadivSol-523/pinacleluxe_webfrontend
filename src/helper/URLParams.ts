// utils/url.ts
export function URLParams(base: string, params: Record<string, any>): string {
     const searchParams = new URLSearchParams();

     Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          // skip empty string as well
          if (typeof value === 'string' && value.trim() === '') return;

          // If value is an array, append each
          if (Array.isArray(value)) {
               value.forEach(v => searchParams.append(key, String(v)));
          } else {
               searchParams.append(key, String(value));
          }
     });

     const queryString = searchParams.toString();
     // Ensure base does not have trailing slash or handle relative URL construction cleanly without passing absolute base to new URL()
     const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
     return queryString ? `${cleanBase}?${queryString}` : cleanBase;
}
