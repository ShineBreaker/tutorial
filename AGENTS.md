# AGENTS.md

> 请先扩充该文件中的相关约束，再进行工作

## 概述

中文教程静态站仓库：收录《Claude Code 教程》《Master Emacs in 21 Days》《Mastering Emacs 中文精读》《编辑器迁移手册》等多套网页教程，目标是整理为 GitHub Pages 单站发布（各教程挂站点子路径），并配备 GitHub Actions CI。

## 协作约定

- 修改前先读本文件与 README。
- 保持改动最小化，沿用现有风格。
- 优先使用 manifest.scm 来声明环境，如果有 guix 中不存在的包，或该文件不存在的话，再利用 direnv 进行环境管理

## 站点维护

- 目录布局与各教程成品来源：所有教程位于 `tutorials/` 下。`tutorials/claude-code-tutorial/` 与 `tutorials/master-emacs-in-21-days/` 目录本身即为成品，直接托管；`tutorials/mastering-emacs-zh/` 为源码，需用 `tutorials/mastering-emacs-zh/tools/build.py` 构建出 `dist/` 单文件成品再托管；`tutorials/migration-guide.html` 为单文件成品。
- 改动教程后必须跑 `python3 scripts/assemble.py && python3 scripts/check_links.py`，两项都通过才算完成。
- 新增教程：把教程放进 `tutorials/`，并在 `scripts/assemble.py` 的映射与根落地页 `index.html` 各加一项。
- CI 行为：`.github/workflows/pages.yml` 在 PR 上只做校验，push 到 `main` 后自动部署 GitHub Pages。
- `_site/` 是生成物，已被 gitignore，严禁手工编辑或提交。

## 技能索引

- `.agents/skills/` — 项目技能与工作流
