---
name: cocos-programming
description: Cocos Creator 编程设置技能。提供共享编程设置查询、插件列表查询等功能。当需要查询编程设置或插件信息时使用此技能。
---

# Cocos Creator 编程设置管理

提供 Cocos Creator 编程相关设置和插件信息的查询功能。

## 快速开始

```python
from scripts.client import execute

# 查询共享编程设置
execute("programming", "query-shared-settings")

# 查询排序后的插件列表
execute("programming", "query-sorted-plugins")
```

## 可用操作

### 编程设置查询

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-shared-settings` | 查询共享编程设置 | 配置查看 |
| `query-sorted-plugins` | 查询排序后的插件列表 | 插件管理 |

## API 详细说明

### query-shared-settings

查询共享的编程设置信息。

```python
execute("programming", "query-shared-settings")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": {
    "settings": {
      "editor": "vscode",
      "compilerVersion": "1.0.0"
    }
  }
}
```

### query-sorted-plugins

查询排序后的插件列表。

```python
execute("programming", "query-sorted-plugins")
```

#### 参数

无参数

#### 返回值

```json
{
  "success": true,
  "data": [
    {
      "name": "plugin-name",
      "version": "1.0.0",
      "enabled": true
    }
  ]
}
```

## 注意事项

1. 编程设置影响编辑器的代码编辑行为
2. 插件列表按指定顺序排序
