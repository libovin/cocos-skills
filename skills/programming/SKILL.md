---
name: cocos-programming
description: Cocos Creator 编程设置技能。提供共享编程设置查询、插件列表查询等功能。当需要查询编程设置或插件信息时使用此技能。
---

# Programming Skill

编程设置操作技能，用于查询共享设置和插件信息。

## Actions

| Action | Description |
|--------|-------------|
| `query-shared-settings` | 查询共享编程设置 |
| `query-sorted-plugins` | 查询排序后的插件列表 |

## Usage

```python
from scripts.client import execute

# 查询共享编程设置
execute("programming", "query-shared-settings")

# 查询排序后的插件列表
execute("programming", "query-sorted-plugins")
```
