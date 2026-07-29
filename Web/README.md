# NRadio 知识库网站

这个目录包含 `nradio.fallaxaura.dpdns.org` 的前端与 Cloudflare Pages Functions 后端。`frontend/` 保存可见页面和静态资源，`backend/` 保存 API；首页使用最新版鹏仔 OC，知识库页面位于 `/knowledge`。

## 本地预览

先从仓库根目录的 JSONL 同步网页数据，再启动静态预览：

```bash
npm run sync
npm run check
npm run dev
```

打开 `http://localhost:4173`。静态预览会自动从 `/data/knowledge.json` 读取；部署到 Cloudflare Pages 后优先使用 `/api/knowledge`。

## Cloudflare 部署

Cloudflare Pages 项目 `nradio-web` 通过 GitHub App 连接私有仓库，只授权 `NRadio-Bot/nradio-platform`。构建设置如下：

- 根目录：`Web`
- 构建命令：`npm run sync && npm run check && npm run prepare:deploy`
- 输出目录：`frontend/public`

构建会把 `backend/functions` 复制到 Wrangler 识别的临时 `functions` 目录，再把前端与 Pages Functions 一起发布。公司审核期间生产分支为 `agent/nradio-review-site`；PR 合并后应将生产分支切回 `main`。自定义域名为 `nradio.fallaxaura.dpdns.org`。

## 内容来源

网页数据由 `../knowledge-base/import/knowledge.jsonl` 生成。不要直接编辑 `frontend/public/data/knowledge.json` 或 `backend/functions/_data/knowledge.js`，否则下次同步会覆盖更改。
