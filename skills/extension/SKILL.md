---
name: cocos-extension
description: Cocos Creator 扩展管理技能。提供扩展模板创建功能。当需要创建新的 Cocos Creator 扩展时使用此技能。
---

# Cocos Creator 扩展管理

提供 Cocos Creator 扩展模板的创建功能。

## 快速开始

```python
from scripts.client import execute

# 创建扩展模板
execute("extension", "create-extension-template", ["my-extension", "/path/to/extensions"])
```

## 可用操作

### 扩展创建

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `create-extension-template` | 创建扩展模板 | 初始化新扩展 |

## API 详细说明

### create-extension-template

创建一个新的 Cocos Creator 扩展模板。

```python
execute("extension", "create-extension-template", ["extension-name", "/path/to/output"])
```

#### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| extensionName | string | 扩展名称 |
| outputDir | string | 输出目录路径 |

#### 返回值

```json
{
  "success": true,
  "data": {
    "path": "/path/to/output/extension-name",
    "created": true
  }
}
```

## 扩展模板结构

生成的扩展包含以下结构：

```
extension-name/
├── package.json          # 扩展配置
├── README.md             # 说明文档
├── src/                  # 源代码目录
│   └── extension.ts      # 扩展入口
└── resources/            # 资源目录
```

## 注意事项

1. 扩展名称只能包含字母、数字、连字符和下划线
2. 输出目录必须具有写入权限
3. 如果扩展已存在，操作将失败
