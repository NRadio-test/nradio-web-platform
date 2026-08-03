# NRadio 知识库网站

这个目录包含 `nradio.fallaxaura.dpdns.org` 的前端与 Cloudflare Pages Functions 后端。`frontend/` 保存可见页面和静态资源，`backend/` 保存 API；首页使用最新版鹏仔 OC，知识库页面位于 `/knowledge`，受控导入页面位于 `/knowledge/manage`，已发布条目的编辑页面位于 `/knowledge/manage/edit/?id=<InfoID>`。

## 本地预览

先从仓库根目录的 JSONL 同步网页数据，再启动静态预览：

```bash
npm run sync
npm run check
npm run dev
```

打开 `http://localhost:4173`。静态预览会自动从 `/data/knowledge.json` 读取；部署到 Cloudflare Pages 后优先使用 `/api/knowledge`。

## Cloudflare 部署

Cloudflare Pages 项目 `nradio-web-platform` 通过 GitHub App 连接私有仓库，只授权 `NRadio-test/nradio-web-platform`。构建设置如下：

- 根目录：`Web`
- 构建命令：`npm run sync && npm run check && npm run prepare:deploy`
- 输出目录：`frontend/public`

构建会把 `backend/functions` 复制到 Wrangler 识别的临时 `functions` 目录，再把前端与 Pages Functions 一起发布。生产分支固定为 `main`。新项目验证通过后再切换自定义域名 `nradio.fallaxaura.dpdns.org`；旧项目 `nradio-web` 保留为可回退部署，不删除其配置和资源绑定。

## 在线知识导入

导入流程使用以下 Cloudflare 绑定：

- `KNOWLEDGE_UPLOADS`：私有 R2 Bucket，暂存原始上传文件。
- `KNOWLEDGE_DB`：D1 数据库，执行 `migrations/0001_knowledge_import_jobs.sql` 后保存任务状态。

Cloudflare Secret：

- `GITHUB_ACTIONS_TOKEN`：只授予目标私有仓库 Actions 写入权限，用来启动 `knowledge-import.yml`。
- `IMPORT_SERVICE_TOKEN`：Cloudflare 与 GitHub Actions 之间共享的随机服务令牌。
- `KNOWLEDGE_SESSION_SECRET`：至少 32 字符的随机会话签名密钥。
- `KNOWLEDGE_SESSION_TOKEN_HASHES`：用户名到六位口令 SHA-256 摘要的 JSON 映射，或该 JSON 的 Base64URL 编码；服务器不保存原始口令。

Cloudflare 仪表板批量粘贴若移除变量名下划线，也兼容别名 `KNOWLEDGESESSIONSECRET` 和 `KNOWLEDGESESSIONTOKENHASHES`。

Cloudflare Variables：

- `GITHUB_OWNER`、`GITHUB_REPOSITORY`、`GITHUB_IMPORT_WORKFLOW`、`GITHUB_IMPORT_REF`。
- `GITHUB_EDIT_WORKFLOW=knowledge-edit.yml`、`GITHUB_EDIT_REF=main`。
- `PUBLIC_BASE_URL=https://nradio.fallaxaura.dpdns.org`。

GitHub Actions Secret：

- `KNOWLEDGE_REVIEW_API_KEY`：专门用于知识审核与结构化的模型 API Key。
- `KNOWLEDGE_IMPORT_SERVICE_TOKEN`：与 Cloudflare 的 `IMPORT_SERVICE_TOKEN` 保持一致。

GitHub Actions Variables：

- `KNOWLEDGE_REVIEW_API_BASE`：OpenAI-compatible API 根地址，例如以 `/v1` 结尾。
- `KNOWLEDGE_REVIEW_MODEL`：用于审核的模型名称。

上传支持 PDF、TXT、Markdown、DOCX、XLS/XLSX 与 EPUB。扫描版 PDF 需要先 OCR。每个任务会保留原文件、上传者、审核报告和结构化 Markdown，并串行提交到固定的 `knowledge/review` 审核分支；同一批次共用一个 Draft Pull Request，不会自动合并到 `main`。

## 内容来源

网页数据由 `../knowledge-base/import/knowledge.jsonl` 生成。不要直接编辑 `frontend/public/data/knowledge.json` 或 `backend/functions/_data/knowledge.js`，否则下次同步会覆盖更改。

网页与 AstrBot 管理页面的“编辑”入口都指向受六位口令保护的网页编辑器。可修改标题、正文、标签、来源和可信度，InfoID、原始上传者与原核验日期不会被覆盖。`knowledge-edit.yml` 验证内容后直接更新 `main`，并把每次变更追加到 `knowledge-base/edits/<InfoID>.jsonl`；AstrBot 端只需要 GitHub Contents Read 权限。
