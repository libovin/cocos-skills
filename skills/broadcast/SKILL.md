---
name: cocos-broadcast
description: Cocos Creator 广播消息监听技能。提供广播消息日志、监听管理、活动监听器查询等功能。当需要监听编辑器事件、记录广播消息或管理消息监听器时使用此技能。
---

# Cocos Creator 广播消息监听

提供 Cocos Creator 编辑器广播消息的监听和管理功能，可以监听各种编辑器事件并记录日志。

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [get_broadcast_log](references/api-reference.md#get_broadcast_log) | 获取广播消息日志 | 查看历史消息 |
| [listen_broadcast](references/api-reference.md#listen_broadcast) | 开始监听特定广播消息 | 事件监听 |
| [stop_listening](references/api-reference.md#stop_listening) | 停止监听特定广播消息 | 停止监听 |
| [clear_broadcast_log](references/api-reference.md#clear_broadcast_log) | 清除广播消息日志 | 清理日志 |
| [get_active_listeners](references/api-reference.md#get_active_listeners) | 获取活动监听器列表 | 查询监听状态 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

## 使用示例

```python
from src.broadcast import (
    get_broadcast_log,
    listen_broadcast,
    stop_listening,
    clear_broadcast_log,
    get_active_listeners
)

# 获取最近的广播消息日志
result = get_broadcast_log(limit=50, message_type="scene:ready")
print(f"日志条目: {result['data']['count']}")

# 开始监听特定消息类型
result = listen_broadcast(message_type="scene:ready")
print(f"监听状态: {result['data']['message']}")

# 停止监听
result = stop_listening(message_type="scene:ready")
print(f"停止状态: {result['data']['message']}")

# 清除日志
result = clear_broadcast_log()
print(f"清除数量: {result['data']['clearedCount']}")

# 获取活动监听器
result = get_active_listeners()
print(f"监听器数量: {result['data']['count']}")
```
