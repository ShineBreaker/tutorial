#!/usr/bin/env python3
"""对 dist/mastering-emacs-zh.html 做结构性体检。exit 0 = 全部通过。

用法（工作区根为 ~/Projects）：
    python3 Emacs/mastering-emacs-zh/tools/validate.py
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "mastering-emacs-zh.html"
SECTIONS = ROOT / "web" / "sections"
MIN_BYTES = 300_000
MIN_DRILLS = 40
MIN_KEYTABLES = 12

# 全书必须齐备的 18 章：(章节片段文件名, section id, 原书素材文件或 None)
# 缺任何一章都是硬失败——作者步骤可能空转返回而不写文件，必须由终验拦下来。
REQUIRED = [
    ("00-guide.html", "ch-00-guide", None),
    ("01-why-emacs.html", "ch-01-why-emacs", "01-why-emacs.md"),
    ("02-first-steps.html", "ch-02-first-steps", "02-first-steps.md"),
    ("03-movement-a.html", "ch-03-movement-a", "03-movement-a.md"),
    ("04-movement-b.html", "ch-04-movement-b", "04-movement-b.md"),
    ("05-movement-c.html", "ch-05-movement-c", "05-movement-c.md"),
    ("06-editing-a.html", "ch-06-editing-a", "06-editing-a.md"),
    ("07-editing-b.html", "ch-07-editing-b", "07-editing-b.md"),
    ("08-editing-c.html", "ch-08-editing-c", "08-editing-c.md"),
    ("09-practicals-a.html", "ch-09-practicals-a", "09-practicals-a.md"),
    ("10-practicals-b.html", "ch-10-practicals-b", "10-practicals-b.md"),
    ("11-practicals-c.html", "ch-11-practicals-c", "11-practicals-c.md"),
    ("12-elisp.html", "ch-12-elisp", None),
    ("13-setup.html", "ch-13-setup", None),
    ("14-workflow.html", "ch-14-workflow", None),
    ("15-mobile.html", "ch-15-mobile", None),
    ("16-conclusion.html", "ch-16-conclusion", "12-conclusion.md"),
    ("17-appendix.html", "ch-17-appendix", None),
]

failures, warns, notes = [], [], []


def check(cond, msg, warn_only=False):
    if cond:
        notes.append(msg)
    elif warn_only:
        warns.append(msg)
    else:
        failures.append(msg)


def main() -> int:
    if not OUT.exists():
        print("FAIL 产物不存在:", OUT)
        return 1
    doc = OUT.read_text(encoding="utf-8")
    size = len(doc.encode("utf-8"))

    check(size >= MIN_BYTES, f"体积 {size:,d} 字节（期望 ≥ {MIN_BYTES:,d}）", warn_only=True)

    # 逐章核对齐备性：片段文件存在，且其 section id 真的出现在成书里
    doc_pre_ids = re.findall(r'<section class="ch" id="([^"]+)"', doc) if OUT.exists() else []
    for fname, sec_id, src in REQUIRED:
        frag = SECTIONS / fname
        if not frag.exists():
            src_hint = f"素材见 text/{src}" if src else "无原书素材，按 BRIEF.md 章节表里的要求写"
            check(False, f"缺少章节文件 web/sections/{fname}（应为 section id=\"{sec_id}\"，"
                         f"{src_hint}）。请按 web/CONTRACT.md 的结构把这一章整章写出来")
        else:
            body = frag.read_text(encoding="utf-8")
            if f'id="{sec_id}"' not in body:
                check(False, f"章节文件 web/sections/{fname} 的 section id 不是 \"{sec_id}\"，请改正")
            if sec_id not in doc_pre_ids:
                check(False, f"章节 {sec_id} 没有出现在成书里，请检查 web/sections/{fname} 是否被拼装")

    for token in ("{{NAV}}", "{{SECTIONS}}", "{{SECTION_COUNT}}", "{{TOTAL_MIN}}"):
        check(token not in doc, f"占位符 {token} 未被替换")
    for token in ("<!DOCTYPE html>", "<html", "</html>", "<head>", "</head>", "<body", "</body>"):
        check(token in doc, f"缺少 {token}")

    opens = len(re.findall(r'<section class="ch"', doc))
    closes = doc.count("</section>")
    check(opens >= len(REQUIRED), f"章节数 {opens}（期望 = {len(REQUIRED)}）")
    check(opens == closes, f"<section> 开 {opens} 个、闭 {closes} 个，数量不匹配")

    ids = re.findall(r'<section class="ch" id="([^"]+)"', doc)
    check(len(ids) == len(set(ids)), f"章节 id 唯一（{len(ids)} 个，重复 {len(ids) - len(set(ids))}）")
    check(all(re.fullmatch(r"[a-z0-9-]+", i) for i in ids), "章节 id 均为合法锚点名")

    check(doc.count("<h2 class=\"ch-title\">") == opens, "每章都有 ch-title")
    check(doc.count("<p class=\"ch-lead\">") == opens, "每章都有 ch-lead")

    drills = len(re.findall(r'<div class="drill"', doc))
    check(drills >= MIN_DRILLS, f"练习题 {drills} 道（期望 ≥ {MIN_DRILLS}）", warn_only=True)
    check(doc.count('class="drill-btn"') == drills, "每道练习都有 drill-btn")

    keytables = len(re.findall(r'<div class="keys">', doc))
    check(keytables >= MIN_KEYTABLES, f"按键速查表 {keytables} 张（期望 ≥ {MIN_KEYTABLES}）", warn_only=True)
    check(doc.count("<kbd>") >= 300, f"kbd 元素 {doc.count('<kbd>')} 个（期望 ≥ 300）", warn_only=True)
    check(doc.count('class="callout') >= 30, f"提示框 {doc.count('class=\"callout')} 个", warn_only=True)
    check(doc.count("<pre class=\"el\"") >= 25, f"Elisp 代码块 {doc.count('<pre class=\"el\"')} 个", warn_only=True)

    check(doc.count("<script") == 1, f"内联脚本恰好 1 个（实为 {doc.count('<script')}）")
    check("<style" in doc, "内联样式存在")
    for bad in ("<link rel=\"stylesheet\"", "src=\"http", "href=\"http"):
        check(bad not in doc, f"无外部依赖 {bad}", warn_only=True)

    for placeholder in ("TODO", "待补充", "待定", "占位"):
        check(placeholder not in doc, f"无占位符 {placeholder}")

    # 每章都应有练习与按键表
    for sec in re.split(r'(?=<section class="ch")', doc)[1:]:
        sid = re.search(r'id="([^"]+)"', sec)
        sid = sid.group(1) if sid else "?"
        if '<div class="drill"' not in sec:
            warns.append(f"{sid} 没有练习题")
        if '<div class="keys">' not in sec:
            warns.append(f"{sid} 没有按键速查表")

    print("=" * 60)
    print(f"产物: {OUT}")
    print(f"体积: {size:,d} bytes   章节: {opens}   练习: {drills}   速查表: {keytables}")
    for n in notes:
        print(f"  PASS  {n}")
    for w in warns:
        print(f"  WARN  {w}")
    for f in failures:
        print(f"  FAIL  {f}")
    print("=" * 60)
    if failures:
        print(f"结论: 未通过（{len(failures)} 项硬失败，{len(warns)} 项警告）")
        return 1
    print(f"结论: 通过（0 项硬失败，{len(warns)} 项警告）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
