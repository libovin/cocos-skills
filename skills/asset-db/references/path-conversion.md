# 跄径转换 API 参考

资源路径、URL 和 UUID 之间的转换相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `query-path` | 查询资源路径 |
| `query-url` | 查询资源 URL |
| `query-uuid` | 查询资源 UUID |

---

## query-path

查询资源对应的磁盘路径。

```python
execute("asset-db", "query-path", ["db://assets/textures/hero.png"])
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
    "path": "/path/to/project/assets/textures/hero.png"
  }
}
```

---

## query-url

查询 UUID 对应的资源 URL。

```python
execute("asset-db", "query-url", ["asset-uuid"])
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
    "url": "db://assets/textures/hero.png"
  }
}
```

---

## query-uuid

查询资源 URL 对应的 UUID。

```python
execute("asset-db", "query-uuid", ["db://assets/textures/hero.png"])
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
    "uuid": "asset-uuid"
  }
}
```
