# tutorial

中文教程合集静态站：收录《Claude Code 教程》《Master Emacs in 21 Days》《Mastering Emacs 中文精读》《编辑器迁移手册》等多套网页教程，经 GitHub Actions 发布为 GitHub Pages 单站，各教程挂站点子路径。

## 目录布局

- `tutorials/` — 各教程内容
  - `tutorials/claude-code-tutorial/` — 《Claude Code 教程》
  - `tutorials/master-emacs-in-21-days/` — 《Master Emacs in 21 Days》
  - `tutorials/mastering-emacs-zh/` — 《Mastering Emacs 中文精读》
  - `tutorials/migration-guide.html` — 《编辑器迁移手册》单文件
- `scripts/` — 站点组装与校验脚本
- `_site/` — 站点生成物（已 gitignore，勿手工编辑或提交）

## 本地验证与上线

本地组装与校验：`python3 scripts/assemble.py && python3 scripts/check_links.py`（与 CI 完全同口径）。推送 `main` 后由 `.github/workflows/pages.yml` 自动部署 GitHub Pages；上线步骤（建仓、推送、开启 Pages）见仓库内交付的《GitHub Pages 上线指引》，首次部署前需在仓库 Settings → Pages 把 Source 设为 **GitHub Actions**。
