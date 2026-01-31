# Preferences API 參考

Cocos Creator 偏好設置 API 完整參考。

## 目錄

- [open_preferences_settings](#open_preferences_settings) - 打開偏好設置面板
- [query_preferences_config](#query_preferences_config) - 查詢偏好設置配置
- [set_preferences_config](#set_preferences_config) - 設置偏好配置
- [get_all_preferences](#get_all_preferences) - 獲取所有可用偏好類別
- [reset_preferences](#reset_preferences) - 重置偏好設置為默認值
- [export_preferences](#export_preferences) - 導出當前偏好配置
- [import_preferences](#import_preferences) - 從文件導入偏好配置

---

## open_preferences_settings

打開編輯器偏好設置面板。

### 請求格式

```json
{
  "tab": "external-tools"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| tab | string | 否 | 要打開的標籤頁 |

### 可用標籤頁

| 標籤 | 說明 |
|------|------|
| general | 常規設置 |
| external-tools | 外部工具 |
| editor | 編輯器設置 |
| preview | 預覽設置 |
| laboratory | 實驗室功能 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "opened": true,
    "tab": "external-tools"
  },
  "error": null
}
```

---

## query_preferences_config

查詢特定的偏好設置配置值。

### 請求格式

```json
{
  "name": "general",
  "path": "language",
  "type": "global"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | 是 | 偏好設置名稱 |
| path | string | 是 | 配置路徑 |
| type | string | 否 | 類型（global, project, local） |

### 響應格式

```json
{
  "success": true,
  "data": {
    "config": {
      "name": "general",
      "path": "language",
      "value": "zh-CN",
      "type": "global"
    }
  },
  "error": null
}
```

---

## set_preferences_config

設置偏好設置的配置值。

### 請求格式

```json
{
  "name": "general",
  "path": "language",
  "value": "zh-CN",
  "type": "global"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | 是 | 偏好設置名稱 |
| path | string | 是 | 配置路徑 |
| value | any | 是 | 配置值 |
| type | string | 否 | 類型（global, project, local） |

### 響應格式

```json
{
  "success": true,
  "data": {
    "updated": true,
    "name": "general",
    "path": "language",
    "value": "zh-CN"
  },
  "error": null
}
```

---

## get_all_preferences

獲取所有可用的偏好設置類別。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "general",
        "label": "常規",
        "properties": [
          {
            "path": "language",
            "type": "string",
            "default": "en-US",
            "description": "界面語言"
          }
        ]
      },
      {
        "name": "external-tools",
        "label": "外部工具",
        "properties": []
      }
    ]
  },
  "error": null
}
```

---

## reset_preferences

重置偏好設置為默認值。

### 請求格式

```json
{
  "name": "general",
  "type": "global"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | 是 | 偏好設置名稱 |
| type | string | 否 | 類型（global, project, local） |

### 響應格式

```json
{
  "success": true,
  "data": {
    "reset": true,
    "name": "general",
    "type": "global",
    "message": "已重置 general 設置為默認值"
  },
  "error": null
}
```

---

## export_preferences

導出當前偏好配置到文件。

### 請求格式

```json
{
  "exportPath": "/path/to/preferences.json"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| exportPath | string | 是 | 導出文件路徑 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "exportPath": "/path/to/preferences.json",
    "jsonData": "{...}",
    "categoryCount": 8,
    "propertyCount": 156
  },
  "error": null
}
```

---

## import_preferences

從文件導入偏好配置。

### 請求格式

```json
{
  "importPath": "/path/to/preferences.json"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| importPath | string | 是 | 導入文件路徑 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "importPath": "/path/to/preferences.json",
    "importedCount": 156,
    "message": "成功導入 156 項配置"
  },
  "error": null
}
```

---

## 配置類型說明

### Global（全局）

跨項目共享的編輯器設置，如界面語言、主題等。

### Project（項目）

特定於當前項目的設置，如構建配置、預覽設置等。

### Local（本地）

本地計算機相關的設置，如外部工具路徑等。

## 常見配置路徑

| 類別 | 路徑 | 說明 |
|------|------|------|
| general | language | 界面語言 |
| general | theme | 界面主題 |
| editor | autoSave | 自動保存 |
| editor | autoSaveInterval | 自動保存間隔 |
| preview | previewUrl | 預覽 URL |

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
- `配置不存在`: 指定的配置路徑無效
- `權限不足`: 無法修改配置
- `文件不存在`: 導入文件未找到
- `JSON 格式錯誤`: 導入文件格式無效
