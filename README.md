# 豆瓣 MCP 服务器

[中文](README.md) | [English](README.en.md)

一个基于 Model Context Protocol (MCP) 的豆瓣数据服务，提供图书、电影、电视剧和小组话题相关查询能力，适合接入 Claude Desktop、Cherry Studio、5ire、MCP Inspector 等支持 stdio 的 MCP 客户端。

## 项目定位

本项目面向“工具调用”场景，而不是完整的豆瓣网页封装。当前重点是提供以下几类能力：

- 图书搜索与图书长评列表
- 电影 / 电视剧搜索
- 电影 / 电视剧详情
- 电影 / 电视剧长评列表
- 豆瓣小组话题列表与话题详情
- 在本地默认浏览器中打开豆瓣图书页面

## 工具总览

当前服务实际注册的 MCP tools 如下：

| Tool | 说明 |
| --- | --- |
| `search-book` | 按关键词或 ISBN 搜索图书 |
| `list-book-reviews` | 获取图书长评列表 |
| `search-movie` | 搜索电影或电视剧 |
| `get-movie-detail` | 获取电影详情 |
| `get-tv-detail` | 获取电视剧详情 |
| `list-movie-reviews` | 获取电影长评列表 |
| `list-tv-reviews` | 获取电视剧长评列表 |
| `browse` | 在默认浏览器打开图书详情页 |
| `list-group-topics` | 获取小组话题列表 |
| `get-group-topic-detail` | 获取小组话题详情 |

## 工具说明

### `search-book`

按关键词或 ISBN 搜索图书。`q` 和 `isbn` 至少需要提供一个。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `q` | `string` | 否 | 图书搜索关键词，例如 `三体` |
| `isbn` | `string` | 否 | ISBN 编号，例如 `9787501524044` |

返回特点：

- 返回 Markdown 表格
- 包含出版时间、书名、作者、评分、豆瓣 ID、ISBN

### `list-book-reviews`

获取指定图书的长评列表。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 豆瓣图书 ID |

返回特点：

- 返回 Markdown 表格
- 包含标题、评分、摘要、评论 ID

### `search-movie`

搜索电影或电视剧。结果中会同时返回结构化文本摘要和完整 `raw_json`，便于 LLM 二次解析。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `q` | `string` | 是 | 电影或电视剧关键词，例如 `霸王别姬`、`绝命毒师` |

返回特点：

- 每个结果包含 `title`、`type`、`year`、`rating`、`subtitle`、`id`、`uri`
- 末尾附带 `raw_json`
- 搜索结果可能同时包含电影和电视剧

### `get-movie-detail`

获取电影详情。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 豆瓣电影 ID，例如 `1291546` |

返回特点：

- 返回结构化文本
- 包含标题、原名、年份、类型、评分、类型标签、国家/地区、语言、上映日期、片长、导演、演员、别名、简介
- 末尾附带完整 `raw_json`

### `get-tv-detail`

获取电视剧详情。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 豆瓣电视剧 ID，例如 `2995166` |

返回特点：

- 输出结构与 `get-movie-detail` 一致
- 末尾附带完整 `raw_json`

### `list-movie-reviews`

获取电影长评列表。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 豆瓣电影 ID |

返回特点：

- 返回 Markdown 表格
- 包含标题、评分、摘要、评论 ID

### `list-tv-reviews`

获取电视剧长评列表。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 豆瓣电视剧 ID |

返回特点：

- 返回 Markdown 表格
- 包含标题、评分、摘要、评论 ID

### `browse`

在本机默认浏览器中打开图书详情页。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 豆瓣图书 ID |

说明：

- 这是本地动作，不返回网页内容
- 适合在桌面环境中配合 MCP 客户端使用

### `list-group-topics`

获取豆瓣小组话题列表，支持按小组、标签、日期过滤。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 否 | 豆瓣小组 ID，默认值为 `732764` |
| `tags` | `string[]` | 否 | 标签过滤，例如 `["python"]` |
| `from_date` | `string` | 否 | 起始日期，格式 `YYYY-MM-DD` |

返回特点：

- 返回话题列表
- 适合配合 `get-group-topic-detail` 继续获取单个话题正文

### `get-group-topic-detail`

获取单个豆瓣小组话题详情。

参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 豆瓣话题 ID |

返回特点：

- 返回话题详细内容
- 包含正文、摘要及相关元数据

## 输出格式说明

为了兼顾“人读”和“模型读”，当前工具输出主要分为两类：

- 表格型输出：主要用于评论列表和图书搜索，适合直接展示
- 结构化文本输出：主要用于电影 / 电视剧搜索与详情，字段稳定，并保留 `raw_json`

如果你在上层 Agent 中需要更可靠地抽取字段，优先使用带 `raw_json` 的工具输出。

## 使用要求

### 运行环境

- Node.js 18+
- 支持 stdio 的 MCP 客户端
- 能访问豆瓣接口的网络环境

### Cookie

部分接口依赖豆瓣 Cookie。未提供有效 Cookie 时，部分请求可能失败、返回不完整，或触发风控。

当前通过环境变量 `COOKIE` 注入，例如：

```bash
export COOKIE='bid=...; ck=...; dbcl2=...; frodotk_db=...;'
```

## 接入示例

### Claude Desktop / 通用 MCP 配置

```json
{
  "mcpServers": {
    "douban-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/douban-mcp/dist/index.js"
      ],
      "env": {
        "COOKIE": "bid=...;ck=...;dbcl2=...;frodotk_db=..."
      }
    }
  }
}
```

## 本地开发

```bash
npm install
npm run build
npm start
```

常用命令：

| 命令 | 说明 |
| --- | --- |
| `npm run build` | 编译 TypeScript 并生成 `dist/` |
| `npm run dev` | 监听编译 |
| `npm start` | 启动 MCP 服务 |

## 测试说明

仓库当前包含一个基于 MCP 客户端直连的集成测试脚本：

```bash
node tests/mcp-tools.mjs
```

注意：

- `package.json` 里仍保留了 `npm test -> jest`
- 当前仓库未看到对应的 Jest 测试配置，实际验证建议优先运行上面的集成脚本

## 已知限制

- 豆瓣接口并非公开稳定官方 MCP 接口，返回结构可能变化
- 依赖 Cookie 和当前可用网络环境
- `browse` 需要桌面环境，不适合纯无头服务器
- README 中列出的能力以当前代码为准，若接口升级请同步更新文档

## 依赖

- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- [dayjs](https://day.js.org/)
- [json2md](https://github.com/IonicaBizau/json2md)
- [open](https://github.com/sindresorhus/open)
- [turndown](https://github.com/domchristie/turndown)
- [zod](https://github.com/colinhacks/zod)

## 参考资料

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Douban API Docs Mirror](https://goddlts.github.io/douban-api-docs/)
- [Douban API Documentation](https://www.doubanapi.com/)

## License

MIT
