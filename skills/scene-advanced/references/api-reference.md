# Scene Advanced API 參考

Cocos Creator 高級場景 API 完整參考。

## 目錄

### 屬性重置
- [reset_node_property](#reset_node_property) - 重置節點屬性為默認值
- [reset_node_transform](#reset_node_transform) - 重置節點變換
- [reset_component](#reset_component) - 重置組件為默認值

### 數組操作
- [move_array_element](#move_array_element) - 移動數組元素位置
- [remove_array_element](#remove_array_element) - 移除指定索引的數組元素

### 剪貼板操作
- [copy_node](#copy_node) - 複製節點以供粘貼操作
- [paste_node](#paste_node) - 粘貼之前複製的節點
- [cut_node](#cut_node) - 剪切節點

### 組件執行
- [execute_component_method](#execute_component_method) - 執行組件上的方法
- [execute_scene_script](#execute_scene_script) - 執行場景腳本方法

### 場景快照
- [scene_snapshot](#scene_snapshot) - 創建場景狀態快照
- [scene_snapshot_abort](#scene_snapshot_abort) - 中止場景快照創建

### Undo 操作
- [begin_undo_recording](#begin_undo_recording) - 開始錄製 Undo 數據
- [end_undo_recording](#end_undo_recording) - 結束錄製 Undo 數據
- [cancel_undo_recording](#cancel_undo_recording) - 取消 Undo 錄製

### 場景查詢
- [soft_reload_scene](#soft_reload_scene) - 軟加載當前場景
- [query_scene_ready](#query_scene_ready) - 查詢場景是否就緒
- [query_scene_dirty](#query_scene_dirty) - 查詢場景是否有未保存的更改
- [query_scene_classes](#query_scene_classes) - 查詢所有已註冊的類
- [query_scene_components](#query_scene_components) - 查詢可用的場景組件
- [query_component_has_script](#query_component_has_script) - 檢查組件是否有腳本
- [query_nodes_by_asset_uuid](#query_nodes_by_asset_uuid) - 查找使用特定資源 UUID 的節點
- [restore_prefab](#restore_prefab) - 從資源恢復預製體實例

---

## 屬性重置

### reset_node_property

重置節點的特定屬性為默認值。

### 請求格式

```json
{
  "uuid": "node-uuid",
  "path": "position"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| path | string | 是 | 屬性路徑 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "屬性已重置為默認值",
    "uuid": "node-uuid",
    "path": "position",
    "previousValue": {"x": 100, "y": 200, "z": 0}
  },
  "error": null
}
```

---

### reset_node_transform

重置節點的位置、旋轉和縮放。

### 請求格式

```json
{
  "uuid": "node-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "節點變換已重置",
    "uuid": "node-uuid",
    "resetProperties": ["position", "rotation", "scale"]
  },
  "error": null
}
```

---

### reset_component

重置組件為默認值。

### 請求格式

```json
{
  "uuid": "component-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 組件 UUID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "組件已重置為默認值",
    "uuid": "component-uuid"
  },
  "error": null
}
```

---

## 數組操作

### move_array_element

移動數組元素位置。

### 請求格式

```json
{
  "uuid": "node-uuid",
  "path": "__comps__",
  "target": 0,
  "offset": 1
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| path | string | 是 | 數組路徑 |
| target | number | 是 | 目標索引 |
| offset | number | 是 | 偏移量 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "數組元素已移動",
    "fromIndex": 0,
    "toIndex": 1
  },
  "error": null
}
```

---

### remove_array_element

移除指定索引的數組元素。

### 請求格式

```json
{
  "uuid": "node-uuid",
  "path": "__comps__",
  "index": 2
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| path | string | 是 | 數組路徑 |
| index | number | 是 | 要移除的索引 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "數組元素已移除",
    "removedIndex": 2,
    "removedValue": {...}
  },
  "error": null
}
```

---

## 剪貼板操作

### copy_node

複製節點以供粘貼操作。

### 請求格式

```json
{
  "uuids": ["node-uuid-1", "node-uuid-2"]
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuids | array | 是 | 要複製的節點 UUID 列表 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "copiedUuids": ["node-uuid-1", "node-uuid-2"],
    "count": 2
  },
  "error": null
}
```

---

### paste_node

粘貼之前複製的節點。

### 請求格式

```json
{
  "target": "parent-node-uuid",
  "uuids": ["copied-uuid-1"],
  "keepWorldTransform": false
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| target | string | 是 | 目標父節點 UUID |
| uuids | array | 是 | 要粘貼的 UUID 列表 |
| keepWorldTransform | boolean | 否 | 是否保持世界坐標變換 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "newUuids": ["new-uuid-1"],
    "count": 1
  },
  "error": null
}
```

---

### cut_node

剪切節點。

### 請求格式

```json
{
  "uuids": ["node-uuid"]
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuids | array | 是 | 要剪切的節點 UUID 列表 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "cutUuids": ["node-uuid"],
    "count": 1
  },
  "error": null
}
```

---

## 組件執行

### execute_component_method

執行組件上的方法。

### 請求格式

```json
{
  "uuid": "component-uuid",
  "name": "play",
  "args": ["animation-name"]
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 組件 UUID |
| name | string | 是 | 方法名稱 |
| args | array | 否 | 方法參數 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "result": "方法執行成功",
    "returnValue": null
  },
  "error": null
}
```

---

### execute_scene_script

執行場景腳本方法。

### 請求格式

```json
{
  "name": "my-plugin",
  "method": "myMethod",
  "args": ["arg1", "arg2"]
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | 是 | 腳本名稱 |
| method | string | 是 | 方法名稱 |
| args | array | 否 | 方法參數 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "result": "腳本執行成功",
    "returnValue": {...}
  },
  "error": null
}
```

---

## 場景快照

### scene_snapshot

創建場景狀態快照。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "snapshotId": "snapshot-uuid",
    "message": "場景快照已創建"
  },
  "error": null
}
```

---

### scene_snapshot_abort

中止場景快照創建。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "場景快照已中止"
  },
  "error": null
}
```

---

## Undo 操作

### begin_undo_recording

開始錄製 Undo 數據。

### 請求格式

```json
{
  "nodeUuid": "node-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| nodeUuid | string | 否 | 關聯的節點 UUID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "undoId": "undo-uuid",
    "message": "開始 Undo 錄製"
  },
  "error": null
}
```

---

### end_undo_recording

結束 Undo 錄製。

### 請求格式

```json
{
  "undoId": "undo-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| undoId | string | 是 | Undo ID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "Undo 錄製已完成"
  },
  "error": null
}
```

---

### cancel_undo_recording

取消 Undo 錄製。

### 請求格式

```json
{
  "undoId": "undo-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| undoId | string | 是 | Undo ID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "Undo 錄製已取消"
  },
  "error": null
}
```

---

## 場景查詢

### soft_reload_scene

軟加載當前場景。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "場景已重新加載"
  },
  "error": null
}
```

---

### query_scene_ready

查詢場景是否就緒。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "ready": true
  },
  "error": null
}
```

---

### query_scene_dirty

查詢場景是否有未保存的更改。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "dirty": true
  },
  "error": null
}
```

---

### query_scene_classes

查詢所有已註冊的類。

### 請求格式

```json
{
  "extends": "cc.Component"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| extends | string | 否 | 基類過濾 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "name": "Sprite",
        "extends": "cc.Component"
      },
      {
        "name": "Label",
        "extends": "cc.Component"
      }
    ],
    "count": 156
  },
  "error": null
}
```

---

### query_scene_components

查詢可用的場景組件。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "components": [
      {
        "name": "cc.Sprite",
        "type": "render"
      },
      {
        "name": "cc.Label",
        "type": "render"
      }
    ],
    "count": 89
  },
  "error": null
}
```

---

### query_component_has_script

檢查組件是否有腳本。

### 請求格式

```json
{
  "className": "PlayerController"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| className | string | 是 | 類名稱 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "hasScript": true,
    "className": "PlayerController"
  },
  "error": null
}
```

---

### query_nodes_by_asset_uuid

查找使用特定資源 UUID 的節點。

### 請求格式

```json
{
  "assetUuid": "texture-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| assetUuid | string | 是 | 資源 UUID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "uuid": "node-uuid-1",
        "name": "Player/Sprite",
        "componentType": "cc.Sprite"
      }
    ],
    "count": 5
  },
  "error": null
}
```

---

### restore_prefab

從資源恢復預製體實例。

### 請求格式

```json
{
  "nodeUuid": "prefab-instance-uuid",
  "assetUuid": "prefab-asset-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| nodeUuid | string | 是 | 預製體實例節點 UUID |
| assetUuid | string | 是 | 預製體資源 UUID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "預製體已恢復",
    "nodeUuid": "prefab-instance-uuid"
  },
  "error": null
}
```

---

## 錯誤處理

統一錯誤格式：

```json
{
  "success": false,
  "data": null,
  "error": "錯誤描述"
}
```

常見錯誤：
- `節點不存在`: 指定的 UUID 無效
- `組件不存在`: 指定的組件 UUID 無效
- `方法不存在`: 指定的方法不存在
- `剪貼板為空`: 沒有可粘貼的內容
