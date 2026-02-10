# Asset Operations

资源数据库操作相关功能。

## API 列表

| 命令 | 功能 |
|------|------|
| `query-ready` | 查询资源数据库状态 |
| `create-asset` | 创建新资源文件 |
| `import-asset` | 导入外部资源 |
| `copy-asset` | 复制资源文件 |
| `move-asset` | 移动/重命名资源 |
| `delete-asset` | 删除资源文件 |
| `open-asset` | 在编辑器中打开资源 |
| `save-asset` | 保存资源 |
| `save-asset-meta` | 保存 meta 文件 |
| `reimport-asset` | 重新导入资源 |
| `refresh-asset` | 刷新资源状态 |
| `query-asset-info` | 查询资源详细信息 |
| `query-asset-meta` | 查询 meta 配置 |
| `query-asset-users` | 查询资源使用情况 |
| `query-asset-dependencies` | 查询资源依赖 |
| `query-assets` | 查询资源列表 |
| `query-path` | UUID → 文件系统路径 |
| `query-url` | UUID → db:// URL |
| `query-uuid` | 路径 → UUID |
| `generate-available-url` | 生成可用资源 URL |

---

## 状态检查

### query-ready

查询资源数据库是否准备就绪。

```bash
cocos-skills asset-db query-ready
```

### 响应

```json
{
  "success": true,
  "data": true
}
```

---

## 资源创建与导入

### create-asset

创建新资源文件，系统会根据文件扩展名自动生成默认的 JSON 数据。

```bash
cocos-skills asset-db create-asset db://assets/prefabs/Test.prefab
cocos-skills asset-db create-asset db://assets/scenes/Test.scene
cocos-skills asset-db create-asset db://assets/materials/Test.mtl
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源文件路径 |

### 支持的文件类型

| 扩展名 | 类型 | 说明 |
|--------|------|------|
| .prefab | 预制体 | 节点预制体 |
| .scene | 场景 | 场景文件 |
| .material | 材质 | 普通材质 |
| .mtl | 材质 | 材质文件 |
| .pmtl | 物理材质 | 物理材质 |
| .anim | 动画 | 动画剪辑 |
| .animask | 动画遮罩 | 动画遮罩文件 |
| .pac | 粒子素材 | 粒子组件素材 |
| .labelatlas | 图集 | 标签图集 |

### import-asset

导入外部资源（图片、音频等）到项目中。

```bash
cocos-skills asset-db import-asset db://assets/textures/sprite.png "C:/Users/user/Pictures/sprite.png"
cocos-skills asset-db import-asset db://assets/audio/bgm.mp3 "D:/Music/bgm.mp3"
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 目标资源路径（`db://assets/...`） |
| importPath | string | 是 | 源文件路径（本地绝对路径或 URL） |

### 支持的格式

- 图片：`.png`, `.jpg`, `.webp`
- 音频：`.mp3`, `.wav`, `.ogg`
- 其他：`.json`, `.prefab`

---

## 资源管理

### copy-asset

复制资源文件，同时复制 `.meta` 文件。

```bash
cocos-skills asset-db copy-asset db://assets/prefabs/Old.prefab db://assets/prefabs/New.prefab
cocos-skills asset-db copy-asset db://assets/textures/sprite.png db://assets/textures/sprite_copy.png
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| source | string | 是 | 源资源路径 |
| target | string | 是 | 目标资源路径 |

复制操作会生成新的 UUID。

### move-asset

移动/重命名资源文件。

```bash
cocos-skills asset-db move-asset db://assets/prefabs/Old.prefab db://assets/prefabs/New.prefab
cocos-skills asset-db move-asset db://assets/temp/scene.scene db://assets/scenes/Main.scene
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| source | string | 是 | 源资源路径 |
| target | string | 是 | 目标资源路径 |

移动操作会自动更新所有引用该资源的地方。谨慎操作，避免破坏引用关系。

### delete-asset

删除资源文件（包含 meta 文件）。

```bash
cocos-skills asset-db delete-asset db://assets/prefabs/Test.prefab
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 要删除的资源路径 |

此操作不可撤销。建议先使用 `query-asset-users` 检查是否有其他文件引用该资源。

### open-asset

在编辑器中打开资源，支持 UUID 或路径格式。

```bash
cocos-skills asset-db open-asset db://assets/scenes/Main.scene
cocos-skills asset-db open-asset <uuid>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuidOrPath | string | 是 | UUID 或路径（`db://...`） |

