# Component API 參考

Cocos Creator 組件操作的完整 API 參考。

## API 列表

| API | 功能 | HTTP 方法 |
|-----|------|----------|
| component_add | 添加組件 | POST |
| component_remove | 移除組件 | POST |
| component_get_components | 獲取組件列表 | POST |
| component_get_component_info | 獲取組件信息 | POST |
| set_component_property | 設置組件屬性 | POST |
| component_attach_script | 附加腳本組件 | POST |
| component_get_available_types | 獲取可用組件類型 | GET/POST |
| component_get_available_components | 獲取可用組件列表 | GET/POST |

---

## component_add

添加組件到節點。

### 請求

```python
# 添加內建組件
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Sprite"
})

# 添加多個組件
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Sprite",
    "componentType": "cc.RigidBody"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| componentType | string | 否* | 組件類型 (如 cc.Sprite) |
| scriptName | string | 否* | 腳本名稱 |

*至少提供一個

### 常見內建組件類型

| 類型 | 說明 |
|------|------|
| cc.Sprite | 精靈渲染器 |
| cc.Label | 文字標籤 |
| cc.Button | 按鈕 |
| cc.Widget | UI 部件 |
| cc.RigidBody | 剛體 |
| cc.BoxCollider | 盒碰撞體 |
| cc.CircleCollider | 圓碰撞體 |
| cc.ParticleSystem | 粒子系統 |
| cc.Animation | 動畫 |
| cc.AudioSource | 音頻源 |

---

## component_remove

從節點移除組件。

### 請求

```python
execute_tool("component_remove", {
    "uuid": "node-uuid",
    "componentUuid": "component-uuid"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| componentUuid | string | 是 | 組件 UUID |

### 注意事項

- Transform 組件不能移除
- 移除組件會丟失所有相關數據

---

## component_get_components

獲取節點上的所有組件列表。

### 請求

```python
execute_tool("component_get_components", {
    "uuid": "node-uuid"
})
```

### 響應

```json
{
  "success": true,
  "data": {
    "components": [
      {
        "uuid": "comp-xxx-xxx",
        "type": "cc.Sprite",
        "enabled": true
      },
      {
        "uuid": "comp-yyy-yyy",
        "type": "cc.RigidBody",
        "enabled": true
      }
    ]
  }
}
```

---

## component_get_component_info

獲取特定組件的詳細信息。

### 請求

```python
execute_tool("component_get_component_info", {
    "uuid": "node-uuid",
    "componentUuid": "component-uuid"
})
```

---

## set_component_property

設置組件屬性值。

### 請求

```python
# 設置單個屬性
execute_tool("set_component_property", {
    "uuid": "node-uuid",
    "componentUuid": "component-uuid",
    "property": "enabled",
    "value": True
})

# 批量設置屬性
execute_tool("set_component_property", {
    "uuid": "node-uuid",
    "componentUuid": "component-uuid",
    "properties": {
        "color": {"r": 255, "g": 0, "b": 0, "a": 255},
        "fontSize": 32
    }
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| componentUuid | string | 是 | 組件 UUID |
| property | string | 否* | 屬性名稱 |
| value | any | 否* | 屬性值 |
| properties | object | 否* | 多個屬性 |

*使用 property/value 或 properties

### 屬性類型

| 類型 | 說明 | 示例 |
|------|------|------|
| string | 字串 | "Hello World" |
| number | 數字 | 42, 3.14 |
| boolean | 布林值 | true, false |
| color | 顏色 | {"r":255,"g":0,"b":0,"a":255} |
| vec2 | 二維向量 | {"x":100,"y":50} |
| vec3 | 三維向量 | {"x":1,"y":2,"z":3} |
| node | 節點引用 | "node-uuid" |
| asset | 資源引用 | "asset-uuid" |

---

## component_attach_script

附加自定義腳本組件到節點。

### 請求

```python
execute_tool("component_attach_script", {
    "uuid": "node-uuid",
    "scriptPath": "db://assets/scripts/PlayerController.ts"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 節點 UUID |
| scriptPath | string | 是 | 腳本文件路徑 |

---

## component_get_available_types

獲取所有可用的內建組件類型。

### 請求

```python
execute_tool("component_get_available_types")
```

### 響應

```json
{
  "success": true,
  "data": {
    "types": [
      "cc.Sprite",
      "cc.Label",
      "cc.Button",
      "cc.RigidBody",
      ...
    ]
  }
}
```

---

## component_get_available_components

按類別獲取可用組件列表。

### 請求

```python
execute_tool("component_get_available_components", {
    "category": "render"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 | 預設值 |
|------|------|------|------|--------|
| category | string | 否 | 組件類別 | all |

### 組件類別

| 類別 | 說明 | 包含組件 |
|------|------|----------|
| render | 渲染 | Sprite, Label, Mask |
| ui | UI | Button, Toggle, Slider, ScrollView |
| physics | 物理 | RigidBody, Collider, Joint |
| animation | 動畫 | Animation, Skeleton |
| audio | 音頻 | AudioSource |
| particle | 粒子 | ParticleSystem |

---

## 使用範例

```python
# 創建節點並添加組件
result = execute_tool("node_create", {"name": "Player"})
player_uuid = result["data"]["uuid"]

# 添加精靈組件
execute_tool("component_add", {
    "uuid": player_uuid,
    "componentType": "cc.Sprite"
})

# 添加物理組件
execute_tool("component_add", {
    "uuid": player_uuid,
    "componentType": "cc.RigidBody"
})

# 附加自定義腳本
execute_tool("component_attach_script", {
    "uuid": player_uuid,
    "scriptPath": "db://assets/scripts/PlayerController.ts"
})

# 設置精靈屬性
result = execute_tool("component_get_components", {"uuid": player_uuid})
sprite_comp = [c for c in result["data"]["components"] if c["type"] == "cc.Sprite"][0]
execute_tool("set_component_property", {
    "uuid": player_uuid,
    "componentUuid": sprite_comp["uuid"],
    "properties": {
        "color": {"r": 255, "g": 255, "b": 255, "a": 255}
    }
})
```
