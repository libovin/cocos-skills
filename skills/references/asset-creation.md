# Asset Creation

资源创建相关操作。

## API 列表

| 命令 | 功能 |
|------|------|
| `create-asset` | 创建新资源文件 |
| `import-asset` | 导入外部资源 |
| `copy-asset` | 复制资源文件 |

## create-asset

创建新资源文件，系统会根据文件扩展名自动生成默认的 JSON 数据。

```bash
cocos-skills asset-db create-asset db://assets/prefabs/Test.prefab
cocos-skills asset-db create-asset db://assets/scenes/Test.scene
cocos-skills asset-db create-asset db://assets/materials/Test.mtl
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 资源文件路径，如 `db://assets/prefabs/Test.prefab` |

### 响应

```json
{
  "success": true,
  "data": {
    "uuid": "新生成的资源UUID"
  }
}
```

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

## import-asset

导入外部资源（图片、音频等）到项目中。

```bash
cocos-skills asset-db import-asset db://assets/textures/sprite.png "C:\\Users\\username\\Pictures\\sprite.png"
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

导入后自动生成 `.meta` 文件。

## copy-asset

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

## 预制体创建指南

### 基本预制体结构

预制体使用 `.prefab` 扩展名，包含节点层级和组件信息。


### 常用组件类型

| 组件 | 类型 | 说明 |
|------|------|------|
| cc.Sprite | 精灵 | 显示图片 |
| cc.Label | 文本 | 显示文字 |
| cc.Button | 按钮 | 交互按钮 |
| cc.Widget | 对齐组件 | UI 对齐 |
| cc.Layout | 布局 | 自动布局 |
| cc.Canvas | 画布 | UI 根节点 |
| cc.Camera | 相机 | 渲染相机 |
| cc.Animation | 动画 | 动画播放 |

### 创建流程

```bash
# 1. 创建预制体文件
cocos-skills asset-db create-asset db://assets/prefabs/Enemy.prefab

# 2. 在编辑器中打开进行编辑
cocos-skills asset-db open-asset db://assets/prefabs/Enemy.prefab

# 3. 保存修改
cocos-skills scene save-scene
```

## 注意事项

1. **路径格式**：资源路径必须使用 `db://` 协议
2. **自动保存**：修改后需要调用 `scene save-scene` 保存到磁盘
3. **删除资源**：删除前使用 `query-asset-users` 检查引用关系
