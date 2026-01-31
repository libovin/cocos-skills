# Scene View API 參考

Cocos Creator 場景視圖 API 完整參考。

## 目錄

### Gizmo 工具
- [change_gizmo_tool](#change_gizmo_tool) - 切換 Gizmo 工具
- [query_gizmo_tool_name](#query_gizmo_tool_name) - 查詢當前 Gizmo 工具

### 變換軸心點
- [change_gizmo_pivot](#change_gizmo_pivot) - 切換變換軸心點
- [query_gizmo_pivot](#query_gizmo_pivot) - 查詢當前軸心點

### 坐標系
- [change_gizmo_coordinate](#change_gizmo_coordinate) - 切換坐標系
- [query_gizmo_coordinate](#query_gizmo_coordinate) - 查詢當前坐標系

### 視圖模式
- [change_view_mode_2d_3d](#change_view_mode_2d_3d) - 切換 2D/3D 視圖模式
- [query_view_mode_2d_3d](#query_view_mode_2d_3d) - 查詢當前視圖模式

### 網格設置
- [set_grid_visible](#set_grid_visible) - 設置網格可見性
- [query_grid_visible](#query_grid_visible) - 查詢網格可見性

### Icon Gizmo
- [set_icon_gizmo_3d](#set_icon_gizmo_3d) - 設置 IconGizmo 為 3D/2D 模式
- [query_icon_gizmo_3d](#query_icon_gizmo_3d) - 查詢 IconGizmo 模式
- [set_icon_gizmo_size](#set_icon_gizmo_size) - 設置 IconGizmo 大小
- [query_icon_gizmo_size](#query_icon_gizmo_size) - 查詢 IconGizmo 大小

### 攝像機控制
- [focus_camera_on_nodes](#focus_camera_on_nodes) - 將攝像機聚焦到節點
- [align_camera_with_view](#align_camera_with_view) - 將攝像機與當前視圖對齊
- [align_view_with_node](#align_view_with_node) - 將視圖與選中節點對齊

### 場景視圖管理
- [get_scene_view_status](#get_scene_view_status) - 獲取場景視圖狀態
- [reset_scene_view](#reset_scene_view) - 重置場景視圖

---

## Gizmo 工具

### change_gizmo_tool

切換當前激活的 Gizmo 工具。

### 請求格式

```json
{
  "name": "position"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | 是 | 工具名稱 |

### 可用工具

| 工具 | 說明 |
|------|------|
| position | 位移工具 |
| rotation | 旋轉工具 |
| scale | 縮放工具 |
| rect | 矩形變換工具 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "已切換到位移工具",
    "tool": "position"
  },
  "error": null
}
```

---

### query_gizmo_tool_name

查詢當前激活的 Gizmo 工具。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "currentTool": "position"
  },
  "error": null
}
```

---

## 變換軸心點

### change_gizmo_pivot

切換變換操作的軸心點模式。

### 請求格式

```json
{
  "name": "center"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | 是 | 軸心點模式 |

### 可用模式

| 模式 | 說明 |
|------|------|
| center | 中心點變換 |
| pivot | 軸心點變換 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "已切換到中心點變換",
    "pivot": "center"
  },
  "error": null
}
```

---

### query_gizmo_pivot

查詢當前變換軸心點模式。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "pivot": "center"
  },
  "error": null
}
```

---

## 坐標系

### change_gizmo_coordinate

切換坐標系模式。

### 請求格式

```json
{
  "type": "local"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| type | string | 是 | 坐標系類型 |

### 可用類型

| 類型 | 說明 |
|------|------|
| world | 世界坐標系 |
| local | 局部坐標系 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "已切換到局部坐標系",
    "coordinate": "local"
  },
  "error": null
}
```

---

### query_gizmo_coordinate

查詢當前坐標系模式。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "coordinate": "local"
  },
  "error": null
}
```

---

## 視圖模式

### change_view_mode_2d_3d

切換 2D/3D 視圖模式。

### 請求格式

```json
{
  "is2D": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| is2D | boolean | 是 | 是否為 2D 模式 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "已切換到 2D 模式",
    "viewMode": "2d"
  },
  "error": null
}
```

---

### query_view_mode_2d_3d

查詢當前視圖模式。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "viewMode": "2d"
  },
  "error": null
}
```

---

## 網格設置

### set_grid_visible

設置場景網格的可見性。

### 請求格式

```json
{
  "visible": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| visible | boolean | 是 | 是否可見 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "網格已顯示",
    "visible": true
  },
  "error": null
}
```

---

### query_grid_visible

查詢網格可見性。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "visible": true
  },
  "error": null
}
```

---

## Icon Gizmo

### set_icon_gizmo_3d

設置 IconGizmo 為 3D 或 2D 模式。

### 請求格式

```json
{
  "is3D": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| is3D | boolean | 是 | 是否為 3D 模式 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "IconGizmo 已切換到 3D 模式",
    "mode": "3d"
  },
  "error": null
}
```

---

### query_icon_gizmo_3d

查詢 IconGizmo 模式。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "mode": "3d"
  },
  "error": null
}
```

---

### set_icon_gizmo_size

設置 IconGizmo 的顯示大小。

### 請求格式

```json
{
  "size": 24
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| size | number | 是 | 大小（像素） |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "IconGizmo 大小已設置",
    "size": 24
  },
  "error": null
}
```

---

### query_icon_gizmo_size

查詢 IconGizmo 大小。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "size": 24
  },
  "error": null
}
```

---

## 攝像機控制

### focus_camera_on_nodes

將攝像機聚焦到指定節點。

### 請求格式

```json
{
  "uuids": ["node-uuid-1", "node-uuid-2"]
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuids | array | 是 | 節點 UUID 列表 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "攝像機已聚焦",
    "focusedCount": 2
  },
  "error": null
}
```

---

### align_camera_with_view

將攝像機與當前視圖對齊。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "攝像機已與視圖對齊"
  },
  "error": null
}
```

---

### align_view_with_node

將視圖與選中節點對齊。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "視圖已與節點對齊"
  },
  "error": null
}
```

---

## 場景視圖管理

### get_scene_view_status

獲取場景視圖的完整狀態。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "gizmoTool": "position",
    "gizmoPivot": "center",
    "gizmoCoordinate": "local",
    "viewMode": "2d",
    "gridVisible": true,
    "iconGizmo3D": false,
    "iconGizmoSize": 24
  },
  "error": null
}
```

---

### reset_scene_view

重置場景視圖為默認設置。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "場景視圖已重置"
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
- `無效的工具`: 指定的 Gizmo 工具不存在
- `節點不存在`: 指定的 UUID 無效
- `視圖操作失敗`: 攝像機或視圖操作失敗
