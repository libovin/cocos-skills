---
name: cocos-server
description: Cocos Creator HTTP 服务器管理。提供与 Cocos Creator 编辑器 HTTP 服务器连接、健康检查、状态查询、IP 管理、网络接口查询和可用工具列表功能。当需要检查服务器连接、获取服务器状态、管理网络配置或列出可用操作时使用此技能。
---

# Cocos Server

Cocos Creator HTTP 服务器管理技能，提供与编辑器的连接诊断、状态查询和网络管理功能。

## 核心原则

### 连接优先

所有 HTTP 操作都依赖于稳定的服务器连接。在执行其他操作之前，应先确认连接正常。

```python
from libs.client import health_check, get_server_status, get_tools_list

# 第一步：确认连接
health_check()

# 第二步：获取状态
get_server_status()

# 第三步：列出可用工具
get_tools_list()
```

### 错误处理策略

所有工具返回统一的错误格式：

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
from libs.client import (
    health_check,
    get_server_status,
    get_tools_list,
    query_ip_list,
    query_sorted_ip_list,
    query_port,
    get_network_interfaces
)

# 健康检查
health_check()

# 状态查询
get_server_status()

# 工具列表
get_tools_list()

# IP 相关操作
query_ip_list()
query_sorted_ip_list()
query_port()

# 网络诊断
get_network_interfaces()
```

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [health_check](references/api-reference.md#health) | 健康检查 | 连接诊断、自动化脚本 |
| [get_server_status](references/api-reference.md#get_status) | 状态查询 | 兼容性检查、功能验证 |
| [get_tools_list](references/api-reference.md#get_tools) | 工具列表 | API 探索、文档生成 |
| [query_ip_list](references/api-reference.md#server_get_ip_list) | IP 列表 | 网络诊断、连接配置 |
| [query_sorted_ip_list](references/api-reference.md#server_get_sorted_ip_list) | 排序 IP 列表 | 自动选择最佳连接 |
| [query_port](references/api-reference.md#server_get_port) | 端口号查询 | 端口号确认、动态配置 |
| [get_network_interfaces](references/api-reference.md#server_get_network_interfaces) | 网络接口 | 网络诊断、接口选择 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md) |

## 响应格式

所有操作返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## 连接参数

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| host | string | 服务器地址 | 127.0.0.1 |
| port | integer | 端口号 | 8080 |

## 注意事项

1. 默认连接到本地编辑器（127.0.0.1:8080）
2. Cocos Creator 需开启 HTTP 服务
3. 编辑器运行时才能进行 HTTP 通信
4. 网络接口信息从本地系统获取
