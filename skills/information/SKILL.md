---
name: cocos-information
description: Cocos Creator 信息对话框管理技能。提供信息对话框状态查询、打开、关闭等功能。当需要显示或管理 Cocos Creator 的信息对话框时使用此技能。
---

# Information Skill

信息对话框操作技能，用于显示和管理 Cocos Creator 的信息对话框。

## Actions

| Action | Description |
|--------|-------------|
| `query-information` | 查询信息对话框状态 |
| `open-information-dialog` | 打开信息对话框 |
| `has-dialog` | 检查是否有打开的对话框 |
| `close-dialog` | 关闭信息对话框 |

## Usage

```python
from scripts.client import execute

# 查询信息对话框状态
execute("information", "query-information")

# 打开信息对话框
execute("information", "open-information-dialog")

# 检查是否有打开的对话框
execute("information", "has-dialog")

# 关闭信息对话框
execute("information", "close-dialog")
```
