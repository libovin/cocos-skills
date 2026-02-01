---
name: cocos-engine
description: Cocos Creator 引擎信息查询技能。提供引擎信息和状态查询功能。当需要获取引擎版本信息或引擎状态时使用此技能。
---

# Engine Skill

引擎操作技能，用于查询引擎信息和状态。

## Actions

| Action | Description |
|--------|-------------|
| `query-info` | 查询引擎信息 |
| `query-engine-info` | 查询引擎详细信息 |

## Usage

```python
from scripts.client import execute

# 查询引擎信息
execute("engine", "query-info")

# 查询引擎详细信息
execute("engine", "query-engine-info")
```
