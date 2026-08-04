#!/usr/bin/env python3
"""Convert the Claude Design .dc.html template into a Next.js TSX page.

Mechanical, not interpretive. Every inline style string is carried across
verbatim; the only transforms are the ones React/Next actually require:

  style="..."          -> style={{ ... }}   (same declarations, camelCased keys)
  style-hover="..."    -> a class + `.cls:hover { ...!important }` rule, which is
  style-active="..."     exactly what dc-runtime's support.js does at runtime
                         (see createPseudoSheet/importantify in support.js)
  {{ marqueeState }}   -> resolved from the .dc script's renderVals() defaults
  <sc-if value="...">  -> unwrapped (condition is true under default props)
  assets/...           -> /...  (public/ is the Next static root)
  <a href="/...">      -> <Link href="/..."> for in-site routes, which renders
                         the identical anchor but navigates client-side. Hash-only
                         links (#work) stay plain <a>.
"""

from __future__ import annotations

import html.parser
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent  # design/import/
REPO = HERE.parent.parent
SRC = HERE / "home.dc.html"

VOID = {"img", "link", "meta", "br", "hr", "input", "source"}

# Resolved from the .dc <script>'s renderVals() with default props
# (staticMarquee=false, hidePlaceholderBadges=false).
RENDER_VALS = {"marqueeState": "running", "showBadges": True}

# Readable class names for each distinct pseudo-state style group. Keyed by
# "<hover css>|<active css>" exactly as it appears in the template; anything
# unmatched falls back to dc-N and prints a warning, so nothing is silently lost.
CLASS_NAMES = {
    "color: var(--nav-ink); text-decoration: underline; text-underline-offset: 4px;|": "mm-nav-link",
    "color: var(--marquee-ink); text-decoration: underline; text-underline-offset: 4px;|": "mm-marquee-link",
    "background: var(--accent-hover); color: var(--accent-ink);|transform: translateY(var(--press-shift));": "mm-btn-primary",
    "background: var(--brand-white); color: var(--brand-black);|transform: translateY(var(--press-shift));": "mm-btn-cream",
    "color: var(--accent);|": "mm-link-accent",
    "color: var(--ink);|": "mm-work-card",
    "transform: scale(1.03);|": "mm-work-card-img",
    "color: var(--accent); text-decoration: underline; text-underline-offset: 4px;|": "mm-footer-link",
}


# ── tree building ────────────────────────────────────────────────────────────
class Node:
    def __init__(self, tag: str, attrs: list[tuple[str, str | None]]):
        self.tag = tag
        self.attrs = attrs
        self.kids: list = []


class Builder(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].kids.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].kids.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].kids.append(data)


# ── css helpers ──────────────────────────────────────────────────────────────
def split_top(s: str, sep: str) -> list[str]:
    """Split on `sep` only at paren depth 0 (keeps rgb()/clamp()/var() intact)."""
    out, depth, start = [], 0, 0
    for i, c in enumerate(s):
        if c == "(":
            depth += 1
        elif c == ")":
            depth = max(0, depth - 1)
        elif c == sep and depth == 0:
            out.append(s[start:i])
            start = i + 1
    out.append(s[start:])
    return out


def decls(style: str) -> list[tuple[str, str]]:
    pairs = []
    for chunk in split_top(style, ";"):
        chunk = chunk.strip()
        if not chunk:
            continue
        head, _, tail = chunk.partition(":")
        pairs.append((head.strip(), tail.strip()))
    return pairs


def camel(prop: str) -> str:
    if prop.startswith("--"):
        return prop
    parts = prop.split("-")
    if parts[0] == "":  # -webkit-foo -> WebkitFoo
        parts = parts[1:]
        return "".join(p.capitalize() for p in parts[:1]) + "".join(
            p.capitalize() for p in parts[1:]
        )
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def important(css: str) -> str:
    """Mirror support.js importantify(): every declaration gets !important."""
    out = []
    for d in split_top(css, ";"):
        d = d.strip()
        if d:
            out.append(d if re.search(r"!\s*important$", d, re.I) else d + " !important")
    return "; ".join(out) + ";"


# ── jsx emission ─────────────────────────────────────────────────────────────
ATTR_MAP = {"class": "className", "for": "htmlFor", "crossorigin": "crossOrigin"}

pseudo_groups: dict[str, str] = {}  # "hover|active" -> class name
used_link: set[bool] = set()
unnamed = 0


def class_for(hover: str, active: str) -> str:
    global unnamed
    key = f"{hover}|{active}"
    if key in pseudo_groups:
        return pseudo_groups[key]
    name = CLASS_NAMES.get(key)
    if name is None:
        unnamed += 1
        name = f"dc-{unnamed}"
        print(f"WARNING: unnamed pseudo group -> {name}: {key}", file=sys.stderr)
    pseudo_groups[key] = name
    return name


def jsx_text(t: str) -> str:
    return (
        t.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("{", "&#123;")
        .replace("}", "&#125;")
        .replace("'", "&#39;")
        .replace('"', "&quot;")
    )


def style_object(style: str, indent: str, one_line: bool = False) -> str:
    entries = []
    for prop, val in decls(style):
        key = camel(prop)
        if not re.fullmatch(r"[A-Za-z][A-Za-z0-9]*", key):
            key = f'"{key}"'
        entries.append(f'{key}: "{val}"')
    one = "{{ " + ", ".join(entries) + " }}"
    if one_line or len(one) + len(indent) <= 96:
        return one
    inner = "".join(f"\n{indent}    {e}," for e in entries)
    return "{{" + inner + f"\n{indent}  }}}}"


