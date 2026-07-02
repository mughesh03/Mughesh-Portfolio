import DOMPurify from 'dompurify'

export const ensureHttp = (value) => {
  if (!value) return ''
  const v = String(value).trim()
  if (!v) return ''
  if (/^https?:\/\//i.test(v)) return v
  if (/^mailto:|^tel:/i.test(v)) return v
  return 'https://' + v
}

// Strip ChatGPT / editor junk that leaks into pasted descriptions.
const stripJunk = (html) => {
  if (!html) return ''
  let s = String(html)
  s = s.replace(/<!--\s*(Start|End)Fragment\s*-->/gi, '')
  s = s.replace(/<!--[\s\S]*?-->/g, '')
  // Kill obvious ChatGPT-web wrapper garbage without touching real markup.
  s = s.replace(/<(section|article|main|nav|header|footer|figure|figcaption|aside)\b[^>]*>/gi, '<div>')
  s = s.replace(/<\/(section|article|main|nav|header|footer|figure|figcaption|aside)>/gi, '</div>')
  // Trim empty trailing whitespace
  return s.trim()
}

const ALLOWED_TAGS = [
  'p', 'div', 'span', 'br', 'strong', 'em', 'b', 'i', 'u',
  'ul', 'ol', 'li', 'a', 'small', 'code', 'pre', 'blockquote',
  'h3', 'h4', 'h5', 'h6'
]

export const sanitizeRichText = (html) => {
  const cleaned = stripJunk(html)
  const purified = DOMPurify.sanitize(cleaned, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ADD_ATTR: ['target'],
    FORBID_ATTR: ['style', 'class', 'id'],
    RETURN_TRUSTED_TYPE: false
  })
  return purified
}

// Extract description as bullet list items, if possible; otherwise return null.
export const extractBullets = (html) => {
  if (!html) return null
  const cleaned = sanitizeRichText(html)
  if (typeof document === 'undefined') return null
  const wrap = document.createElement('div')
  wrap.innerHTML = cleaned
  const lis = wrap.querySelectorAll('li')
  if (!lis.length) return null
  return Array.from(lis).map((li) => li.innerHTML.trim()).filter(Boolean)
}

export const plainText = (html) => {
  if (!html) return ''
  const wrap = document.createElement('div')
  wrap.innerHTML = sanitizeRichText(html)
  return (wrap.textContent || '').replace(/\s+/g, ' ').trim()
}
