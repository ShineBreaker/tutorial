#!/usr/bin/env python3
"""全量组装 GitHub Pages 站点到 _site/。

只做白名单映射，白名单之外的仓库文件一律不进 _site。
用法：python3 scripts/assemble.py（无参数）
"""

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "_site"


def fail(message: str) -> None:
    print(f"错误：{message}", file=sys.stderr)
    sys.exit(1)


def copy_file(src: Path, dst: Path) -> int:
    """复制单个文件，返回复制的文件数。"""
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    return 1


def copy_tree(src: Path, dst: Path, excluded: frozenset[str]) -> int:
    """递归复制目录树；仅顶级目录中命中 excluded 的名字被排除。"""
    count = 0
    for path in sorted(src.iterdir()):
        if path.name in excluded:
            continue
        if path.is_dir():
            count += copy_tree(path, dst / path.name, frozenset())
        else:
            count += copy_file(path, dst / path.name)
    return count


def main() -> None:
    # 白名单映射单元：(源, 目标, 顶级排除名, 描述)
    units = [
        (
            ROOT / "index.html",
            SITE / "index.html",
            frozenset(),
            "根落地页 index.html",
        ),
        (
            ROOT / "tutorials/claude-code-tutorial",
            SITE / "claude-code-tutorial",
            frozenset({"tools", "README.md"}),
            "claude-code-tutorial/（排除 tools/ 与 README.md）",
        ),
        (
            ROOT / "tutorials/master-emacs-in-21-days",
            SITE / "master-emacs-in-21-days",
            frozenset({"README.md"}),
            "master-emacs-in-21-days/（排除 README.md）",
        ),
        (
            ROOT / "tutorials/mastering-emacs-zh/dist/mastering-emacs-zh.html",
            SITE / "mastering-emacs-zh/index.html",
            frozenset(),
            "mastering-emacs-zh/（单文件成品重命名为 index.html）",
        ),
        (
            ROOT / "tutorials/migration-guide.html",
            SITE / "migration-guide.html",
            frozenset(),
            "migration-guide.html（单文件成品）",
        ),
    ]

    # 先校验全部源存在，再动 _site：防止教程目录被误移后静默组装出空站
    missing = [src for src, _dst, _excluded, _label in units if not src.exists()]
    if missing:
        fail(
            "以下源路径不存在，终止组装：\n"
            + "\n".join(f"  - {p.relative_to(ROOT)}" for p in missing)
        )

    # 清空重建 _site（仅限本仓库的 _site 路径，且先做存在性判断）
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir(parents=True)

    report: list[tuple[str, int]] = []
    total = 0
    for src, dst, excluded, label in units:
        if src.is_dir():
            count = copy_tree(src, dst, excluded)
        else:
            count = copy_file(src, dst)
        report.append((label, count))
        total += count

    print(f"站点组装完成：{SITE}")
    for label, count in report:
        print(f"  {label}: {count} 个文件")
    print(f"  合计: {total} 个文件")


if __name__ == "__main__":
    main()