打开资源前会自动保存当前场景的未保存更改。

### save-asset

保存资源（自动保存当前场景）。

```bash
cocos-skills asset-db save-asset db://assets/data/config.json
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源路径 |

### reimport-asset

强制重新导入资源。

```bash
cocos-skills asset-db reimport-asset db://assets/textures/sprite.png
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源路径 |

在更新导入设置或源文件被外部修改后使用。

### refresh-asset

刷新资源状态（不重新导入）。

```bash
cocos-skills asset-db refresh-asset db://assets/textures/sprite.png
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源路径 |

检查资源的磁盘状态是否发生变化，但不重新导入。

---

## 资源查询

### query-asset-info

查询资源详细信息。

```bash
cocos-skills asset-db query-asset-info db://assets/scenes/Main.scene
cocos-skills asset-db query-asset-info <uuid>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源路径或 UUID |

返回资源的完整元数据，包括类型、文件大小、导入时间、依赖项等。

### query-asset-meta

查询资源的 meta 配置数据。

```bash
cocos-skills asset-db query-asset-meta db://assets/textures/sprite.png
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源路径或 UUID |

返回 .meta 文件的内容，包含导入设置、裁剪信息、打包选项等。

### query-asset-users

查询所有引用该资源的文件列表。

```bash
cocos-skills asset-db query-asset-users <uuid>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 资源的 UUID |

返回场景、预制体等所有引用该资源的文件。删除资源前务必检查此列表。

### query-asset-dependencies

查询资源依赖的所有其他资源。

```bash
cocos-skills asset-db query-asset-dependencies db://assets/scenes/Main.scene
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源路径 |

返回该资源直接和间接依赖的所有资源树状结构。

### query-assets

查询资源列表。

```bash
cocos-skills asset-db query-assets
cocos-skills asset-db query-assets "db://assets/prefabs"
cocos-skills asset-db query-assets "db://assets/scenes"
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pattern | string | 否 | 搜索路径，如 `db://assets/prefabs` |

不传参数返回所有资源。pattern 参数指定目录路径，会返回该目录及其子目录中的资源。

---

## 路径转换

### query-uuid

通过路径查询资源的 UUID。

```bash
cocos-skills asset-db query-uuid db://assets/scenes/Main.scene
cocos-skills asset-db query-uuid "E:/cocos-project/assets/scenes/scene.scene"
cocos-skills asset-db query-uuid "/home/user/project/assets/textures/sprite.png"
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源路径（`db://` 格式或文件系统绝对路径） |

### query-url

通过 UUID 查询资源的 `db://` URL。

```bash
cocos-skills asset-db query-url <uuid>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 资源的 UUID |

返回 `db://` 格式的 URL（如 `db://assets/prefabs/New.prefab`）。

### query-path

通过 UUID 查询资源的文件系统绝对路径。

```bash
cocos-skills asset-db query-path <uuid>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 资源的 UUID |

返回文件系统的绝对路径（如 `E:\project\assets\prefab.prefab`）。

---

## 其他

### generate-available-url

生成可用的资源 URL（自动处理命名冲突）。

```bash
cocos-skills asset-db generate-available-url "db://assets/textures/sprite.png" false
cocos-skills asset-db generate-available-url "db://assets/prefabs/New.prefab" false
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 完整资源路径（含扩展名） |
| isDirectory | boolean | 是 | 是否为目录（通常传 false） |

如果目标路径已存在，会自动添加数字后缀（如 `New-001.prefab`、`New-002.prefab`）。

---

## 路径格式

Cocos Creator 使用 `db://` 协议的路径：

| 类型 | 格式 | 示例 |
|------|------|------|
| 场景文件 | `db://assets/scenes/...` | `db://assets/scenes/Main.scene` |
| 预制体 | `db://assets/prefabs/...` | `db://assets/prefabs/Enemy.prefab` |
| 图片资源 | `db://assets/textures/...` | `db://assets/textures/sprite.png` |

## 注意事项

1. **路径格式**：资源路径必须使用 `db://` 协议
2. **自动保存**：修改后需要调用 `scene save-scene` 保存到磁盘
3. **删除资源**：删除前使用 `query-asset-users` 检查引用关系
4. **UUID 获取**：使用 `query-uuid` 将路径转换为 UUID
