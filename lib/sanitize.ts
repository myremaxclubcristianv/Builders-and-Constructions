/**
 * Lightweight HTML sanitizer for editorial content.
 * Strips script tags, inline event handlers, javascript: URIs, etc.
 */
export function sanitizeHtml(raw: string): string {
  if (!raw) return '';
  return raw
    // Remove script and iframe tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove on* event handlers (onclick, onload, onerror, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*[^ >]+/gi, '')
    // Remove javascript: and data: pseudo-protocols in links
    .replace(/href\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, 'href="#"')
    .replace(/href\s*=\s*(['"])\s*data:[^'"]*\1/gi, 'href="#"');
}
