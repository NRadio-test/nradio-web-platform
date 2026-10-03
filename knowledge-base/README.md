# 鲲鹏无限知识库

这套目录用于客服机器人、RAG 知识库和知识检索网站。2026-10-03 已将完整的 303 条活动知识逐条审阅、去重和重组为 79 条，按六类组织。具体合并目标、移除原因和可恢复原文见 [本次审阅记录](curation/2026-10-03/README.md)。

通过六位身份口令上传的资料，默认已经由成员确认可以写入知识库。结构化模型只负责忠实总结、按主题拆分、保留日期与适用条件并补充检索标签，不以联系方式、内部通知或是否属于产品参数为由过滤内容。只有文件为空、乱码或无法解析时，才允许不生成条目。

## 建议导入方式

- 如果系统支持主题 Markdown 导入，使用 `topics/` 下的六份整理版文件。
- 如果系统支持 JSONL，优先导入 `import/knowledge.jsonl`。每行是一段可独立检索的知识，带标题、来源、上传者、标签和置信度。
- 原始上传、旧上传文档、审核记录、`curation/` 和 README 用于追溯，不应作为当前问答正文重复导入。
- 涉及价格、库存、活动、固件版本、套餐资费、覆盖国家数量和账号粉丝数据时，回答前应再次核对官方当前页面。

### AstrBot

AstrBot WebUI 不能把本目录或 `import/knowledge.jsonl` 直接作为知识库导入。请只上传 `astrbot-upload/NRadio-鲲鹏无限知识库.md`。该文件已经合并必要正文、来源和回答边界，并按 Markdown 标题组织，以配合 AstrBot 的标题感知分块器。具体操作见 `ASTRBOT_IMPORT.md`。

## 内容组织原则

每条知识回答一个完整问题，把前提、必要步骤、异常判断及限制放在同一条，避免“来源说明”“总结”“回答口径”再各自生成重复条目。保留来源、原上传者、资料日期、适用对象和限制；正文不再重复堆放字段元信息。

标签按“分类、完整型号/系统、主题、必要的动态或冲突标记”排列，规则见 `import/tag-taxonomy.json`。统一 C2000 Max/C2000 Ultra 等名称；用户已确认 C8-788 就是 C2000 Max，作为别名识别，不另建产品。型号相同也不把不同来源的矛盾参数拼接成统一规格。

`reviewed_at` 是内容审阅日期，不能当外部事实重新核验日期。`verified_at` 保留原记录日期；合并的所有来源及日期见 `source_records`。带“动态待复核”或“资料冲突”的内容，应核对当前政策、版本或实机后回答。旧报价、过期计划和临时联系方式已移出活动库，原始材料留档。

## 目录

- `topics/01-company-channels.md`：公司、渠道与问题反馈
- `topics/02-products-selection.md`：完整型号参数、别名与选型
- `topics/03-use-troubleshooting.md`：设备使用与直播排障建议
- `topics/04-firmware.md`：刷机、固件与恢复边界
- `topics/05-openwrt.md`：精简后的常用 OpenWrt 技术问题
- `topics/06-plans-membership.md`：已有套餐用户支持及会员规则
- `import/knowledge.jsonl`：配置友好的分块数据
- `import/manifest.json`：导入字段说明
- `import/tag-taxonomy.json`：统一标签与别名
- `curation/2026-10-03/`：完整原文快照、逐条审计和整理计划；不进入当前检索
- `sources/uploads/`、`documents/uploads/`、`reviews/`：原始上传及历次处理证据；不代表当前有效条目
- `astrbot-upload/NRadio-鲲鹏无限知识库.md`：由 JSONL 自动生成、可在 AstrBot WebUI 直接上传的文件
- `ASTRBOT_IMPORT.md`：AstrBot 官方兼容性结论与导入步骤
