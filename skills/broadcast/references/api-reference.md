# Broadcast API 參考

Cocos Creator 廣播消息監聽 API 完整參考。

## 目錄

- [get_broadcast_log](#get_broadcast_log) - 獲取廣播消息日誌
- [listen_broadcast](#listen_broadcast) - 開始監聽特定廣播消息
- [stop_listening](#stop_listening) - 停止監聽特定廣播消息
- [clear_broadcast_log](#clear_broadcast_log) - 清除廣播消息日誌
- [get_active_listeners](#get_active_listeners) - 獲取活動監聽器列表

---

## get_broadcast_log

獲取廣播消息的歷史日誌記錄。

### 請求格式

```json
{
  "limit": 50,
  "messageType": "scene:ready"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| limit | number | 否 | 返回的最大日誌數量 |
| messageType | string | 否 | 過濾特定消息類型 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "count": 23,
    "logs": [
      {
        "id": "log-1",
        "type": "scene:ready",
        "timestamp": "2024-01-15T10:30:00Z",
        "payload": {
          "scene": "db://assets/scenes/Main.scene"
        }
      }
    ]
  },
  "error": null
}
```

---

## listen_broadcast

開始監聽特定類型的廣播消息。

### 請求格式

```json
{
  "messageType": "scene:ready"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| messageType | string | 是 | 要監聽的消息類型 |

### 常見消息類型

| 類型 | 說明 |
|------|------|
| scene:ready | 場景準備完成 |
| scene:saved | 場景已保存 |
| asset:imported | 資源已導入 |
| asset:deleted | 資源已刪除 |
| node:created | 節點已創建 |
| node:deleted | 節點已刪除 |
| selection:changed | 選擇已更改 |
| component:added | 組件已添加 |
| component:removed | 組件已移除 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "開始監聽 scene:ready 消息",
    "listenerId": "listener-uuid",
    "messageType": "scene:ready"
  },
  "error": null
}
```

---

## stop_listening

停止監聽特定類型的廣播消息。

### 請求格式

```json
{
  "messageType": "scene:ready"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| messageType | string | 是 | 要停止監聽的消息類型 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "停止監聽 scene:ready 消息",
    "messageType": "scene:ready",
    "stopped": true
  },
  "error": null
}
```

---

## clear_broadcast_log

清除廣播消息的歷史日誌記錄。

### 請求格式

```json
{}
```

### 可選參數

| 參數 | 類型 | 說明 |
|------|------|------|
| messageType | string | 只清除特定類型的日誌 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "clearedCount": 150,
    "message": "已清除所有廣播日誌"
  },
  "error": null
}
```

---

## get_active_listeners

獲取當前所有活動的監聽器列表。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "count": 5,
    "listeners": [
      {
        "id": "listener-1",
        "messageType": "scene:ready",
        "startTime": "2024-01-15T10:00:00Z"
      },
      {
        "id": "listener-2",
        "messageType": "selection:changed",
        "startTime": "2024-01-15T10:05:00Z"
      }
    ]
  },
  "error": null
}
```

---

## 消息格式

所有廣播消息遵循統一格式：

```json
{
  "type": "message:type",
  "timestamp": "2024-01-15T10:30:00Z",
  "payload": {
    // 消息特定數據
  }
}
```

## 使用場景

### 監聽場景變更

```python
listen_broadcast("scene:ready")
listen_broadcast("scene:saved")
```

### 監聽資源操作

```python
listen_broadcast("asset:imported")
listen_broadcast("asset:deleted")
```

### 監聽選擇變化

```python
listen_broadcast("selection:changed")
```

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
- `監聽器已存在`: 該消息類型已被監聽
- `監聽器不存在`: 該消息類型未被監聽
- `無效消息類型`: 指定的消息類型不存在
