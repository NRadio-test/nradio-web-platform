# 鲲鹏无限知识库

这套资料用于客服机器人、RAG 知识库和其他问答配置。最初内容采集于 2026-07-30，来源以鲲鹏无限官网和官方帮助中心为主，抖音主页与公开视频用于补充品牌表达、产品使用场景和用户常见问题；此后的成员上传资料按相同字段持续追加。

通过六位身份口令上传的资料，默认已经由成员确认可以写入知识库。结构化模型只负责忠实总结、按主题拆分、保留日期与适用条件并补充检索标签，不以联系方式、内部通知或是否属于产品参数为由过滤内容。只有文件为空、乱码或无法解析时，才允许不生成条目。

## 建议导入方式

- 如果系统支持文件夹导入，直接导入 `company/`、`products/`、`channels/` 和 `faq/` 下的 Markdown 文件。
- 如果系统支持 JSONL，优先导入 `import/knowledge.jsonl`。每行是一段可独立检索的知识，带标题、来源、上传者、标签和置信度。
- `sources/source-index.md` 是溯源清单，一般不必作为问答正文导入。
- 涉及价格、库存、活动、固件版本、套餐资费、覆盖国家数量和账号粉丝数据时，回答前应再次核对官方当前页面。

### AstrBot

AstrBot WebUI 不能把本目录或 `import/knowledge.jsonl` 直接作为知识库导入。请只上传 `astrbot-upload/NRadio-鲲鹏无限知识库.md`。该文件已经合并必要正文、来源和回答边界，并按 Markdown 标题组织，以配合 AstrBot 的标题感知分块器。具体操作见 `ASTRBOT_IMPORT.md`。

## 内容组织原则

每条知识只表达一个可独立检索的主题，并保留来源、上传者、日期、适用对象和限制条件。公司与产品事实、官方宣传表述、抖音案例、联系方式和内部业务通知都可以收录；模型不得补写原始资料没有提供的事实。产品参数和动态信息应保留完整型号、版本、时间与场景，避免 AI 在检索后错误混用。

## 目录

- `company/profile.md`：公司、品牌与定位
- `products/catalog.md`：官网当前产品线概览
- `channels/douyin.md`：两个指定抖音账号及公开内容主题
- `faq/customer-questions.md`：适合客服或导购的基础问答
- `sources/source-index.md`：来源、采集日期与可信度说明
- `import/knowledge.jsonl`：配置友好的分块数据
- `import/manifest.json`：导入字段说明
- `astrbot-upload/NRadio-鲲鹏无限知识库.md`：由 JSONL 自动生成、可在 AstrBot WebUI 直接上传的文件
- `ASTRBOT_IMPORT.md`：AstrBot 官方兼容性结论与导入步骤
