# NRadio-Bot 平台

这是 NRadio-Bot 的私有协作仓库，集中保存鲲鹏无限公开资料知识库、AstrBot 导入文件与知识检索网站。网站首页使用最新版鹏仔 OC，知识库内容字段检索入口位于 `/knowledge`。

## 目录

- `knowledge-base/`：经过来源标注与边界整理的知识库，以及可直接导入 AstrBot 的 Markdown。
- `Web/frontend/`：首页、知识库页面、样式、交互与公开数据。
- `Web/backend/`：Cloudflare Pages Functions API 与服务端知识数据。
- `scripts/knowledge_import.py`：解析上传文件并调用独立审核模型生成结构化知识。
- `assets/`：鹏仔 OC 原始素材；线上当前使用最新版 `pengzai-qq-avatar-v8.png`。
- `.github/workflows/`：PR 与分支的数据、页面和接口校验。

## 协作方式

请从独立分支提交改动并发起 Pull Request，由成员审核后再合并到 `main`。组织成员的基础仓库权限设为 `Write` 后，可以读取私有仓库、推送分支、创建 PR 和参与评审。Cloudflare Pages 通过仅限本仓库的 GitHub App 自动构建，不需要在仓库保存 Cloudflare API Token。

本地检查：

```bash
npm --prefix Web run sync
npm --prefix Web run check
```

在线导入入口为 `/knowledge/manage/`。上传文件会先进入私有暂存区，再由 GitHub Actions 串行提取、结构化、同步并校验；通过后自动提交至 `main`，由 NRadio 知识库同步插件读取并发布到 AstrBot。

部署方式、自定义域名和 Secrets 配置见 [Web/README.md](Web/README.md)。

## 安全边界

真实令牌、机器人账号数据与运行时状态不得提交。`.env`、`runtime/`、Wrangler 本地状态、部署时生成的 `Web/functions/` 以及构建产物已经被 `.gitignore` 排除；仓库仅保留 `.env.example` 作为变量说明。
