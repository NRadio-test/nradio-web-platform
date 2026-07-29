# AstrBot 导入说明

核对日期：2026-07-30。

## 结论

当前知识库经过调整后可以直接导入 AstrBot，但应当上传专用文件：

`astrbot-upload/NRadio-鲲鹏无限知识库.md`

不要把整个 `knowledge-base/` 文件夹拖入，也不要在 WebUI 中选择 `import/knowledge.jsonl` 或 `import/manifest.json`。AstrBot 当前 WebUI 是逐文件上传，不是文件夹导入；上传框支持 `.txt`、`.md`、`.markdown`、`.rst`、`.adoc`、`.pdf`、`.docx`、`.epub`、`.xls` 和 `.xlsx`，不包含 `.json` 或 `.jsonl`。

## 为什么使用一个 Markdown 文件

AstrBot 会为 Markdown 启用标题感知分块器，按照标题层级保持章节语义；过长章节才会继续递归切分。因此专用文件已经把公司、产品、账号、FAQ、回答规则和来源组织成明确标题。单文件也能避免重复上传 README、来源索引和通用 JSONL 后产生重复召回或让机器人把导入说明当成业务知识。

## WebUI 操作

1. 确认 AstrBot 版本不低于 4.5.0。
2. 在“服务提供商”中配置并保存 Embedding 模型；重排序模型可选。
3. 打开“知识库”，创建一个名为“鲲鹏无限”的知识库并选择刚才的 Embedding 模型。
4. 创建后进入文档上传，只选择 `NRadio-鲲鹏无限知识库.md`。
5. 等待解析、分块与向量化完成，然后在知识库检索页测试问题。
6. 在需要使用它的配置文件中选择这个知识库。

官方文档说明一次最多上传 10 个文件，每个文件不超过 128 MB。本专用文件远低于限制。知识库选定 Embedding 模型后，不要修改该提供商的模型或向量维度，否则可能降低召回率或报错。

## 建议测试问题

- 鲲鹏无限主要做什么产品？
- C8-688 和 C8-668GL 有什么区别？
- 租房没有宽带，选设备前需要确认哪些信息？
- 所有鲲鹏设备都支持刷机吗？
- 去海外可以直接承诺覆盖 165 个国家吗？
- 抖音里的测速结果能不能当作实际速度保证？

如果型号对比题没有完整参数，正确表现应当是说明已知差异、要求确认完整型号或引导查看当前详情页，而不是自行补全参数。

## 官方依据

- AstrBot 知识库文档：https://docs.astrbot.app/use/knowledge-base.html
- 官方源码中的上传格式：https://github.com/AstrBotDevs/AstrBot/blob/master/dashboard/src/views/knowledge-base/components/DocumentsTab.vue
- 官方 Markdown 分块器：https://github.com/AstrBotDevs/AstrBot/blob/master/astrbot/core/knowledge_base/chunking/markdown.py
- 官方文本解析器：https://github.com/AstrBotDevs/AstrBot/blob/master/astrbot/core/knowledge_base/parsers/text_parser.py

`import/knowledge.jsonl` 仍保留为通用 RAG 数据。AstrBot 的后端确实另有“预分块文档导入”API，但其请求结构是顶层 `documents` 数组，每个文档包含 `file_name` 和 `chunks`，并不是当前 JSONL 的逐行对象格式；普通 WebUI 上传无需使用该 API。
