# NRadio-Bot 平台

这是 NRadio-Bot 的私有协作仓库，集中保存鲲鹏无限公开资料知识库、AstrBot 导入文件与公司审核网站。网站首页使用最新版鹏仔 OC，知识审核入口位于 `/knowledge`。

## 目录

- `knowledge-base/`：经过来源标注与边界整理的知识库，以及可直接导入 AstrBot 的 Markdown。
- `Web/frontend/`：首页、知识库页面、样式、交互与公开数据。
- `Web/backend/`：Cloudflare Pages Functions API 与服务端知识数据。
- `assets/`：鹏仔 OC 原始素材；线上当前使用最新版 `pengzai-qq-avatar-v5.png`。
- `.github/workflows/`：PR 校验与 `main` 合并后的 Cloudflare 自动部署。

## 协作方式

请从独立分支提交改动并发起 Pull Request，由成员审核后再合并到 `main`。组织成员的基础仓库权限设为 `Write` 后，可以读取私有仓库、推送分支、创建 PR 和参与评审。

本地检查：

```bash
npm --prefix Web run sync
npm --prefix Web run check
```

部署方式、自定义域名和 Secrets 配置见 [Web/README.md](Web/README.md)。

## 安全边界

真实令牌、机器人账号数据与运行时状态不得提交。`.env`、`runtime/`、Wrangler 本地状态、部署时生成的 `Web/functions/` 以及构建产物已经被 `.gitignore` 排除；仓库仅保留 `.env.example` 作为变量说明。
