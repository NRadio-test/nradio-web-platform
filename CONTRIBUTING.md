# 参与协作

1. 从最新 `main` 创建功能分支，例如 `feature/knowledge-update` 或 `fix/mobile-layout`。
2. 修改知识源文件后运行 `npm --prefix Web run sync`，不要直接编辑两个自动生成的数据文件。
3. 提交前运行 `npm --prefix Web run check`。
4. 推送功能分支并创建 Pull Request，说明资料来源、可见变化与验证结果。
5. 至少完成一次成员审核后再合并；生产分支切换为 `main` 后，合并会触发 Cloudflare Pages 部署。

知识内容应优先引用官方页面，并明确区分产品能力、实测案例与动态信息。价格、库存、固件、套餐、网络覆盖和账号统计等信息必须注明需要实时复核。
