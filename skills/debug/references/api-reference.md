# Debug API 參考

Cocos Creator 調試 API 完整參考。

## 目錄

- [get_console_logs](#get_console_logs) - 獲取編輯器控制台日誌
- [clear_console](#clear_console) - 清除控制台
- [execute_script](#execute_script) - 在場景上下文中執行 JavaScript
- [get_node_tree](#get_node_tree) - 獲取節點樹用於調試
- [get_performance_stats](#get_performance_stats) - 獲取性能統計信息
- [validate_scene](#validate_scene) - 驗證當前場景問題
- [get_editor_info](#get_editor_info) - 獲取編輯器和環境信息
- [get_project_logs](#get_project_logs) - 獲取項目日誌
- [get_log_file_info](#get_log_file_info) - 獲取項目日誌文件信息
- [search_project_logs](#search_project_logs) - 在項目日誌中搜索特定模式

---

## get_console_logs

獲取編輯器控制台的日誌記錄。

### 請求格式

```json
{
  "limit": 100,
  "filter": "error"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| limit | number | 否 | 返回的最大日誌數量 |
| filter | string | 否 | 過濾條件（all, info, warn, error） |

### 響應格式

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "level": "error",
        "message": "TypeError: Cannot read property 'x' of undefined",
        "timestamp": "2024-01-15T10:30:00Z",
        "source": "PlayerController.ts:45"
      }
    ],
    "count": 15
  },
  "error": null
}
```

---

## clear_console

清除編輯器控制台的所有日誌。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "cleared": true,
    "message": "控制台已清除"
  },
  "error": null
}
```

---

## execute_script

在場景上下文中執行 JavaScript 代碼。

### 請求格式

```json
{
  "script": "console.log('Hello from script!'); cc.find('Canvas').getComponent(cc.Label).string = 'Updated';"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| script | string | 是 | 要執行的 JavaScript 代碼 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "result": "Hello from script!",
    "executionTime": 15
  },
  "error": null
}
```

### 注意事項

- 腳本在編輯器進程中執行
- 可以訪問 Cocos Creator API
- 避免執行阻塞性操作

---

## get_node_tree

獲取場景的節點樹結構用於調試。

### 請求格式

```json
{
  "rootUuid": "xxx-xxx-xxx",
  "maxDepth": 3
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| rootUuid | string | 否 | 根節點 UUID，默認場景根節點 |
| maxDepth | number | 否 | 最大遞歸深度 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "tree": {
      "uuid": "root-uuid",
      "name": "Canvas",
      "children": [
        {
          "uuid": "child-1",
          "name": "Player",
          "children": []
        }
      ]
    },
    "nodeCount": 45,
    "maxDepth": 3
  },
  "error": null
}
```

---

## get_performance_stats

獲取場景的性能統計信息。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "nodeCount": 1523,
    "componentCount": 3456,
    "drawCalls": 45,
    "triangles": 125000,
    "frameTime": 16.7,
    "fps": 60,
    "textureMemory": 256000000,
    "meshMemory": 128000000
  },
  "error": null
}
```

### 性能指標說明

| 指標 | 說明 |
|------|------|
| nodeCount | 場景中的節點總數 |
| componentCount | 組件總數 |
| drawCalls | 繪製調用次數 |
| triangles | 三角形數量 |
| frameTime | 每幀時間（毫秒） |
| fps | 幀率 |
| textureMemory | 紋理內存佔用（字節） |
| meshMemory | 網格內存佔用（字節） |

---

## validate_scene

驗證當前場景是否存在問題。

### 請求格式

```json
{
  "checkMissingAssets": true,
  "checkPerformance": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| checkMissingAssets | boolean | 否 | 檢查缺失資源 |
| checkPerformance | boolean | 否 | 檢查性能問題 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "valid": false,
    "issueCount": 3,
    "issues": [
      {
        "type": "missing-asset",
        "severity": "error",
        "message": "缺失紋理資源",
        "node": "Player/Sprite"
      },
      {
        "type": "performance",
        "severity": "warning",
        "message": "Draw Calls 過多",
        "value": 45,
        "threshold": 30
      }
    ]
  },
  "error": null
}
```

---

## get_editor_info

獲取編輯器和環境信息。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "editor": {
      "version": "3.8.0",
      "path": "/path/to/CocosCreator"
    },
    "project": {
      "name": "MyGame",
      "path": "/path/to/project",
      "uuid": "project-uuid"
    },
    "system": {
      "platform": "windows",
      "osVersion": "10.0.19045",
      "architecture": "x64"
    }
  },
  "error": null
}
```

---

## get_project_logs

獲取項目日誌文件內容。

### 請求格式

```json
{
  "lines": 100,
  "filterKeyword": "error",
  "logLevel": "ERROR"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| lines | number | 否 | 返回的最大行數 |
| filterKeyword | string | 否 | 關鍵字過濾 |
| logLevel | string | 否 | 日誌級別（DEBUG, INFO, WARN, ERROR） |

### 響應格式

```json
{
  "success": true,
  "data": {
    "logs": [
      "[2024-01-15 10:30:00] [ERROR] Failed to load asset: missing.png"
    ],
    "lineCount": 15,
    "logFile": "/path/to/editor.log"
  },
  "error": null
}
```

---

## get_log_file_info

獲取項目日誌文件的元信息。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "logFile": "/path/to/editor.log",
    "size": 567890,
    "lineCount": 15234,
    "lastModified": "2024-01-15T10:30:00Z"
  },
  "error": null
}
```

---

## search_project_logs

在項目日誌中搜索特定模式。

### 請求格式

```json
{
  "pattern": "TypeError",
  "maxResults": 10,
  "contextLines": 3
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| pattern | string | 是 | 搜索模式（支持正則表達式） |
| maxResults | number | 否 | 最大結果數 |
| contextLines | number | 否 | 上下文行數 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "matchCount": 5,
    "results": [
      {
        "lineNumber": 234,
        "match": "TypeError: Cannot read property",
        "context": [
          "[2024-01-15 10:29:57] [INFO] Entering function",
          "[2024-01-15 10:29:58] [ERROR] TypeError: Cannot read property",
          "[2024-01-15 10:29:59] [INFO] Stack trace follows"
        ]
      }
    ]
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
- `腳本執行失敗`: JavaScript 代碼有語法錯誤或運行時錯誤
- `節點不存在`: 指定的 UUID 無效
- `日誌文件不存在`: 項目日誌文件未找到
