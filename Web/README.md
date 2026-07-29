# NRadio 审核网站

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

GitHub Actions 工作流位于仓库根目录 `.github/workflows/deploy-cloudflare.yml`。仓库需要配置两个 Actions Secret：

- `CLOUDFLARE_API_TOKEN`：仅授予目标账户 Pages 编辑以及目标 DNS 区域所需权限。
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID。

工作流会在 `main` 分支更新时同步知识，再把 `Web/backend/functions` 复制到 Wrangler 识别的临时 `Web/functions`，最终部署 `Web/frontend/public` 与 Pages Functions。Cloudflare Pages 项目名为 `nradio-web`。首次部署完成后，在 Pages 项目中绑定自定义域名 `nradio.fallaxaura.dpdns.org`。

## 内容来源

网页数据由 `../knowledge-base/import/knowledge.jsonl` 生成。不要直接编辑 `frontend/public/data/knowledge.json` 或 `backend/functions/_data/knowledge.js`，否则下次同步会覆盖更改。
