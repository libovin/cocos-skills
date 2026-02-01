---
name: cocos-device
description: Cocos Creator 设备信息查询技能。提供设备信息查询功能。当需要获取连接的设备信息时使用此技能。
---

# Device Skill

设备操作技能，用于查询设备信息。

## Actions

| Action | Description |
|--------|-------------|
| `query` | 查询设备信息 |

## Usage

```python
from scripts.client import execute

# 查询设备信息
execute("device", "query")
```
