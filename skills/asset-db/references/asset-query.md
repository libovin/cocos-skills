# 资源查询 API 参考

资源信息、元数据、使用者和依赖关系的查询相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `query-asset-info` | 获取资源信息 |
| `query-missing-asset-info` | 查询缺失资源信息 |
| `query-asset-meta` | 查询资源元数据 |
| `query-asset-users` | 查询资源使用者 |
| `query-asset-dependencies` | 查询资源依赖关系 |
| `query-assets` | 查询资源列表 |

---

## query-asset-info

查询指定资源的详细信息。

```python
execute("asset-db", "query-asset-info", ["db://assets/textures/hero.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "asset-uuid",
    "url": "db://assets/textures/hero.png",
    "path": "/path/to/project/assets/textures/hero.png",
    "type": "sprite-frame",
    "width": 128,
    "height": 128
  }
}
```

---

## query-missing-asset-info

查询缺失的资源信息（项目中引用但不存在的资源）。

```python
execute("asset-db", "query-missing-asset-info", ["asset-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 资源 UUID |

### 返回值

```json
{
  "success": true,
  "data": {
    "missing": true,
    "expectedUrl": "db://assets/missing.png"
  }
}
```

---

## query-asset-meta

查询资源的元数据信息。

```python
execute("asset-db", "query-asset-meta", ["db://assets/textures/hero.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "asset-uuid",
    "meta": {
      "type": "sprite-frame",
      "textureUuid": "texture-uuid",
      "atlasUuid": "atlas-uuid"
    }
  }
}
```

---

## query-asset-users

查询所有使用指定资源的节点或组件。

```python
execute("asset-db", "query-asset-users", ["db://assets/textures/hero.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |

### 返回值

```json
{
  "success": true,
  "data": [
    {"uuid": "node-1", "name": "Sprite1", "property": "spriteFrame"},
    {"uuid": "node-2", "name": "Sprite2", "property": "spriteFrame"}
  ]
}
```

---

## query-asset-dependencies

查询资源的依赖关系（该资源引用了哪些其他资源）。

```python
execute("asset-db", "query-asset-dependencies", ["db://assets/prefabs/Player.prefab"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |

### 返回值

```json
{
  "success": true,
  "data": [
    {"uuid": "dep-1", "type": "asset", "url": "db://assets/textures/hero.png"},
    {"uuid": "dep-2", "type": "asset", "url": "db://assets/scripts/player.js"}
  ]
}
```

---

## query-assets

查询指定条件的资源列表。

```python
execute("asset-db", "query-assets", ["db://assets/textures", "image"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| directory | string | 查询目录 |
| type | string | 资源类型过滤（可选） |

### 常用资源类型

| 类型 | 说明 |
|------|------|
| image | 图片资源 |
| json | JSON 文件 |
| prefab | 预制体 |
| scene | 场景文件 |
| script | 脚本文件 |
| audio | 音频文件 |

### 返回值

```json
{
  "success": true,
  "data": [
    {"uuid": "asset-1", "url": "db://assets/textures/hero.png", "type": "image"},
    {"uuid": "asset-2", "url": "db://assets/textures/bg.png", "type": "image"}
  ]
}
```
