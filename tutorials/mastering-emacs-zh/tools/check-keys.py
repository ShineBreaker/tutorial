#!/usr/bin/env python3
"""从成书 HTML 中抽出所有 <kbd> 按键序列与按键表里的命令名，交给真实 Emacs 内核逐条核对。

用法（工作区根即本项目目录）：
    python3 tools/check-keys.py

退出码 0 = 全部对上；2 = 有对不上的条目（多数是模式内绑定，需人工判定）。
每条待判定项都标注了它出现在哪一章，便于分章修订。
"""
import html
import json
import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOC = ROOT / "dist" / "mastering-emacs-zh.html"
ELISP = ROOT / "tools" / "check-keys.el"
TMP = ROOT / "dist" / "_keys.json"

KBD_BLOCK = re.compile(r"<kbd>(.*?)</kbd>", re.S)
SPLIT_RE = re.compile(r"</kbd>(\s*)<kbd>")
SEQ_RE = re.compile(r"(?:\s*<kbd>[^<]{1,10}</kbd>){3,}")
KEYS_TABLE = re.compile(r'<div class="keys">(.*?)</table>', re.S)
ROW = re.compile(r"<tr>(.*?)</tr>", re.S)
CELL = re.compile(r"<td>(.*?)</td>", re.S)
CODE = re.compile(r"<code>(.*?)</code>", re.S)
STRIP = re.compile(r"<[^>]+>")
SECTION = re.compile(r'<section class="ch" id="([^"]+)"', re.S)
MODIFIERS = ("C-M-S", "C-M", "C-S", "S-M", "C", "M", "S")


def emacs_binary() -> str | None:
    for cand in ("emacs",):
        p = shutil.which(cand) or (cand if pathlib.Path(cand).exists() else None)
        if p:
            return p
    return None


def seq_from_html(fragment: str) -> str | None:
    """把一段 HTML 里的 kbd 还原成 Emacs 键记号。
    <kbd>C</kbd><kbd>x</kbd> <kbd>C</kbd><kbd>f</kbd>  ->  "C-x C-f"
    <kbd>C</kbd><kbd>-</kbd><kbd>x</kbd>           ->  "C-x"
    <kbd>M</kbd><kbd>-</kbd><kbd>x</kbd>           ->  "M-x"
    """
    matches = list(KBD_BLOCK.finditer(fragment))
    if not matches:
        return None
    groups: list[list[str]] = []
    current = [STRIP.sub("", matches[0].group(1)).strip()]
    for a, b in zip(matches, matches[1:]):
        between = fragment[a.end():b.start()]
        token = STRIP.sub("", b.group(1)).strip()
        if between.strip() == "" and token:
            current.append(token)
        else:
            groups.append(current)
            current = [token]
    groups.append(current)

    chords = []
    for group in groups:
        seq: list[str] = []
        for piece in group:
            if not piece:
                continue
            if piece == "-":
                if seq:
                    seq[-1] += "-"
                continue
            if seq and seq[-1] in MODIFIERS:
                seq[-1] = f"{seq[-1]}-{piece}"
            elif seq and seq[-1].endswith("-"):
                seq[-1] += piece
            else:
                seq.append(piece)
        chord = " ".join(seq).strip()
        if chord:
            chords.append(chord)
    return " ".join(chords) if chords else None


def sections_with_bodies(doc: str) -> list[tuple[str, str]]:
    parts = SECTION.split(doc)
    out = []
    for i in range(1, len(parts), 2):
        out.append((parts[i], parts[i + 1]))
    return out


def main() -> int:
    if not DOC.exists():
        print(f"FATAL 成书文件不存在: {DOC}")
        return 1
    doc = DOC.read_text(encoding="utf-8")
    emacs = emacs_binary()
    if not emacs:
        print("SKIP 环境中找不到 Emacs，本次跳过按键核对")
        return 0

    keys: dict[str, set[str]] = {}
    cmds: dict[str, set[str]] = {}

    def note_key(k: str | None, sec: str) -> None:
        if k and len(k) <= 48:
            keys.setdefault(k, set()).add(sec)

    def note_cmd(name: str, sec: str) -> None:
        if re.fullmatch(r"[A-Za-z][A-Za-z0-9_+*/<>=!?:-]*", name):
            cmds.setdefault(name, set()).add(sec)

    for sec_id, body in sections_with_bodies(doc):
        for table in KEYS_TABLE.findall(body):
            for row in ROW.findall(table):
                cells = CELL.findall(row)
                if len(cells) < 2:
                    continue
                note_key(seq_from_html(cells[0]), sec_id)
                for c in CODE.findall(cells[1]):
                    note_cmd(html.unescape(STRIP.sub("", c)).strip(), sec_id)
        for m in SEQ_RE.finditer(body):
            note_key(seq_from_html(m.group(0)), sec_id)

    TMP.parent.mkdir(parents=True, exist_ok=True)
    TMP.write_text(json.dumps({"keys": sorted(keys), "commands": sorted(cmds)}), encoding="utf-8")

    proc = subprocess.run([emacs, "--batch", "-Q", "-l", str(ELISP), str(TMP)],
                          capture_output=True, text=True, timeout=300)
    if proc.returncode != 0 or "SUMMARY" not in proc.stdout:
        print(f"FATAL Emacs 核对失败 exit={proc.returncode}")
        print((proc.stdout + proc.stderr)[-2000:])
        return 1

    unbound, undefined, summary = [], [], ""
    for line in proc.stdout.splitlines():
        f = line.split("\t")
        if f[0] == "UNBOUND-KEY":
            unbound.append((f[1], f[2] if len(f) > 2 else ""))
        elif f[0] == "UNDEFINED-CMD":
            undefined.append(f[1])
        elif f[0] == "SUMMARY":
            summary = line

    ver = subprocess.run([emacs, "--batch", "-Q", "--eval", "(princ emacs-version)"],
                         capture_output=True, text=True, timeout=120).stdout.strip()

    report = [
        f"核对用 Emacs 版本: {ver}",
        summary,
        "",
        "== 全局键位中查不到的按键序列（按出现章节归因，需逐条判定：模式内绑定 / 确实写错）==",
    ]
    for k, why in sorted(unbound):
        report.append(f"UNBOUND-KEY  {k}  <- 章节 {', '.join(sorted(keys.get(k, [])))}  {why}")
    report.append("")
    report.append("== Emacs 中不存在的命令名（可能是变量名、模式名或拼写错误）==")
    for c in sorted(undefined):
        report.append(f"UNDEFINED-CMD  {c}  <- 章节 {', '.join(sorted(cmds.get(c, [])))}")

    text = "\n".join(report)
    print("=" * 68)
    print(text)
    print("=" * 68)
    if unbound or undefined:
        print(f"结论: {len(unbound) + len(undefined)} 条待人工判定")
        return 2
    print("结论: 全部按键与命令均在真实 Emacs 中对得上")
    return 0


if __name__ == "__main__":
    sys.exit(main())
