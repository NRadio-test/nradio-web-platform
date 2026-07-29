# 鲲鹏无限知识库

这套资料用于导入客服机器人、RAG 知识库或其他问答配置。内容采集于 2026-07-30，来源以鲲鹏无限官网和官方帮助中心为主，抖音主页与公开视频用于补充品牌表达、产品使用场景和用户常见问题。

## 建议导入方式

- 如果系统支持文件夹导入，直接导入 `company/`、`products/`、`channels/` 和 `faq/` 下的 Markdown 文件。
- 如果系统支持 JSONL，优先导入 `import/knowledge.jsonl`。每行是一段可独立检索的知识，带标题、来源、标签和置信度。
- `sources/source-index.md` 是溯源清单，一般不必作为问答正文导入。
- 涉及价格、库存、活动、固件版本、套餐资费、覆盖国家数量和账号粉丝数据时，回答前应再次核对官方当前页面。

### AstrBot

AstrBot WebUI 不能把本目录或 `import/knowledge.jsonl` 直接作为知识库导入。请只上传 `astrbot-upload/NRadio-鲲鹏无限知识库.md`。该文件已经合并必要正文、来源和回答边界，并按 Markdown 标题组织，以配合 AstrBot 的标题感知分块器。具体操作见 `ASTRBOT_IMPORT.md`。

## 回答边界

知识库应把“公司与产品事实”“官方宣传表述”“抖音案例或观点”分开。产品参数可能随型号、版本、批次和软件更新而变化；不要仅根据相近型号推断参数。测速、信号对比和具体场景效果受基站、频段、套餐、位置、天线、网络拥塞及固件版本影响，不应承诺固定速度或效果。

## 目录

- `company/profile.md`：公司、品牌与定位
- `products/catalog.md`：官网当前产品线概览
- `channels/douyin.md`：两个指定抖音账号及公开内容主题
- `faq/customer-questions.md`：适合客服或导购的基础问答
- `sources/source-index.md`：来源、采集日期与可信度说明
- `import/knowledge.jsonl`：配置友好的分块数据
- `import/manifest.json`：导入字段说明
- `astrbot-upload/NRadio-鲲鹏无限知识库.md`：AstrBot WebUI 直接上传文件
- `ASTRBOT_IMPORT.md`：AstrBot 官方兼容性结论与导入步骤
