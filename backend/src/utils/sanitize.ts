/**
 * Input Sanitization Utilities
 * =============================
 * All user-supplied content MUST be sanitized before storage.
 *
 * Two modes:
 *  - sanitizeText()     → Strips ALL HTML.  Use for titles, names, slugs,
 *                         commit messages, branch names, etc.
 *  - sanitizeRichText() → Allows a safe subset of HTML tags/attributes.
 *                         Use for body content, descriptions, markdown-rendered
 *                         text that may contain basic formatting.
 */

import sanitizeHtml from 'sanitize-html';

// ─── Safe tag/attribute allowlist for rich-text fields ───────────────────────

const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'b', 'i', 'em', 'strong', 'u', 's', 'del',
    'p', 'br', 'hr',
    'h1', 'h2', 'h3', 'h4',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img',
    'span', 'div',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    code: ['class'],    // For syntax-highlighting class names
    span: ['class'],
    div:  ['class'],
    td:   ['colspan', 'rowspan'],
    th:   ['colspan', 'rowspan'],
  },
  // Force safe values on anchor elements
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
  // Disallow data URIs in src attributes (prevents data: XSS)
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https'],
  },
  allowedSchemesAppliedToAttributes: ['href', 'src'],
};

// ─── No-HTML allowlist — strips every tag ─────────────────────────────────────

const TEXT_ONLY_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Strip ALL HTML from `value`.
 * Use for: titles, names, slugs, labels, commit messages, branch names.
 * Returns empty string for null/undefined inputs.
 */
export function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return sanitizeHtml(value.trim(), TEXT_ONLY_OPTIONS);
}

/**
 * Allow a safe subset of HTML in `value`.
 * Use for: body/description fields intended to display formatted content.
 * Returns empty string for null/undefined inputs.
 */
export function sanitizeRichText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return sanitizeHtml(value.trim(), RICH_TEXT_OPTIONS);
}
