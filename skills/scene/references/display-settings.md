# 显示设置 API 参考

网格和图标显示控制相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `set-grid-visible` | 设置网格可见性 |
| `query-is-grid-visible` | 查询网格可见性 |
| `set-icon-gizmo-3d` | 设置图标 3D 模式 |
| `query-is-icon-gizmo-3d` | 查询图标是否 3D |
| `set-icon-gizmo-size` | 设置图标大小 |
| `query-is-icon-gizmo-size` | 查询图标大小 |

---

## set-grid-visible

设置场景网格的可见性。

```python
execute("scene", "set-grid-visible", [true])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| visible | boolean | true 显示网格，false 隐藏网格 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## query-is-grid-visible

查询网格当前是否可见。

```python
execute("scene", "query-is-grid-visible")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": true  // true 表示网格可见
}
```

---

## set-icon-gizmo-3d

设置节点图标是否使用 3D 模式显示。

```python
execute("scene", "set-icon-gizmo-3d", [false])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| enabled | boolean | true 启用 3D 图标，false 使用平面图标 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## query-is-icon-gizmo-3d

查询图标当前是否为 3D 模式。

```python
execute("scene", "query-is-icon-gizmo-3d")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": false  // true 表示 3D 模式
}
```

---

## set-icon-gizmo-size

设置节点图标的大小。

```python
execute("scene", "set-icon-gizmo-size", [64])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| size | number | 图标大小，通常为 16-256 之间的值 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## query-is-icon-gizmo-size

查询当前图标大小设置。

```python
execute("scene", "query-is-icon-gizmo-size")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": 64  // 图标大小值
}
```
