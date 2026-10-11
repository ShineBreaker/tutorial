#!/usr/bin/env python3
"""校验 _site 站点：断链检查 + 本机绝对路径隐私检查。

用法：python3 scripts/check_links.py（无参数，需先运行 scripts/assemble.py）
通过则打印统计并退出 0；发现问题则逐条列出并退出 1。
"""

import posixpath
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "_site"

# 隐私检查覆盖的文本文件后缀
PRIVACY_SUFFIXES = {".html", ".js", ".css"}

# 教程中已脱敏的占位符 home 路径（you/me/zhangsan/<user name>/<用户名>），
# 属教学示例而非真实路径泄漏，剔除后不再视为隐私问题；
# 白名单之外任何 "/home/" 仍照常报警。
PLACEHOLDER_HOME = re.compile(
    r"/home/(?:you|me|zhangsan|&lt;(?:user name|用户名)&gt;)/"
)


class ReferenceCollector(HTMLParser):
    """收集页面内所有 href/src 引用及其所在行号。"""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.refs: list[tuple[int, str]] = []  # (行号, 引用原文)

    def handle_starttag(self, tag: str, attrs) -> None:
        for name, value in attrs:
            if name in ("href", "src") and value is not None:
                self.refs.append((self.getpos()[0], value))


def resolve_ref(page: Path, ref: str) -> Path | None:
    """把页面内的相对/站点根引用解析为 _site 内的目标路径。

    外部协议（http:、https:、mailto:、data: 等）、协议相对地址（//…）、
    纯锚点（#…）与空引用返回 None（不检查）。
    """
    parts = urlsplit(ref)
    if parts.scheme or parts.netloc:
        return None
    raw_path = unquote(parts.path)
    if not raw_path:
        return None

    # 以站点根为虚拟根 "/" 做路径归一化，统一处理相对与 / 开头两种写法
    page_rel = page.relative_to(SITE).as_posix()
    base_dir = "/" + posixpath.dirname(page_rel)
    joined = posixpath.normpath(posixpath.join(base_dir, raw_path))
    return SITE / joined.lstrip("/")


def check_links() -> tuple[list[str], dict[str, int]]:
    """遍历 _site 下全部 HTML 页面，返回 (问题列表, 统计)。"""
    problems: list[str] = []
    stats = {"pages": 0, "refs": 0, "internal": 0, "skipped": 0}

    for page in sorted(SITE.rglob("*.html")):
        stats["pages"] += 1
        collector = ReferenceCollector()
        collector.feed(page.read_text(encoding="utf-8", errors="replace"))
        collector.close()

        for lineno, ref in collector.refs:
            stats["refs"] += 1
            where = f"{page.relative_to(SITE)}:{lineno}"
            target = resolve_ref(page, ref)
            if target is None:
                stats["skipped"] += 1
                continue
            stats["internal"] += 1
            # 虚拟根归一化（normpath 丢弃根之上的 ..）保证结果必落在 _site 内
            if target.is_dir():
                target = target / "index.html"
            if not target.exists():
                problems.append(f"断链 {where}: 引用 {ref!r}，目标不存在：{target.relative_to(SITE)}")
    return problems, stats


def check_privacy() -> list[str]:
    """扫描 _site 内 .html/.js/.css，含 "/home/" 即为本机路径泄漏。

    占位符 home 路径（/home/you/… 等教学示例）先剔除再判断，避免误报。
    """
    problems: list[str] = []
    for path in sorted(SITE.rglob("*")):
        if not (path.is_file() and path.suffix in PRIVACY_SUFFIXES):
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        hits = [
            lineno
            for lineno, line in enumerate(text.splitlines(), 1)
            if "/home/" in PLACEHOLDER_HOME.sub("", line)
        ]
        if hits:
            problems.append(
                f"隐私 {path.relative_to(SITE)}: 含 \"/home/\"，共 {len(hits)} 处（行号 "
                + ", ".join(map(str, hits[:10]))
                + ("…" if len(hits) > 10 else "")
                + "）"
            )
    return problems


def main() -> None:
    if not SITE.is_dir():
        print("错误：_site/ 不存在，请先运行 python3 scripts/assemble.py", file=sys.stderr)
        sys.exit(1)

    link_problems, stats = check_links()
    privacy_problems = check_privacy()
    scanned = sum(
        1
        for p in SITE.rglob("*")
        if p.is_file() and p.suffix in PRIVACY_SUFFIXES
    )

    problems = link_problems + privacy_problems
    if problems:
        print(f"检查未通过，共 {len(problems)} 个问题：")
        for problem in problems:
            print(f"  - {problem}")
        sys.exit(1)

    print("检查通过：")
    print(f"  HTML 页面: {stats['pages']} 个")
    print(
        f"  引用总数: {stats['refs']} 条"
        f"（站内 {stats['internal']} 条，跳过外部协议/锚点 {stats['skipped']} 条）"
    )
    print(f"  隐私扫描: {scanned} 个 .html/.js/.css 文件，未发现 \"/home/\" 泄漏")


if __name__ == "__main__":
    main()
