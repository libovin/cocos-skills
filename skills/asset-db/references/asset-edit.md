# 资源编辑 API 参考

在编辑器中打开资源进行编辑或保存修改的相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `open-asset` | 打开资源 |
| `save-asset` | 保存资源 |
| `save-asset-meta` | 保存资源元数据 |

---

## open-asset

在资源编辑器中打开指定资源。

```python
execute("asset-db", "open-asset", ["db://assets/prefabs/Player.prefab"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |

### 可编辑的资源类型

| 类型 | 说明 |
|------|------|
| .prefab | 预制体编辑器 |
| .scene | 场景编辑器 |
| .fire | 粒子系统编辑器 |
| .md | Markdown 预览 |
| .json | JSON 编辑器 |
| .png/.jpg | 图片预览 |

### 返回值

```json
{
  "success": true,
  "data": {
    "opened": true,
    "editor": "prefab"
  }
}
```

### 使用场景

- 可视化编辑预制体
- 编辑场景文件
- 查看图片资源

---

## save-asset

保存资源内容。

```python
execute("asset-db", "save-asset", ["db://assets/data/config.json", '{"key": "new value"}'])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |
| content | string | 资源内容（JSON 字符串） |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

### 使用场景

- 更新配置文件
- 修改资源内容
- 动态保存数据

---

## save-asset-meta

保存资源的元数据。

```python
execute("asset-db", "save-asset-meta", ["db://assets/textures/hero.png", {"textureType": "rgba8888"}])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |
| meta | object | 元数据对象 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

### 使用场景

- 修改资源导入设置
- 更新纹理压缩配置
- 调整资源属性

### 常见元数据字段

| 资源类型 | 常见字段 |
|----------|----------|
| 图片 | textureType, wrapModeS, wrapModeT, filterMode |
| 音频 | loadMode, clipWavFormat |
| 字体 | useCustomFontRawData |
