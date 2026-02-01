---
name: cocos-program
description: Cocos Creator 程序管理技能。提供程序信息查询、外部程序打开、URL 打开等功能。当需要启动外部程序或打开 URL 时使用此技能。
---

# Cocos Creator 程序管理

提供外部程序信息查询、启动和 URL 打开功能。

## 快速开始

```python
from scripts.client import execute

# 查询程序信息
execute("program", "query-program-info")

# 打开外部程序
execute("program", "open-program", ["program-name"])

# 打开 URL
execute("program", "open-url", ["https://example.com"])
```

## 可用操作

### 程序管理

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-program-info` | 查询程序信息 | 程序信息获取 |
| `open-program` | 打开外部程序 | 启动外部工具 |
| `open-url` | 打开 URL | 浏览器跳转 |

## API 详细说明

### query-program-info

查询已注册的程序信息。

```python
execute("program", "query-program-info")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": [
    {
      "name": "program-name",
      "path": "/path/to/program"
    }
  ]
}
```

### open-program

打开外部程序。

```python
execute("program", "open-program", ["program-name"])
```

#### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| programName | string | 程序名称 |

#### 返回值

```json
{
  "success": true,
  "data": null
}
```

### open-url

在系统浏览器中打开 URL。

```python
execute("program", "open-url", ["https://example.com"])
```

#### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 目标 URL |

#### 返回值

```json
{
  "success": true,
  "data": null
}
```

## 注意事项

1. 外部程序需要在系统中已安装并注册
2. URL 必须使用有效的协议（http://, https://, 等）
3. 某些程序可能需要管理员权限才能启动
