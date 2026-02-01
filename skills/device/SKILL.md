---
name: cocos-device
description: Cocos Creator 设备信息查询技能。提供设备信息查询功能。当需要获取连接的设备信息时使用此技能。
---

# Cocos Creator 设备管理

提供连接到编辑器的设备信息查询功能。

## 快速开始

```python
from scripts.client import execute

# 查询设备信息
execute("device", "query")
```

## 可用操作

### 设备查询

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query` | 查询设备信息 | 获取连接设备列表 |

## API 详细说明

### query

查询所有连接到编辑器的设备信息。

```python
execute("device", "query")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": [
    {
      "name": "Device Name",
      "id": "device-id",
      "platform": "android|ios|web",
      "status": "connected|disconnected"
    }
  ]
}
```

## 支持的平台

| 平台 | 说明 |
|------|------|
| Android | Android 设备 |
| iOS | iOS 设备 |
| Web | 浏览器预览 |

## 注意事项

1. 设备需要先通过 USB 或网络连接到开发机
2. iOS 设备需要配置开发者证书
3. Android 设备需要开启 USB 调试模式
