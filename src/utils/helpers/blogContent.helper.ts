// Matches a bare http(s) URL in plain text.
// Excludes spaces, HTML-reserved characters and quotes so we never
// accidentally capture surrounding markup or href attribute values.
const URL_PATTERN = /(?:https?:\/\/)[^\s<>"']+/g

// Matches URLs that are already used as the value of an href/src attribute.
const ATTRIBUTE_URL_PATTERN = /(\s(?:href|src)=")([^"]*https?:\/\/[^"]*)(")/gi

// Builds the anchor markup for a single URL discovered in the content.
const toAnchorMarkup = (url: string) =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`

/**
 * Regex-only fallback used in non-browser environments. It temporarily masks
 * URLs that already live inside `href`/`src` attribute values so the later
 * linkify pass never double-wraps them, then restores the masked values.
 */
function fallbackLinkify(html: string): string {
    const maskedValues: string[] = []
    const masked = html.replace(
        ATTRIBUTE_URL_PATTERN,
        (_match, prefix, url, suffix) => {
            const token = `__URL_MASK_${maskedValues.length}__`
            maskedValues.push(`${prefix}${url}${suffix}`)
            return token
        },
    )
    const linked = masked.replace(URL_PATTERN, toAnchorMarkup)
    return linked.replace(
        /__URL_MASK_(\d+)__/g,
        (_match, index) => maskedValues[Number(index)],
    )
}

/**
 * Rewrites every bare `http://` / `https://` URL found inside a rich-text
 * HTML string (e.g. from the TipTap editor) into a clickable `<a>` element,
 * so the backend receives anchor tags instead of plain-text links.
 *
 * URLs that are already wrapped inside an existing `<a>` element - or that
 * appear as `href` / `src` attribute values - are intentionally left
 * untouched to avoid nested, doubled links.
 */
export function linkifyUrlsInHtml(html: string): string {
    if (!html || typeof html !== 'string') return html

    // DOM-based path (browser). Safest approach because it only rewrites
    // text nodes, so existing anchors and attribute values are never touched.
    if (typeof DOMParser !== 'undefined') {
        const doc = new DOMParser().parseFromString(html, 'text/html')
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
        const textNodes: Text[] = []

        while (walker.nextNode()) {
            const node = walker.currentNode as Text
            // Skip text that already lives inside a link.
            if (node.parentElement?.closest('a')) continue
            textNodes.push(node)
        }

        textNodes.forEach((node) => {
            const original = node.textContent
            if (!original) return
            const linked = original.replace(URL_PATTERN, toAnchorMarkup)
            if (linked === original) return

            const wrapper = doc.createElement('span')
            wrapper.innerHTML = linked
            node.replaceWith(...Array.from(wrapper.childNodes))
        })

        return doc.body.innerHTML
    }

    // Fallback regex path for non-browser (SSR / Node test) environments.
    return fallbackLinkify(html)
}