def rewrite_src(v: str) -> str:
    """public/assets/ mirrors the export's assets/ folder verbatim, so the only
    change a src needs is the leading slash.

    Do NOT remap onto public/brand/ or public/work/. The export's
    assets/brand/wordmark-cream.png is the *trimmed* 1501x245 artwork, whereas
    public/brand/wordmark-cream.png is a different, square, transparent-padded
    2000x2000 file. Pointing at the latter renders the 250px-wide logo 250px
    tall and inflates the 56px header to ~275px.
    """
    return v if v.startswith(("/", "http")) else "/" + v


def emit(node, indent: str, one_line: bool = False) -> list[str]:
    if isinstance(node, str):
        return [indent + jsx_text(node)]

    if node.tag == "sc-if":  # true under default props -> render children
        return emit_children(node, indent)

    attrs = dict(node.attrs)
    hover = attrs.pop("style-hover", "") or ""
    active = attrs.pop("style-active", "") or ""
    attrs.pop("hint-placeholder-val", None)

    parts = []
    for name, val in attrs.items():
        val = "" if val is None else val
        if name == "style":
            continue
        if name == "src":
            val = rewrite_src(val)
        parts.append(f'{ATTR_MAP.get(name, name)}="{val}"')

    if hover or active:
        parts.append(f'className="{class_for(hover, active)}"')

    # Any real text among the children means this is an inline formatting
    # context: the element and everything under it goes on one line so JSX
    # preserves the exact spacing around the inline children.
    inline_ctx = any(isinstance(k, str) and k.strip() for k in node.kids)

    if "style" in attrs:
        parts.append("style=" + style_object(attrs["style"], indent, one_line))

    # In-site routes go through next/link for client-side navigation. It renders
    # the same <a> with the same attributes, so the markup is unchanged; only
    # same-page hash links stay plain anchors.
    tag = node.tag
    if tag == "a" and attrs.get("href", "").startswith("/"):
        tag = "Link"
        used_link.add(True)

    attr_str = (" " + " ".join(parts)) if parts else ""
    open_line = f"{indent}<{tag}{attr_str}"

    if tag in VOID:
        return [open_line + " />"]

    if inline_ctx:
        inline = "".join(inline_child(k) for k in node.kids)
        return [f"{open_line}>{inline}</{tag}>"]

    kids = emit_children(node, indent + "  ")
    if not kids:
        return [open_line + " />"]

    return [open_line + ">", *kids, f"{indent}</{tag}>"]


def inline_child(k) -> str:
    if isinstance(k, str):
        return jsx_text(k)
    return "".join(emit(k, "", one_line=True))


def emit_children(node, indent: str) -> list[str]:
    out = []
    for k in node.kids:
        if isinstance(k, str):
            if not k.strip():
                continue  # whitespace-only between block/flex/grid children
            out.append(indent + jsx_text(k))
        else:
            out.extend(emit(k, indent))
    return out


# ── run ──────────────────────────────────────────────────────────────────────
src = SRC.read_text(encoding="utf-8")

tpl = src[src.index("<x-dc>") + len("<x-dc>") : src.rindex("</x-dc>")]
tpl = tpl[tpl.index("</helmet>") + len("</helmet>") :]

for name, val in RENDER_VALS.items():
    tpl = tpl.replace("{{ " + name + " }}", str(val) if not isinstance(val, bool) else "")

b = Builder()
b.feed(tpl)

roots = [k for k in b.root.kids if not isinstance(k, str)]
assert len(roots) == 1, f"expected one root element, got {len(roots)}"

body = emit(roots[0], "    ")

tsx = [
    *(["import Link from \"next/link\";", ""] if used_link else []),
    "/**",
    " * Home — a direct port of the Claude Design source of truth,",
    ' * `MaeMüllen Home.dc.html` (design project 6e562fdc). Generated from that',
    " * file, not hand-copied: inline styles are carried across declaration for",
    " * declaration, and the `style-hover` / `style-active` attributes become the",
    " * `mm-*` rules in globals.css — the same class + !important treatment the",
    " * design runtime applies at preview time.",
    " *",
    " * Regenerate rather than hand-edit when the design file changes.",
    " */",
    "export default function Home() {",
    "  return (",
    *body,
    "  );",
    "}",
    "",
]
(REPO / "app" / "page.tsx").write_text("\n".join(tsx), encoding="utf-8")

css = [
    "/* ── Pseudo-state styles ───────────────────────────────────────────────",
    "   Generated from the design file's style-hover / style-active attributes.",
    "   dc-runtime applies these as a class rule with every declaration marked",
    "   !important so it beats the element's own inline style; same here, so the",
    "   hover behaviour matches the design preview exactly. ── */",
]
for key, cls in pseudo_groups.items():
    hover, _, active = key.partition("|")
    if hover:
        css.append(f".{cls}:hover {{ {important(hover)} }}")
    if active:
        css.append(f".{cls}:active {{ {important(active)} }}")
(HERE / "pseudo.css").write_text("\n".join(css) + "\n", encoding="utf-8")

print(f"wrote app/page.tsx ({len(body)} lines)")
print(f"wrote design/import/pseudo.css ({len(pseudo_groups)} pseudo-state groups)")
print("  -> paste pseudo.css into the matching block in app/globals.css if it changed")
