# 视图控制 API 参考

场景视图的模式和对齐控制相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `change-is2D` | 切换 2D/3D 视图模式 |
| `query-is2D` | 查询是否 2D 模式 |
| `focus-camera` | 相机聚焦节点 |
| `align-with-view` | 节点与视图对齐 |
| `align-view-with-node` | 视图与节点对齐 |

---

## change-is2D

切换场景视图的 2D/3D 模式。

```python
execute("scene", "change-is2D", [true])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| is2d | boolean | true 切换到 2D 模式，false 切换到 3D 模式 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## query-is2D

查询当前视图是否为 2D 模式。

```python
execute("scene", "query-is2D")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": true  // true 表示 2D 模式
}
```

---

## focus-camera

将相机聚焦到指定节点。

```python
execute("scene", "focus-camera", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## align-with-view

将节点对齐到当前视图方向。

```python
execute("scene", "align-with-view", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## align-view-with-node

将视图对齐到节点方向。

```python
execute("scene", "align-view-with-node", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```
