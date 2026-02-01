# 资源管理 API 参考

对已有资源进行复制、移动、删除、刷新等管理操作的相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `copy-asset` | 复制资源 |
| `move-asset` | 移动资源 |
| `delete-asset` | 删除资源 |
| `reimport-asset` | 重新导入资源 |
| `refresh-asset` | 刷新资源 |

---

## copy-asset

复制资源文件。

```python
execute("asset-db", "copy-asset", ["db://assets/textures/old.png", "db://assets/textures/new.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| source | string | 源资源 URL |
| target | string | 目标资源 URL |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "copied-asset-uuid"
  }
}
```

### 使用场景

- 资源备份
- 基于现有资源创建变体
- 复制模板资源

---

## move-asset

移动资源到新位置。

```python
execute("asset-db", "move-asset", ["db://assets/textures/old.png", "db://assets/backup/old.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| source | string | 源资源 URL |
| target | string | 目标资源 URL |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

### 使用场景

- 重组资源目录结构
- 整理项目资源
- 移动资源到分类目录

---

## delete-asset

删除指定资源。

```python
execute("asset-db", "delete-asset", ["db://assets/temp/temp.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

### 使用场景

- 清理无用资源
- 删除临时文件
- 移除废弃资源

### 注意事项

删除操作不可撤销，建议先使用 `query-asset-users` 检查资源是否被其他文件引用。

---

## reimport-asset

重新导入资源（刷新资源及其依赖）。

```python
execute("asset-db", "reimport-asset", ["db://assets/textures/hero.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源 URL |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

### 使用场景

- 外部文件修改后刷新
- 强制更新资源
- 刷新资源导入设置

### 注意事项

重新导入资源会刷新资源的所有依赖关系。

---

## refresh-asset

刷新资源（同步资源状态）。

```python
execute("asset-db", "refresh-asset", ["db://assets/textures"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 目录 URL |

### 返回值

```json
{
  "success": true,
  "data": {
    "refreshed": 5  // 刷新的资源数量
  }
}
```

### 使用场景

- 同步资源状态
- 批量刷新目录
- 更新资源数据库
