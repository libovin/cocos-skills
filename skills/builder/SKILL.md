---
name: cocos-builder
description: Cocos Creator 构建工具操作技能。提供构建面板管理、查询构建 worker 状态等功能。当需要打开构建面板、查询构建准备状态或执行构建相关操作时使用此技能。
---

# Cocos Creator 构建工具管理

提供 Cocos Creator 构建面板的管理和构建 worker 状态查询功能。

## 快速开始

```python
from scripts.client import execute

# 打开构建面板
execute("builder", "open")

# 查询构建 worker 准备状态
execute("builder", "query-worker-ready")
```

## 可用操作

### 构建面板管理

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `open` | 打开构建面板 | 启动构建流程 |

### 构建状态查询

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-worker-ready` | 查询构建 worker 准备状态 | 构建前检查 |

## API 详细说明

### open

打开 Cocos Creator 构建面板。

```python
execute("builder", "open")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": null
}
```

### query-worker-ready

查询构建 worker 是否准备就绪。

```python
execute("builder", "query-worker-ready")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": {
    "ready": true
  }
}
```

## 注意事项

1. 打开构建面板前建议先确认 worker 准备状态
2. 构建操作可能需要较长时间，建议在后台执行
