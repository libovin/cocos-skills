---
name: cocos-builder
description: Cocos Creator 构建工具操作技能。提供构建面板管理、查询构建 worker 状态等功能。当需要打开构建面板、查询构建准备状态或执行构建相关操作时使用此技能。
---

# Builder Skill

构建工具操作技能，用于管理 Cocos Creator 构建面板和查询构建 worker 状态。

## Actions

| Action | Description |
|--------|-------------|
| `open` | 打开构建面板 |
| `query-worker-ready` | 查询构建 worker 准备状态 |

## Usage

```python
from scripts.client import execute

# 打开构建面板
execute("builder", "open")

# 查询构建 worker 准备状态
execute("builder", "query-worker-ready")
```
