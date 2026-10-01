/**
 * Defense-in-depth HTML sanitizer for editorial and user-supplied content.
 * Strips executable tags, event handlers, dangerous pseudo-protocols.
 */
export function sanitizeHtml(raw: string): string {
  if (!raw) return '';
  return raw
    // Strip active scripting, framing, and embedded object tags
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    .replace(/<object\b[\s\S]*?<\/object>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    .replace(/<embed\b[\s\S]*?<\/embed>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<base\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<style\b[^>]*>/gi, '')
    // Remove all on* event handlers (quoted and unquoted)
    .replace(/\s+on[a-z0-9_-]+\s*=\s*(['\"]).*?\1/gi, '')
    .replace(/\s+on[a-z0-9_-]+\s*=\s*[^ >]+/gi, '')
    // Neutralize dangerous URI schemes in href, src, formaction, action
    .replace(/(href|src|action|formaction)\s*=\s*(['\"])\s*(javascript|vbscript|data(?!\s*:\s*image\/(png|jpeg|webp|gif);base64)):[^'\"]*\2/gi, '$1="#"')
    .replace(/(href|src|action|formaction)\s*=\s*(javascript|vbscript):[^\s>]+/gi, '$1="#"');
}

/**
 * Escapes unsafe characters in JSON-LD to prevent HTML script escape injection.
 */
export function safeJsonLdStringify(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
