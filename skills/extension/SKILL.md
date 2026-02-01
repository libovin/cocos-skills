---
name: cocos-extension
description: Cocos Creator 扩展管理技能。提供扩展模板创建功能。当需要创建新的 Cocos Creator 扩展时使用此技能。
---

# Extension Skill

扩展操作技能，用于创建和管理 Cocos Creator 扩展。

## Actions

| Action | Description |
|--------|-------------|
| `create-extension-template` | 创建扩展模板 |

## Usage

```python
from scripts.client import execute

# 创建扩展模板
execute("extension", "create-extension-template", ["extension-name", "/path/to/extension"])
```
