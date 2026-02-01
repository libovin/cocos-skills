---
name: cocos-asset-db
description: Cocos Creator 资源数据库管理技能。提供资源的创建、导入、复制、移动、删除、保存、查询等功能。当需要管理游戏资源、处理资源引用或批量操作资源文件时使用此技能。
---

# Cocos Creator 资源数据库管理

提供 Cocos Creator 编辑器资源数据库的完整功能，包括资源的创建、导入、复制、移动、删除、保存、查询等操作。

## 快速开始

```python
from scripts.client import execute

# 查询资源数据库就绪状态
execute("asset-db", "query-ready")

# 创建资源
execute("asset-db", "create-asset", ["db://assets/data/config.json", '{"key": "value"}'])

# 导入资源
execute("asset-db", "import-asset", ["/path/to/file.png", "db://assets/textures"])

# 查询资源信息
execute("asset-db", "query-asset-info", ["db://assets/textures/hero.png"])

# 复制资源
execute("asset-db", "copy-asset", ["db://assets/textures/old.png", "db://assets/textures/new.png"])

# 移动资源
execute("asset-db", "move-asset", ["db://assets/textures/old.png", "db://assets/backup/old.png"])

# 删除资源
execute("asset-db", "delete-asset", ["db://assets/temp/temp.png"])

# 保存资源
execute("asset-db", "save-asset", ["db://assets/data/config.json", '{"key": "new value"}'])

# 重新导入资源
execute("asset-db", "reimport-asset", ["db://assets/textures/hero.png"])
```

## 可用操作

### 状态检查

检查资源数据库的可用性和就绪状态。

**详细 API**: [status.md](references/status.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-ready` | 查询资源数据库就绪状态 | 连接检查 |

### 资源创建与导入

创建新资源或导入外部资源文件到项目中。

**详细 API**: [asset-creation.md](references/asset-creation.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `create-asset` | 创建新资源 | JSON 配置、文本文件创建 |
| `import-asset` | 导入外部资源文件 | 图片、音频导入 |
| `generate-available-url` | 生成可用资源 URL | 避免文件名冲突 |

### 资源管理

对已有资源进行复制、移动、删除、刷新等管理操作。

**详细 API**: [asset-management.md](references/asset-management.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `copy-asset` | 复制资源 | 资源备份 |
| `move-asset` | 移动资源 | 重组资源目录 |
| `delete-asset` | 删除资源 | 清理无用资源 |
| `reimport-asset` | 重新导入资源 | 刷新资源 |
| `refresh-asset` | 刷新资源 | 同步资源状态 |

### 资源查询

查询资源信息、元数据、使用者和依赖关系。

**详细 API**: [asset-query.md](references/asset-query.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-asset-info` | 获取资源详细信息 | 资源状态检查 |
| `query-missing-asset-info` | 查询缺失资源信息 | 资源问题诊断 |
| `query-asset-meta` | 查询资源元数据 | 配置查看 |
| `query-asset-users` | 查询资源使用者 | 依赖影响分析 |
| `query-asset-dependencies` | 查询资源依赖关系 | 依赖树分析 |
| `query-assets` | 查询目录资源列表 | 资源浏览 |

### 资源路径操作

资源路径、URL 和 UUID 之间的转换与查询。

**详细 API**: [path-conversion.md](references/path-conversion.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-path` | URL 转磁盘路径 | 文件系统操作 |
| `query-url` | UUID 转 URL | 资源定位 |
| `query-uuid` | URL 转 UUID | 跨场景引用 |

### 资源编辑

在编辑器中打开资源进行编辑或保存修改。

**详细 API**: [asset-edit.md](references/asset-edit.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `open-asset` | 打开资源编辑器 | 可视化编辑 |
| `save-asset` | 保存资源内容 | 内容更新 |
| `save-asset-meta` | 保存资源元数据 | 配置修改 |

## 资源路径格式

资源路径使用 Cocos Creator 资源数据库路径：

| 类型 | 格式 | 示例 |
|------|------|------|
| 相对路径 | db://assets/... | db://assets/textures/hero.png |
| 磁盘路径 | /path/to/... | /path/to/project/assets/textures/hero.png |

## 响应格式

所有操作返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## 使用示例

### 资源创建与导入

```python
# 创建 JSON 配置文件
execute("asset-db", "create-asset", ["db://assets/data/config.json", '{"key": "value"}'])

# 导入外部图片
execute("asset-db", "import-asset", ["/path/to/image.png", "db://assets/textures"])

# 生成可用 URL
execute("asset-db", "generate-available-url", ["db://assets/newTexture.png"])
```

### 资源管理

```python
# 复制资源
execute("asset-db", "copy-asset", ["db://assets/textures/old.png", "db://assets/textures/new.png"])

# 移动资源到备份目录
execute("asset-db", "move-asset", ["db://assets/temp.png", "db://assets/backup/temp.png"])

# 删除临时资源
execute("asset-db", "delete-asset", ["db://assets/temp/temp.png"])
```

### 资源查询

```python
# 查询资源信息
execute("asset-db", "query-asset-info", ["db://assets/textures/hero.png"])

# 查询资源使用者
execute("asset-db", "query-asset-users", ["db://assets/textures/hero.png"])

# 查询资源依赖
execute("asset-db", "query-asset-dependencies", ["db://assets/prefabs/Player.prefab"])

# 列出目录下的所有图片
execute("asset-db", "query-assets", ["db://assets/textures", "image"])
```

### 路径转换

```python
# URL 转 UUID
execute("asset-db", "query-uuid", ["db://assets/textures/hero.png"])

# UUID 转 URL
execute("asset-db", "query-url", ["asset-uuid"])

# URL 转磁盘路径
execute("asset-db", "query-path", ["db://assets/textures/hero.png"])
```

### 资源保存

```python
# 保存资源内容
execute("asset-db", "save-asset", ["db://assets/data/config.json", '{"key": "new value"}'])

# 保存资源元数据
execute("asset-db", "save-asset-meta", ["db://assets/textures/hero.png", {"textureType": "rgba8888"}])
```

## 注意事项

1. **操作前检查**: 资源操作前建议先调用 `query-ready` 确认资源数据库就绪
2. **不可撤销**: 复制、移动、删除操作不可撤销，请谨慎操作
3. **依赖刷新**: 重新导入资源会刷新资源的所有依赖关系
4. **路径格式**: 所有资源 URL 使用 `db://assets/` 格式
5. **UUID 获取**: 通过 `query-uuid` 可以从 URL 获取资源的 UUID
