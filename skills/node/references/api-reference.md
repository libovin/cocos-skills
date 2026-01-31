# Node API 參考

Cocos Creator 節點操作的完整 API 參考。

## API 列表

| API | 功能 | HTTP 方法 |
|-----|------|----------|
| node_create | 創建節點 | POST |
| node_get_info | 獲取節點信息 | POST |
| node_find | 查找節點 | POST |
| node_get_all | 獲取所有節點 | POST |
| node_set_property | 設置屬性 | POST |
| node_set_transform | 設置變換 | POST |
| node_delete | 刪除節點 | POST |
| node_move | 移動節點 | POST |
| node_duplicate | 複製節點 | POST |
| node_detect_type | 檢測節點類型 | POST |

---

## node_create

在場景中創建新的節點。

### 請求

```python
execute_tool("node_create", {
    "name": "Player",
    "parentUuid": "parent-uuid",
    "position": {"x": 100, "y": 200}
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 | 預設值 |
|------|------|------|------|--------|
| name | string | 是 | 新節點名稱 | - |
| parentUuid | string | 否 | 父節點 UUID | 根節點 |
| position | object | 否 | 位置 {x, y, z} | {0, 0, 0} |
| rotation | object | 否 | 旋轉 {x, y, z} (歐拉角) | {0, 0, 0} |
| scale | object | 否 | 縮放 {x, y, z} | {1, 1, 1} |

### 響應

```json
{
  "success": true,
  "data": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Player"
  }
}
```

---

## node_get_info

獲取節點的詳細信息。

### 請求

```python
execute_tool("node_get_info", {
    "uuid": "node-uuid"
})
```

### 響應

```json
{
  "success": true,
  "data": {
    "uuid": "xxx-xxx-xxx",
    "name": "Player",
    "path": "Canvas/Player",
    "parentUuid": "parent-uuid",
    "active": true,
    "position": {"x": 100, "y": 200, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0},
    "scale": {"x": 1, "y": 1, "z": 1},
    "children": ["child1-uuid", "child2-uuid"]
  }
}
```

---

## node_find

按名稱或路徑查找節點。

### 請求

```python
# 按名稱查找
execute_tool("node_find", {"name": "Player"})

# 按路徑查找
execute_tool("node_find", {"path": "Canvas/Panel/Button"})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | 否* | 節點名稱 (支持通配符) |
| path | string | 否* | 節點路徑 |

*至少提供一個參數

---

## node_get_all

獲取場景中的所有節點。

### 請求

```python
execute_tool("node_get_all")
```

### 響應

```json
{
  "success": true,
  "data": {
    "totalNodes": 42,
    "nodes": [
      {"uuid": "xxx", "name": "Canvas", "path": "Canvas"},
      {"uuid": "yyy", "name": "Button", "path": "Canvas/Button"}
    ]
  }
}
```

---

## node_set_property

設置節點屬性。

### 請求

```python
execute_tool("node_set_property", {
    "uuid": "node-uuid",
    "path": "active",
    "value": True
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| path | string | 是 | 屬性路徑 (如 "active", "name") |
| value | any | 是 | 屬性值 |

### 常用屬性

| 屬性路徑 | 類型 | 說明 |
|----------|------|------|
| active | boolean | 是否激活 |
| name | string | 節點名稱 |

---

## node_set_transform

設置節點的變換屬性。

### 請求

```python
execute_tool("node_set_transform", {
    "uuid": "node-uuid",
    "position": {"x": 0, "y": 0, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0},
    "scale": {"x": 1, "y": 1, "z": 1}
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| position | object | 否 | 位置 {x, y, z} |
| rotation | object | 否 | 旋轉 {x, y, z} (度) |
| scale | object | 否 | 縮放 {x, y, z} |

### 坐標系

| 空間 | 說明 |
|------|------|
| world | 世界坐標系 |
| local | 局部坐標系 |

---

## node_delete

刪除指定節點。

### 請求

```python
execute_tool("node_delete", {
    "uuid": "node-uuid"
})
```

### 注意事項

- 刪除節點會同時刪除其所有子節點
- 操作不可撤銷

---

## node_move

將節點移動到新的父節點下。

### 請求

```python
execute_tool("node_move", {
    "uuid": "node-uuid",
    "parentUuid": "new-parent-uuid"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 要移動的節點 UUID |
| parentUuid | string | 是 | 新父節點 UUID |

### 注意事項

- 移動節點時子節點會隨之移動

---

## node_duplicate

複製節點及其子節點。

### 請求

```python
execute_tool("node_duplicate", {
    "uuid": "node-uuid",
    "recursive": True
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 | 預設值 |
|------|------|------|------|--------|
| uuid | string | 是 | 要複製的節點 UUID | - |
| recursive | boolean | 否 | 是否包含子節點 | true |

### 響應

```json
{
  "success": true,
  "data": {
    "newUuid": "new-xxx-xxx",
    "duplicatedCount": 5
  }
}
```

---

## node_detect_type

檢測節點是 2D 還是 3D 節點。

### 請求

```python
execute_tool("node_detect_type", {
    "uuid": "node-uuid"
})
```

### 響應

```json
{
  "success": true,
  "data": {
    "type": "2D",
    "uiNode": true
  }
}
```

---

## 使用範例

```python
# 創建玩家節點
result = execute_tool("node_create", {
    "name": "Player",
    "parentUuid": "scene-uuid",
    "position": {"x": 0, "y": 0}
})
player_uuid = result["data"]["uuid"]

# 添加精靈組件
execute_tool("component_add", {
    "uuid": player_uuid,
    "componentType": "cc.Sprite"
})

# 設置位置
execute_tool("node_set_transform", {
    "uuid": player_uuid,
    "position": {"x": 100, "y": 50, "z": 0}
})

# 複製節點
execute_tool("node_duplicate", {
    "uuid": player_uuid,
    "recursive": True
})

# 查找所有敵人
result = execute_tool("node_find", {"name": "Enemy*"})
```
