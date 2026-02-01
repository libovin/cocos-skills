# 编辑器工具 API 参考

Gizmo 工具和坐标系统控制相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `change-gizmo-tool` | 更改 Gizmo 工具 |
| `query-gizmo-tool-name` | 查询当前 Gizmo 工具 |
| `change-gizmo-pivot` | 更改 Gizmo 中心点 |
| `query-gizmo-pivot` | 查询 Gizmo 中心点 |
| `change-gizmo-coordinate` | 更改坐标系 |
| `query-gizmo-coordinate` | 查询坐标系 |

---

## change-gizmo-tool

更改当前 Gizmo 工具。

```python
execute("scene", "change-gizmo-tool", ["move"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| tool | string | 工具名称 |

### 工具类型

| 工具 | 说明 |
|------|------|
| select | 选择工具 |
| move | 移动工具 |
| rotate | 旋转工具 |
| scale | 缩放工具 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## query-gizmo-tool-name

查询当前 Gizmo 工具名称。

```python
execute("scene", "query-gizmo-tool-name")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": "move"  // select | move | rotate | scale
}
```

---

## change-gizmo-pivot

更改 Gizmo 中心点模式。

```python
execute("scene", "change-gizmo-pivot", ["center"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| pivot | string | 中心点模式 |

### 中心点模式

| 模式 | 说明 |
|------|------|
| center | 中心模式 |
| pivot | 轴心模式 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## query-gizmo-pivot

查询当前 Gizmo 中心点模式。

```python
execute("scene", "query-gizmo-pivot")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": "center"  // center | pivot
}
```

---

## change-gizmo-coordinate

更改坐标系统。

```python
execute("scene", "change-gizmo-coordinate", ["local"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| coordinate | string | 坐标系名称 |

### 坐标系

| 坐标系 | 说明 |
|--------|------|
| world | 世界坐标 |
| local | 本地坐标 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## query-gizmo-coordinate

查询当前坐标系统。

```python
execute("scene", "query-gizmo-coordinate")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": "local"  // world | local
}
```
