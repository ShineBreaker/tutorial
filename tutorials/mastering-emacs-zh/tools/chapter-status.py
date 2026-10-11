#!/usr/bin/env python3
"""报告 18 章各自的完成状态，供工作流脚本决定跳过哪些章、汇总哪些数字。

用法（工作区根即本项目目录）：
    python3 tools/chapter-status.py

每章输出一行，以制表符分隔：
    <章节id> \t OK|THIN|MISSING \t drills=<n> \t keys=<n> \t kb=<n> \t bytes=<n>

OK 判定：文件存在、section id 正确、练习题 >= 2、按键速查表 >= 1、体量 >= 25KB。
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SECTIONS = ROOT / "web" / "sections"

REQUIRED = [
    ("ch-00-guide", "00-guide.html"),
    ("ch-01-why-emacs", "01-why-emacs.html"),
    ("ch-02-first-steps", "02-first-steps.html"),
    ("ch-03-movement-a", "03-movement-a.html"),
    ("ch-04-movement-b", "04-movement-b.html"),
    ("ch-05-movement-c", "05-movement-c.html"),
    ("ch-06-editing-a", "06-editing-a.html"),
    ("ch-07-editing-b", "07-editing-b.html"),
    ("ch-08-editing-c", "08-editing-c.html"),
    ("ch-09-practicals-a", "09-practicals-a.html"),
    ("ch-10-practicals-b", "10-practicals-b.html"),
    ("ch-11-practicals-c", "11-practicals-c.html"),
    ("ch-12-elisp", "12-elisp.html"),
    ("ch-13-setup", "13-setup.html"),
    ("ch-14-workflow", "14-workflow.html"),
    ("ch-15-mobile", "15-mobile.html"),
    ("ch-16-conclusion", "16-conclusion.html"),
    ("ch-17-appendix", "17-appendix.html"),
]

MIN_BYTES = 25_000
MIN_DRILLS = 2
MIN_KEYS = 1


def main() -> int:
    ok = 0
    for sec_id, fname in REQUIRED:
        path = SECTIONS / fname
        if not path.exists():
            print(f"{sec_id}\tMISSING\tdrills=0\tkeys=0\tkb=0\tbytes=0")
            continue
        body = path.read_text(encoding="utf-8", errors="replace")
        size = len(body.encode("utf-8"))
        drills = body.count('<div class="drill"')
        keys = body.count('<div class="keys">')
        kbd = body.count("<kbd>")
        good = (f'id="{sec_id}"' in body and size >= MIN_BYTES
                and drills >= MIN_DRILLS and keys >= MIN_KEYS)
        status = "OK" if good else "THIN"
        if good:
            ok += 1
        print(f"{sec_id}\t{status}\tdrills={drills}\tkeys={keys}\tkb={kbd}\tbytes={size}")

    print(f"TOTAL\tready={ok}\tneeded={len(REQUIRED)}\tmissing={len(REQUIRED) - ok}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
