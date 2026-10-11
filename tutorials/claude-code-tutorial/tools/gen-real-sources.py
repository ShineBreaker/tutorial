#!/usr/bin/env python3
"""生成 js/real-sources.js：把教程代码卡片引用的真实源码抽出来，供「查看真实源码」悬浮窗使用。

用法：python3 gen-real-sources.py [源码根目录] [教程目录]
数据模型（每条引用）：
  file    教程里写的相对路径（如 query.ts、services/tools/toolExecution.ts）
  abs     相对源码根的路径（公开部署，不泄漏本机目录结构；emacsclient 在源码根 cwd 下可直接跳转）
  mode    excerpt = 带行号区间的片段；outline = 文件声明骨架（引用没给行号时）
  ref     章节数据里的原始 path 字符串（原样展示在悬浮窗标题）
"""
import json
import re
import sys
import pathlib

SRC_ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/home/brokenshine/Projects/Agent/claude-code')
TUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else '/home/brokenshine/Projects/Agent/claude-code-tutorial')
CHAPTERS = TUT / 'js' / 'chapters'
OUT = TUT / 'js' / 'real-sources.js'

CTX = 14                      # 单行引用前后各取多少行上下文
MAX_EXCERPTS = 3              # 一个卡片最多展示几段（如 "834 与 1062"）
OUTLINE_LIMIT = 28            # 骨架模式最多列几条声明
MAX_RANGE = 90                # 区间超过这个长度就截断

PATH_FIELD_RE = re.compile(r"^\s+path:\s*'([^']+)'", re.M)
FILE_RE = re.compile(r'([A-Za-z0-9_./-]+\.\w{1,4})')
LINE_RE = re.compile(r'(\d+)(?:-(\d+))?')
SIG_RE = re.compile(r'^(export\s+)?(default\s+)?(async\s+)?(function|const|let|class|interface|type|enum)\s+[A-Za-z_$]')


def resolve(name: str) -> pathlib.Path | None:
    """教程里的相对路径 -> 真实文件。先按原样找，再按文件名全树找。"""
    direct = SRC_ROOT / name
    if direct.is_file():
        return direct
    hits = [p for p in SRC_ROOT.rglob(name) if p.is_file()]
    return hits[0] if hits else None


def excerpt_range(lines, a, b=None):
    """行号 -> (start, end)。区间引用取原样；单行引用取上下文并去掉首尾空行。"""
    n = len(lines)
    if b and b > a:
        s, e = max(1, a), min(n, min(b, a + MAX_RANGE))
    else:
        s, e = max(1, a - CTX), min(n, a + CTX)
    while s < e and not lines[s - 1].strip():
        s += 1
    while e > s and not lines[e - 1].strip():
        e -= 1
    return s, e


def build_entry(ref: str):
    """一条 path 字符串 -> 数据条目；解析不了返回 None。"""
    m = FILE_RE.search(ref)
    if not m:
        return None
    name = m.group(1)
    real = resolve(name)
    if real is None:
        return None

    lines = real.read_text(encoding='utf-8', errors='replace').split('\n')
    rel = str(real.relative_to(SRC_ROOT))

    # 引用里的行号：第一个是「文件:行」，后面 "与 1062" 之类的是附加行
    after = ref[m.end():]
    refs = LINE_RE.findall(after)[:MAX_EXCERPTS]

    entry = {'file': rel, 'abs': rel, 'ref': ref}
    if refs:
        excerpts = []
        for a, b in refs:
            a, b = int(a), int(b) if b else None
            s, e = excerpt_range(lines, a, b)
            excerpts.append({
                'start': s,
                'end': e,
                'focus': a if s <= a <= e else s,
                'code': '\n'.join(lines[s - 1:e]),
            })
        entry['mode'] = 'excerpt'
        entry['excerpts'] = excerpts
    else:
        # 没给行号：列文件骨架（顶层声明 + 行号），适合「这个模式散落在这些文件里」的卡片
        outline = []
        for i, line in enumerate(lines, 1):
            if SIG_RE.match(line) and len(line) < 110:
                outline.append({'n': i, 'code': line})
            if len(outline) >= OUTLINE_LIMIT:
                break
        if not outline:
            return None
        entry['mode'] = 'outline'
        entry['outline'] = outline
    return entry


def main():
    seen = {}
    for f in sorted(CHAPTERS.glob('ch*.js')):
        for ref in PATH_FIELD_RE.findall(f.read_text(encoding='utf-8')):
            if ref in seen:
                continue
            entry = build_entry(ref)
            if entry:
                seen[ref] = entry

    body = json.dumps(seen, ensure_ascii=False, indent=2)
    OUT.write_text(
        '/**\n'
        ' * real-sources.js · 教程引用的真实源码片段（由 tools/gen-real-sources.py 生成，请勿手改）\n'
        ' *\n'
        ' * 作用：代码卡片上的「查看真实源码」按钮按 path 字符串从这里取片段，\n'
        ' * 在悬浮窗里展示带行号的真实实现。mode:\n'
        ' *   excerpt · 行号区间片段，focus 是要点亮的那一行\n'
        ' *   outline · 引用没给行号，退化为文件声明骨架\n'
        ' */\n'
        f'export const REAL_SOURCES = {body}\n',
        encoding='utf-8',
    )
    modes = {}
    for e in seen.values():
        modes[e['mode']] = modes.get(e['mode'], 0) + 1
    print(f'已生成 {OUT}：{len(seen)} 条引用 {modes}')


if __name__ == '__main__':
    main()
