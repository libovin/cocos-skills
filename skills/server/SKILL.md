---
name: cocos-server
description: Cocos Creator HTTP 服务器管理技能。提供与 Cocos Creator 编辑器 HTTP 服务器连接、健康检查、状态查询、IP 管理和网络接口查询功能。当需要检查服务器连接、获取服务器状态或管理网络配置时使用此技能。
---

# Cocos Server

Cocos Creator HTTP 服务器管理技能，提供与编辑器的连接诊断、状态查询和网络管理功能。

## 核心原则

### 连接优先

所有 HTTP 操作都依赖于稳定的服务器连接。在执行其他操作之前，应先确认连接正常。

```python
from scripts.client import health_check, get_status, execute

# 第一步：确认连接
health_check()

# 第二步：获取状态
get_status()

# 第三步：查询服务器信息
execute("server", "query-ip-list")
```

### 错误处理策略

所有操作返回统一的错误格式：

```json
{
  "success": false,
  "error": "连接失败: Connection refused",
  "data": null
}
```

常见错误：
- **Connection refused**: 服务器未启动或端口号错误
- **HTTP 500**: 服务器内部错误
- **Timeout**: 服务器响应超时

## 快速开始

```python
from scripts.client import health_check, get_status, execute

# 健康检查
health_check()

# 状态查询
get_status()

# IP 列表查询
execute("server", "query-ip-list")

# 端口查询
execute("server", "query-port")
```

## 可用操作

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-ip-list` | 查询 IP 列表 | 网络诊断、连接配置 |
| `query-port` | 查询端口号 | 端口号确认、动态配置 |

## 全局函数

| 函数 | 功能 | 使用场景 |
|------|------|----------|
| `health_check()` | 健康检查 | 连接诊断 |
| `get_status()` | 获取状态 | 状态查询 |
| `get_modules()` | 获取模块列表 | API 探索 |
| `get_module_actions(module)` | 获取模块操作 | 操作查询 |

## 响应格式

所有操作返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## 连接配置

客户端会自动从 `~/.cocos-http/cocos-http.json` 读取服务器配置：

```json
{
  "currentProject": "project-name",
  "projects": {
    "project-name": {
      "serverUrl": "http://127.0.0.1:54321"
    }
  }
}
```

默认连接地址：`http://127.0.0.1:54321`

## 注意事项

1. 默认连接到本地编辑器（127.0.0.1:54321）
2. Cocos Creator 需开启 HTTP 服务
3. 编辑器运行时才能进行 HTTP 通信
