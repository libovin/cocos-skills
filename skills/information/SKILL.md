---
name: cocos-information
description: Cocos Creator 信息对话框管理技能。提供信息对话框状态查询、打开、关闭等功能。当需要显示或管理 Cocos Creator 的信息对话框时使用此技能。
---

# Cocos Creator 信息对话框管理

提供 Cocos Creator 信息对话框的查询、打开和关闭功能。

## 快速开始

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

## 可用操作

### 对话框管理

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-information` | 查询信息对话框状态 | 状态检查 |
| `open-information-dialog` | 打开信息对话框 | 显示信息 |
| `has-dialog` | 检查是否有打开的对话框 | 状态判断 |
| `close-dialog` | 关闭信息对话框 | 关闭对话框 |

## API 详细说明

### query-information

查询信息对话框的当前状态。

```python
execute("information", "query-information")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": {
    "visible": true,
    "title": "Information",
    "message": "Some message"
  }
}
```

### open-information-dialog

打开信息对话框并显示指定信息。

```python
execute("information", "open-information-dialog", ["Title", "Message content"])
```

#### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| title | string | 对话框标题 |
| message | string | 对话框内容 |

#### 返回值

```json
{
  "success": true,
  "data": null
}
```

### has-dialog

检查当前是否有打开的信息对话框。

```python
execute("information", "has-dialog")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": {
    "hasDialog": true
  }
}
```

### close-dialog

关闭当前打开的信息对话框。

```python
execute("information", "close-dialog")
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

## 注意事项

1. 同时只能有一个信息对话框显示
2. 关闭对话框前建议先检查对话框是否存在
3. 对话框显示时会阻塞部分编辑器操作
