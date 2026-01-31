# Scene API 參考

Cocos Creator 場景操作的完整 API 參考。

## API 列表

| API | 功能 | HTTP 方法 |
|-----|------|----------|
| scene_get_current | 獲取當前場景 | GET/POST |
| scene_get_list | 獲取場景列表 | GET/POST |
| scene_open | 打開場景 | POST |
| scene_save | 保存場景 | POST |
| scene_save_as | 另存為場景 | POST |
| scene_create | 創建場景 | POST |
| scene_close | 關閉場景 | POST |
| scene_get_hierarchy | 獲取層級結構 | POST |

---

## scene_get_current

獲取 Cocos Creator 編輯器中當前開啟的場景資訊。

### 請求

```python
execute_tool("scene_get_current")
```

### 響應

```json
{
  "success": true,
  "data": {
    "name": "Main",
    "path": "db://assets/scenes/Main.scene",
    "uuid": "c1f6f7d8-9e0a-4b2c-8d3f-0a1b2c3d4e5f",
    "modified": false
  }
}
```

### 響應欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| name | string | 場景名稱 |
| path | string | 場景檔案路徑 |
| uuid | string | 場景唯一識別碼 |
| modified | boolean | 是否有未保存的修改 |

### 注意事項

- 若沒有開啟任何場景，`data` 可能為 `null`

---

## scene_get_list

獲取項目中所有場景的列表。

### 請求

```python
execute_tool("scene_get_list")
```

### 響應

```json
{
  "success": true,
  "data": {
    "scenes": [
      {
        "name": "Main",
        "path": "db://assets/scenes/Main.scene",
        "uuid": "xxx-xxx-xxx"
      },
      {
        "name": "Level1",
        "path": "db://assets/scenes/Level1.scene",
        "uuid": "yyy-yyy-yyy"
      }
    ]
  }
}
```

---

## scene_open

在 Cocos Creator 編輯器中打開指定的場景。

### 請求

```python
execute_tool("scene_open", {
    "uuid": "db://assets/scenes/Main.scene"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 場景路徑或 UUID |

### 響應

```json
{
  "success": true,
  "data": {
    "name": "Main",
    "uuid": "xxx-xxx-xxx"
  }
}
```

### 錯誤情況

- 場景路徑無效: 返回錯誤訊息
- 場景不存在: 返回錯誤訊息
- 編輯器忙碌中: 返回錯誤訊息

### 注意事項

- 開啟新場景會關閉當前場景
- 開啟前請儲存當前場景以免丢失修改

---

## scene_save

保存當前開啟的場景。

### 請求

```python
execute_tool("scene_save")
```

### 響應

```json
{
  "success": true,
  "data": {
    "saved": true
  }
}
```

---

## scene_save_as

將當前場景另存為新文件。

### 請求

```python
execute_tool("scene_save_as", {
    "uuid": "db://assets/scenes/Copy.scene"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 新場景的路徑 |

---

## scene_create

創建一個新的空白場景。

### 請求

```python
execute_tool("scene_create", {
    "uuid": "db://assets/scenes/NewScene.scene",
    "name": "NewScene"
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 場景路徑 (必須以 .scene 結尾) |
| name | string | 否 | 場景名稱 |

---

## scene_close

關閉當前開啟的場景。

### 請求

```python
execute_tool("scene_close")
```

### 注意事項

- 未保存的修改會在關閉時丟失

---

## scene_get_hierarchy

獲取場景的節點層級結構。

### 請求

```python
execute_tool("scene_get_hierarchy", {
    "dump": true
})
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| dump | boolean | 否 | 是否以可讀格式輸出 |

### 響應

```json
{
  "success": true,
  "data": {
    "root": {
      "name": "Scene",
      "children": [
        {
          "name": "Canvas",
          "children": [...]
        }
      ]
    }
  }
}
```

---

## 場景路徑格式

場景路徑使用 Cocos Creator 資源資料庫路徑：

| 類型 | 格式 | 示例 |
|------|------|------|
| 相對路徑 | db://assets/... | db://assets/scenes/Main.scene |

---

## 使用範例

```python
# 獲取當前場景並檢查是否已修改
result = execute_tool("scene_get_current")
if result["success"] and result["data"].get("modified"):
    execute_tool("scene_save")

# 打開指定場景
execute_tool("scene_open", {"uuid": "db://assets/scenes/Main.scene"})

# 獲取場景列表並選擇第一個
result = execute_tool("scene_get_list")
if result["success"] and result["data"]["scenes"]:
    first_scene = result["data"]["scenes"][0]
    execute_tool("scene_open", {"uuid": first_scene["path"]})

# 獲取層級並遍歷
result = execute_tool("scene_get_hierarchy", {"dump": True})
```
