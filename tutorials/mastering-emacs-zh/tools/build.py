#!/usr/bin/env python3
"""把 web/sections/*.html 拼进 web/template.html，产出 dist/mastering-emacs-zh.html。

用法（工作区根为 ~/Projects）：
    python3 Emacs/mastering-emacs-zh/tools/build.py
"""
import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SECTIONS = ROOT / "web" / "sections"
TEMPLATE = ROOT / "web" / "template.html"
OUT = ROOT / "dist" / "mastering-emacs-zh.html"

ID_RE = re.compile(r'<section class="ch" id="([^"]+)"[^>]*data-stage="([^"]+)"[^>]*data-min="(\d+)"', re.S)
TITLE_RE = re.compile(r'<h2 class="ch-title">(.*?)</h2>', re.S)
STRIP_RE = re.compile(r"<[^>]+>")
LEAD_RE = re.compile(r'<p class="ch-lead">(.*?)</p>', re.S)


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def main() -> int:
    if not TEMPLATE.exists():
        print(f"FATAL: 模板不存在 {TEMPLATE}")
        return 2
    files = sorted(SECTIONS.glob("*.html"))
    if not files:
        print(f"FATAL: {SECTIONS} 下没有章节文件")
        return 2

    nav_parts, bodies, seen = [], [], set()
    total_min = 0
    for path in files:
        raw = path.read_text(encoding="utf-8")
        m = ID_RE.search(raw)
        if not m:
            print(f"FATAL: {path.name} 缺少规范的 <section class=\"ch\" id= data-stage= data-min=>")
            return 2
        sec_id, stage, mins = m.group(1), m.group(2), int(m.group(3))
        if sec_id in seen:
            print(f"FATAL: 章节 id 重复 {sec_id}")
            return 2
        seen.add(sec_id)
        title_m = TITLE_RE.search(raw)
        if not title_m:
            print(f"FATAL: {path.name} 缺少 <h2 class=\"ch-title\">")
            return 2
        title = STRIP_RE.sub("", title_m.group(1)).strip()
        lead_m = LEAD_RE.search(raw)
        lead = STRIP_RE.sub("", lead_m.group(1)).strip() if lead_m else ""
        total_min += mins

        nav_parts.append(
            f'<li class="nav-item" data-stage="{esc(stage)}">'
            f'<a href="#{esc(sec_id)}" data-target="{esc(sec_id)}">'
            f'<span class="nav-stage">{esc(stage)}</span>'
            f'<span class="nav-title">{esc(title)}</span>'
            f'<span class="nav-lead">{esc(lead)}</span>'
            f'<span class="nav-meta">{mins} 分钟</span>'
            f"</a></li>"
        )
        bodies.append(raw.strip())

    tpl = TEMPLATE.read_text(encoding="utf-8")
    for token, value in (("{{NAV}}", "\n".join(nav_parts)),
                         ("{{SECTIONS}}", "\n\n".join(bodies)),
                         ("{{SECTION_COUNT}}", str(len(files))),
                         ("{{TOTAL_MIN}}", str(total_min))):
        if token not in tpl:
            print(f"FATAL: 模板缺少占位符 {token}")
            return 2
        tpl = tpl.replace(token, value)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(tpl, encoding="utf-8")
    size = OUT.stat().st_size
    print(f"OK 章节数={len(files)} 总时长≈{total_min}分钟 产物={OUT} 体积={size:,d} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
