# 属性管理 API 参考

节点属性的设置、重置和数组操作相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `set-property` | 设置属性值 |
| `reset-property` | 重置属性值 |
| `move-array-element` | 移动数组元素 |
| `remove-array-element` | 删除数组元素 |

---

## set-property

设置节点属性值。

```python
execute("scene", "set-property", ["node-uuid", "position", {"x": 100, "y": 100, "z": 0}])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| path | string | 属性路径，如 "position"、"scale"、"angle" |
| value | any | 属性值 |

### 常用属性

| 属性 | 类型 | 示例 |
|------|------|------|
| position | Vec3 | {"x": 100, "y": 100, "z": 0} |
| scale | Vec3 | {"x": 1, "y": 1, "z": 1} |
| rotation | Vec3 | {"x": 0, "y": 0, "z": 0} |
| angle | number | 45 |
| active | boolean | true |
| name | string | "NewName" |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## reset-property

重置节点属性到默认值。

```python
execute("scene", "reset-property", ["node-uuid", "position"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| path | string | 属性路径 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## move-array-element

移动数组中的元素位置。

```python
execute("scene", "move-array-element", ["node-uuid", "children", 0, 5])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| path | string | 数组属性路径，如 "children" |
| oldIndex | number | 原索引位置 |
| newIndex | number | 新索引位置 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## remove-array-element

删除数组中的指定元素。

```python
execute("scene", "remove-array-element", ["node-uuid", "children", 2])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| path | string | 数组属性路径 |
| index | number | 要删除的索引位置 |

### 返回值

```json
{
  "success": true,
  "data": null
}
```
