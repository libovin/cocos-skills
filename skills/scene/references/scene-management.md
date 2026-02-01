# 场景管理 API 参考

场景文件的打开、保存和状态查询相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `open-scene` | 打开场景 |
| `save-scene` | 保存场景 |
| `save-as-scene` | 另存为场景 |
| `close-scene` | 关闭场景 |
| `query-is-ready` | 查询场景就绪状态 |
| `query-dirty` | 查询场景修改状态 |
| `query-scene-bounds` | 查询场景边界 |
| `is-native` | 查询是否原生场景 |

---

## open-scene

打开指定场景文件。

```python
execute("scene", "open-scene", ["db://assets/scenes/Main.scene"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 场景文件路径，格式：db://assets/xxx.scene |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "scene-uuid",
    "name": "Main Scene",
    "modified": false
  }
}
```

---

## save-scene

保存当前场景。

```python
execute("scene", "save-scene")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## save-as-scene

将当前场景另存为新文件。

```python
execute("scene", "save-as-scene", ["db://assets/scenes/Copy.scene"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 新场景文件路径 |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "new-scene-uuid",
    "name": "Copy Scene"
  }
}
```

---

## close-scene

关闭当前场景。

```python
execute("scene", "close-scene")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## query-is-ready

查询场景是否就绪可操作。

```python
execute("scene", "query-is-ready")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": true
}
```

---

## query-dirty

查询场景是否有未保存的修改。

```python
execute("scene", "query-dirty")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": true  // true 表示已修改未保存
}
```

---

## query-scene-bounds

查询场景的边界信息。

```python
execute("scene", "query-scene-bounds")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": {
    "min": {"x": -100, "y": -100, "z": 0},
    "max": {"x": 100, "y": 100, "z": 0}
  }
}
```

---

## is-native

查询场景是否为原生场景（非预制体实例）。

```python
execute("scene", "is-native")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": true  // true 表示原生场景
}
```
