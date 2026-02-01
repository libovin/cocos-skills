---
name: cocos-program
description: Cocos Creator 程序管理技能。提供程序信息查询、外部程序打开、URL 打开等功能。当需要启动外部程序或打开 URL 时使用此技能。
---

# Program Skill

程序操作技能，用于查询和启动外部程序。

## Actions

| Action | Description |
|--------|-------------|
| `query-program-info` | 查询程序信息 |
| `open-program` | 打开外部程序 |
| `open-url` | 打开 URL |

## Usage

```python
from scripts.client import execute

# 查询程序信息
execute("program", "query-program-info")

# 打开外部程序
execute("program", "open-program", ["program-name"])

# 打开 URL
execute("program", "open-url", ["https://example.com"])
```
