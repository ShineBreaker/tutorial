#!/usr/bin/env python3
"""把 mastering-emacs-v5.pdf 切成按章节分块的纯文本，供各子智能体分头精读。

每块同时写入:
  text/<slug>.md      该章节正文（带页码标记，便于引用）
  text/<slug>.toc.md  该章节的原始目录条目
"""
import pathlib
import sys

import pymupdf

PDF = sys.argv[1]
OUT = pathlib.Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

# (slug, 标题, 起始页(1-based), 结束页(1-based), 该块覆盖的 PDF 目录条目)
BLOCKS = [
    ("01-why-emacs",      "导论与 Emacs 之道",        8,   38,  "Introduction + The Way of Emacs"),
    ("02-first-steps",    "上手：安装、界面、按键、配置", 38,  85,  "First Steps"),
    ("03-movement-a",     "移动理论（一）：基础、窗口、标签页", 85, 114, "The Theory of Movement / Basics, Window, Frame, Tab Bars"),
    ("04-movement-b",     "移动理论（二）：基本移动、书签寄存器、选区", 114, 154, "Elemental Movement, Bookmarks and Registers, Selections and Regions"),
    ("05-movement-c",     "移动理论（三）：搜索与索引", 154, 190, "Searching and Indexing (Isearch, Occur, Imenu, Helm, IDO, Grep)"),
    ("06-editing-a",      "编辑理论（一）：杀死/粘贴、转置、填充、注释", 190, 209, "Killing and Yanking, Transposing, Filling and Commenting"),
    ("07-editing-b",      "编辑理论（二）：替换、大小写、计数、文本操作", 209, 235, "Search and Replace, Changing Case, Counting, Text Manipulation"),
    ("08-editing-c",      "编辑理论（三）：键盘宏、文本展开、缩进、排序对齐", 235, 271, "Keyboard Macros, Text Expansion, Indenting, Sorting and Aligning, Other Editing"),
    ("09-practicals-a",   "实用篇（一）：探索、项目管理、Xref、日志", 271, 290, "Exploring Emacs, Project Management, Xref, Working with Log Files"),
    ("10-practicals-b",   "实用篇（二）：Tramp、EWW",      290, 300, "Tramp, EWW"),
    ("11-practicals-c",   "实用篇（三）：Dired、Shell 命令、Emacs 里的 Shell", 300, 320, "Dired, Shell Commands, Shells in Emacs"),
    ("12-conclusion",     "结语与延伸资源",              320, 327, "Conclusion, Other Resources, Third-Party Packages, Communities"),
]

doc = pymupdf.open(PDF)
toc = doc.get_toc()

for slug, title, start, end, covers in BLOCKS:
    parts = [
        f"# {title}",
        "",
        f"> 原书来源：Mastering Emacs (Eli Spare)，第 {start}–{end - 1} 页。",
        f"> 覆盖范围：{covers}",
        "",
    ]
    for pno in range(start - 1, min(end - 1, doc.page_count)):
        text = doc[pno].get_text("text").strip()
        if not text:
            continue
        parts.append(f"## [p.{pno + 1}]")
        parts.append(text)
        parts.append("")
    (OUT / f"{slug}.md").write_text("\n".join(parts), encoding="utf-8")

# 目录总览
lines = ["# Mastering Emacs 原书目录", ""]
for level, title, page in toc:
    lines.append(f"{'  ' * (level - 1)}- {title} (p.{page})")
(OUT / "_full-toc.md").write_text("\n".join(lines), encoding="utf-8")

for slug, title, start, end, _ in BLOCKS:
    p = OUT / f"{slug}.md"
    print(f"{p.name:32s} {len(p.read_text(encoding='utf-8')):>8,d} chars  {title}")
