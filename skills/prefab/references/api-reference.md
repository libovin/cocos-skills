# Prefab API 參考

Cocos Creator 預製體操作的完整 API 參考。

## API 列表

| API | 功能 | HTTP 方法 |
|-----|------|----------|
| prefab_get_list | 獲取預製體列表 | GET/POST |
| prefab_load | 載入預製體 | POST |
| prefab_get_info | 獲取預製體信息 | POST |
| prefab_instantiate | 實例化預製體 | POST |
| prefab_create_from_node | 從節點創建預製體 | POST |
| prefab_update | 更新預製體資源 | POST |
| prefab_apply | 應用實例修改 | POST |
| prefab_revert | 還原預製體實例 | POST |
| prefab_unlink | 解除預製體連結 | POST |
| prefab_duplicate | 複製預製體 | POST |
| prefab_validate | 驗證預製體 | POST |
| prefab_restore | 恢復預製體節點 | POST |

---

## prefab_get_list

獲取項目中所有預製體的列表。

### 請求

```python
execute_tool("prefab_get_list")
```

### 響應

```json
{
  "success": true,
  "data": {
    "total": 25,
    "prefabs": [
      {
        "name": "Player",
        "path": "db://assets/prefabs/Player.prefab",
        "uuid": "xxx-xxx-xxx"
      },
      {
        "name": "Enemy",
        "path": "db://assets/prefabs/Enemy.prefab",
        "uuid": "yyy-yyy-yyy"
      }
    ]
  }
}
```

---

## prefab_load

載入預製體資源到編輯器。

### 請求

```python
execute_tool("prefab_load", {
    "uuid": "db://assets/prefabs/Player.prefab"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 預製體路徑或 UUID |

---

## prefab_get_info

獲取預製體的詳細信息。

### 請求

```python
execute_tool("prefab_get_info", {
    "uuid": "prefab-uuid"
})
```

### 響應

```json
{
  "success": true,
  "data": {
    "name": "Player",
    "path": "db://assets/prefabs/Player.prefab",
    "uuid": "xxx-xxx-xxx",
    "rootNode": {
      "name": "Player",
      "components": ["cc.Sprite", "cc.RigidBody"],
      "children": [...]
    }
  }
}
```

---

## prefab_instantiate

將預製體實例化到場景中。

### 請求

```python
execute_tool("prefab_instantiate", {
    "uuid": "db://assets/prefabs/Player.prefab",
    "parentUuid": "parent-uuid",
    "position": {"x": 0, "y": 0}
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 預製體路徑或 UUID |
| parentUuid | string | 否 | 父節點 UUID |
| position | object | 否 | 實例化位置 {x, y, z} |

### 響應

```json
{
  "success": true,
  "data": {
    "instanceUuid": "new-xxx-xxx",
    "rootNodeUuid": "root-xxx-xxx"
  }
}
```

---

## prefab_create_from_node

從場景節點創建預製體。

### 請求

```python
execute_tool("prefab_create_from_node", {
    "uuid": "node-uuid",
    "targetPath": "db://assets/prefabs/NewPrefab.prefab"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| targetPath | string | 是 | 預製體保存路徑 |

---

## prefab_update

更新預製體資源（同步當前狀態）。

### 請求

```python
execute_tool("prefab_update", {
    "uuid": "prefab-uuid"
})
```

---

## prefab_apply

將預製體實例的修改應用到資源。

### 請求

```python
execute_tool("prefab_apply", {
    "uuid": "instance-node-uuid"
})
```

### 注意事項

- 應用操作會影響所有使用該預製體的實例
- 請謹慎使用，確保修改是預期的

---

## prefab_revert

將預製體實例還原為原始狀態。

### 請求

```python
execute_tool("prefab_revert", {
    "uuid": "instance-node-uuid"
})
```

### 注意事項

- 還原操作會清除實例上的所有本地修改
- 操作不可撤銷

---

## prefab_unlink

解除預製體實例與資源的連結。

### 請求

```python
execute_tool("prefab_unlink", {
    "uuid": "instance-node-uuid"
})
```

### 注意事項

- 解除連結後的節點不再是預製體實例
- 將變為普通節點（灰色顯示）

---

## prefab_duplicate

複製預製體資源。

### 請求

```python
execute_tool("prefab_duplicate", {
    "uuid": "prefab-uuid",
    "targetPath": "db://assets/prefabs/Copy.prefab"
})
```

---

## prefab_validate

驗證預製體文件的完整性。

### 請求

```python
execute_tool("prefab_validate", {
    "uuid": "prefab-uuid"
})
```

### 響應

```json
{
  "success": true,
  "data": {
    "valid": true,
    "issues": []
  }
}
```

---

## prefab_restore

修復預製體實例的連結。

### 請求

```python
execute_tool("prefab_restore", {
    "nodeUuid": "instance-uuid",
    "assetUuid": "prefab-asset-uuid"
})
```

---

## 預製體狀態管理

| 狀態 | 說明 | 操作 |
|------|------|------|
| 綠色 | 預製體實例，無本地修改 | 無 |
| 藍色 | 預製體實例，有本地修改 | Apply / Revert |
| 灰色 | 普通節點（已解除連結） | 無 |

---

## 使用範例

```python
# 獲取預製體列表
result = execute_tool("prefab_get_list")
prefabs = result["data"]["prefabs"]

# 實例化預製體
result = execute_tool("prefab_instantiate", {
    "uuid": "db://assets/prefabs/Enemy.prefab",
    "parentUuid": "enemies-container-uuid",
    "position": {"x": 100, "y": 0}
})
enemy_uuid = result["data"]["instanceUuid"]

# 修改實例後應用
execute_tool("node_set_property", {
    "uuid": enemy_uuid,
    "path": "name",
    "value": "EnemyModified"
})
execute_tool("prefab_apply", {"uuid": enemy_uuid})

# 或還原修改
execute_tool("prefab_revert", {"uuid": enemy_uuid})
```
