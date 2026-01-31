# Reference Image API 參考

Cocos Creator 參考圖 API 完整參考。

## 目錄

### 屏幕位置與視口
- [get_reference_image_screen_position](#get_reference_image_screen_position) - 獲取參考圖在屏幕上的位置
- [get_reference_image_viewport](#get_reference_image_viewport) - 獲取參考圖視口
- [set_reference_image_viewport](#set_reference_image_viewport) - 設置參考圖視口

### 可見性與鎖定
- [set_reference_image_visible](#set_reference_image_visible) - 設置參考圖可見性
- [get_reference_image_visible](#get_reference_image_visible) - 查詢參考圖可見性
- [get_reference_image_locked](#get_reference_image_locked) - 查詢參考圖是否鎖定
- [set_reference_image_locked](#set_reference_image_locked) - 設置參考圖鎖定狀態

### 攝像機偏移
- [get_reference_image_camera_offset](#get_reference_image_camera_offset) - 獲取攝像機偏移
- [set_reference_image_camera_offset](#set_reference_image_camera_offset) - 設置攝像機偏移

### 節點追蹤
- [get_reference_image_nodes](#get_reference_image_nodes) - 獲取追蹤的節點
- [set_reference_image_nodes](#set_reference_image_nodes) - 設置追蹤的節點

### 位置控制
- [get_reference_image_position](#get_reference_image_position) - 獲取參考圖位置
- [set_reference_image_position](#set_reference_image_position) - 設置參考圖位置

---

## 屏幕位置與視口

### get_reference_image_screen_position

獲取參考圖在屏幕上的位置。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "position": {
      "x": 100,
      "y": 200
    }
  },
  "error": null
}
```

---

### get_reference_image_viewport

獲取參考圖的視口範圍。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "viewport": {
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080
    }
  },
  "error": null
}
```

---

### set_reference_image_viewport

設置參考圖的視口範圍。

### 請求格式

```json
{
  "x": 0,
  "y": 0,
  "width": 1920,
  "height": 1080
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| x | number | 是 | 視口 X 坐標 |
| y | number | 是 | 視口 Y 坐標 |
| width | number | 是 | 視口寬度 |
| height | number | 是 | 視口高度 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "視口已設置",
    "viewport": {
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080
    }
  },
  "error": null
}
```

---

## 可見性與鎖定

### set_reference_image_visible

設置參考圖的可見性。

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
    "message": "參考圖已顯示",
    "visible": true
  },
  "error": null
}
```

---

### get_reference_image_visible

查詢參考圖的可見性。

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

### get_reference_image_locked

查詢參考圖是否被鎖定。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "locked": false
  },
  "error": null
}
```

---

### set_reference_image_locked

設置參考圖的鎖定狀態。

### 請求格式

```json
{
  "locked": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| locked | boolean | 是 | 是否鎖定 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "參考圖已鎖定",
    "locked": true
  },
  "error": null
}
```

### 鎖定說明

鎖定後，參考圖無法被移動或編輯，防止意外操作。

---

## 攝像機偏移

### get_reference_image_camera_offset

獲取參考圖相對於攝像機的偏移量。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "offset": {
      "x": 100,
      "y": 50
    }
  },
  "error": null
}
```

---

### set_reference_image_camera_offset

設置參考圖相對於攝像機的偏移量。

### 請求格式

```json
{
  "x": 100,
  "y": 50
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| x | number | 是 | X 軸偏移量 |
| y | number | 是 | Y 軸偏移量 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "攝像機偏移已設置",
    "offset": {
      "x": 100,
      "y": 50
    }
  },
  "error": null
}
```

---

## 節點追蹤

### get_reference_image_nodes

獲取參考圖追蹤的節點列表。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "uuid": "node-uuid-1",
        "name": "Player"
      },
      {
        "uuid": "node-uuid-2",
        "name": "Enemy"
      }
    ],
    "count": 2
  },
  "error": null
}
```

---

### set_reference_image_nodes

設置參考圖追蹤的節點。

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
    "message": "追蹤節點已設置",
    "nodes": [
      {
        "uuid": "node-uuid-1",
        "name": "Player"
      },
      {
        "uuid": "node-uuid-2",
        "name": "Enemy"
      }
    ],
    "count": 2
  },
  "error": null
}
```

---

## 位置控制

### get_reference_image_position

獲取參考圖的位置。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "position": {
      "x": 100,
      "y": 200
    }
  },
  "error": null
}
```

---

### set_reference_image_position

設置參考圖的位置。

### 請求格式

```json
{
  "x": 100,
  "y": 200
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| x | number | 是 | X 坐標 |
| y | number | 是 | Y 坐標 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "參考圖位置已設置",
    "position": {
      "x": 100,
      "y": 200
    }
  },
  "error": null
}
```

---

## 使用場景

### 設置參考圖輔助繪圖

```python
# 設置視口為當前場景大小
set_reference_image_viewport(x=0, y=0, width=1920, height=1080)

# 顯示參考圖
set_reference_image_visible(visible=True)

# 設置位置
set_reference_image_position(x=100, y=200)

# 鎖定防止意外移動
set_reference_image_locked(locked=True)
```

### 追蹤節點位置

```python
# 設置追蹤的節點
set_reference_image_nodes(uuids=["player-uuid", "enemy-uuid"])

# 查詢當前追蹤狀態
nodes = get_reference_image_nodes()
```

### 調整攝像機偏移

```python
# 獲取當前偏移
offset = get_reference_image_camera_offset()

# 設置新的偏移
set_reference_image_camera_offset(x=150, y=75)
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
- `無效坐標`: 指定的坐標超出範圍
- `操作失敗`: 設置操作失敗
