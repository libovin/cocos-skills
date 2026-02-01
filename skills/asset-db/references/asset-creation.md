# 资源创建与导入 API 参考

创建新资源或导入外部资源文件到项目中的相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `create-asset` | 创建新资源 |
| `import-asset` | 导入资源文件 |
| `generate-available-url` | 生成可用资源 URL |

---

## create-asset

创建新的资源文件。

```python
execute("asset-db", "create-asset", ["db://assets/data/config.json", '{"key": "value"}'])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源路径，格式：db://assets/xxx |
| content | string | 资源内容（JSON 字符串） |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "new-asset-uuid",
    "url": "db://assets/data/config.json"
  }
}
```

### 使用场景

- 创建 JSON 配置文件
- 创建文本数据文件
- 动态生成游戏资源

---

## import-asset

从外部文件导入资源到项目中。

```python
execute("asset-db", "import-asset", ["/path/to/file.png", "db://assets/textures"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| sourcePath | string | 源文件路径 |
| targetDirectory | string | 目标目录 |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "imported-asset-uuid",
    "url": "db://assets/textures/file.png"
  }
}
```

### 使用场景

- 导入美术资源（图片、音频等）
- 批量导入外部素材
- 复制外部文件到项目

---

## generate-available-url

生成可用的资源 URL（用于创建新资源时避免文件名冲突）。

```python
execute("asset-db", "generate-available-url", ["db://assets/newTexture.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 期望的资源 URL |

### 返回值

```json
{
  "success": true,
  "data": {
    "availableUrl": "db://assets/newTexture (1).png"
  }
}
```

### 说明

当目标 URL 已存在时，系统会自动生成带数字后缀的可用 URL。

### 使用场景

- 创建新资源前检查文件名冲突
- 自动生成唯一文件名
- 批量创建资源文件
