---
name: cocos-engine
description: Cocos Creator 引擎信息查询技能。提供引擎信息和状态查询功能。当需要获取引擎版本信息或引擎状态时使用此技能。
---

# Cocos Creator 引擎管理

提供 Cocos Creator 引擎信息和状态的查询功能。

## 快速开始

```python
from scripts.client import execute

# 查询引擎信息
execute("engine", "query-info")

# 查询引擎详细信息
execute("engine", "query-engine-info")
```

## 可用操作

### 引擎信息查询

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-info` | 查询引擎基本信息 | 版本查看 |
| `query-engine-info` | 查询引擎详细信息 | 完整信息获取 |

## API 详细说明

### query-info

查询引擎基本信息（版本号等）。

```python
execute("engine", "query-info")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": {
    "version": "3.8.0",
    "engineVersion": "3.8.0"
  }
}
```

### query-engine-info

查询引擎详细信息。

```python
execute("engine", "query-engine-info")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": {
    "version": "3.8.0",
    "engineVersion": "3.8.0",
    "cocosVersion": "3.8.0",
    "engineVersionStr": "3.8.0"
  }
}
```

## 注意事项

1. 引擎版本信息可用于兼容性检查
2. 不同版本的 Cocos Creator 可能使用不同的引擎版本
