# Asset API 參考

Cocos Creator 資源管理 API 完整參考。

## 目錄

- [save_asset_meta](#save_asset_meta) - 保存資源元數據
- [generate_available_url](#generate_available_url) - 生成可用資源 URL
- [query_asset_db_ready](#query_asset_db_ready) - 查詢資源數據庫就緒狀態
- [open_asset_external](#open_asset_external) - 使用外部程序打開資源
- [batch_import_assets](#batch_import_assets) - 批量導入資源
- [batch_delete_assets](#batch_delete_assets) - 批量刪除資源
- [validate_asset_references](#validate_asset_references) - 驗證資源引用
- [get_asset_dependencies](#get_asset_dependencies) - 獲取資源依賴關係
- [get_unused_assets](#get_unused_assets) - 查找未使用的資源
- [compress_textures](#compress_textures) - 批量壓縮紋理資源
- [export_asset_manifest](#export_asset_manifest) - 導出資源清單

---

## save_asset_meta

保存資源的元數據到資源數據庫。

### 請求格式

```json
{
  "url": "db://assets/textures/sprite.png"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| url | string | 是 | 資源路徑（db:// 格式） |

### 響應格式

```json
{
  "success": true,
  "data": {
    "url": "db://assets/textures/sprite.png",
    "saved": true
  },
  "error": null
}
```

### 錯誤處理

- `資源不存在`: 指定的資源路徑無效
- `保存失敗`: 元數據保存失敗

---

## generate_available_url

為新資源生成可用的資源 URL。

### 請求格式

```json
{
  "url": "db://assets/newTexture.png"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| url | string | 是 | 建議的資源路徑 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "availableUrl": "db://assets/newTexture.png",
    "available": true
  },
  "error": null
}
```

### 說明

如果建議的 URL 已被占用，系統會自動生成可用的替代 URL。

---

## query_asset_db_ready

查詢資源數據庫是否已就緒。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "ready": true,
    "assetCount": 1523
  },
  "error": null
}
```

### 說明

在執行資源操作前，應確認資源數據庫已就緒。

---

## open_asset_external

使用外部程序打開資源文件。

### 請求格式

```json
{
  "url": "db://assets/textures/sprite.png"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| url | string | 是 | 資源路徑 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "opened": true,
    "filePath": "/path/to/assets/textures/sprite.png"
  },
  "error": null
}
```

---

## batch_import_assets

批量導入資源文件到項目。

### 請求格式

```json
{
  "sourceDirectory": "/path/to/source",
  "targetDirectory": "db://assets/textures",
  "fileFilter": [".png", ".jpg"],
  "recursive": true,
  "overwrite": false
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| sourceDirectory | string | 是 | 源目錄路徑 |
| targetDirectory | string | 是 | 目標資源目錄（db:// 格式） |
| fileFilter | array | 否 | 文件擴展名過濾器 |
| recursive | boolean | 否 | 是否遞歸處理子目錄 |
| overwrite | boolean | 否 | 是否覆蓋已存在文件 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "successCount": 25,
    "failedCount": 2,
    "skippedCount": 3,
    "importedUrls": [
      "db://assets/textures/image1.png",
      "db://assets/textures/image2.png"
    ],
    "errors": []
  },
  "error": null
}
```

---

## batch_delete_assets

批量刪除資源文件。

### 請求格式

```json
{
  "urls": [
    "db://assets/textures/old1.png",
    "db://assets/textures/old2.png"
  ]
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| urls | array | 是 | 要刪除的資源 URL 列表 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "successCount": 2,
    "failedCount": 0,
    "deletedUrls": [
      "db://assets/textures/old1.png",
      "db://assets/textures/old2.png"
    ],
    "errors": []
  },
  "error": null
}
```

### 注意事項

刪除資源會同時刪除其元數據文件。請謹慎操作，建議先驗證引用關係。

---

## validate_asset_references

驗證資源引用關係的完整性。

### 請求格式

```json
{
  "directory": "db://assets"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| directory | string | 否 | 要驗證的目錄，默認整個資源庫 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "totalAssets": 1523,
    "validAssets": 1501,
    "brokenReferences": 22,
    "brokenAssets": [
      {
        "url": "db://assets/textures/missing.png",
        "referencedBy": ["db://assets/scenes/Game.scene"]
      }
    ]
  },
  "error": null
}
```

---

## get_asset_dependencies

獲取資源的依賴關係。

### 請求格式

```json
{
  "url": "db://assets/prefabs/Player.prefab",
  "recursive": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| url | string | 是 | 資源路徑 |
| recursive | boolean | 否 | 是否遞歸獲取所有依賴 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "asset": "db://assets/prefabs/Player.prefab",
    "dependencies": [
      {
        "url": "db://assets/textures/hero.png",
        "type": "asset"
      },
      {
        "url": "db://assets/scripts/PlayerController.ts",
        "type": "script"
      }
    ],
    "dependents": [
      "db://assets/scenes/Game.scene"
    ]
  },
  "error": null
}
```

---

## get_unused_assets

查找項目中未使用的資源。

### 請求格式

```json
{
  "directory": "db://assets",
  "includeMeta": false
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| directory | string | 否 | 搜索目錄 |
| includeMeta | boolean | 否 | 是否包含元數據文件 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "unusedCount": 45,
    "unusedAssets": [
      {
        "url": "db://assets/textures/unused.png",
        "size": 245678,
        "type": "texture"
      }
    ],
    "totalSize": 5678901
  },
  "error": null
}
```

---

## compress_textures

批量壓縮紋理資源以優化存儲空間。

### 請求格式

```json
{
  "directory": "db://assets/textures",
  "format": "webp",
  "quality": 0.8
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| directory | string | 是 | 目標目錄 |
| format | string | 是 | 壓縮格式（webp, astc, etc.） |
| quality | number | 否 | 壓縮質量（0-1） |

### 響應格式

```json
{
  "success": true,
  "data": {
    "processedCount": 120,
    "originalSize": 56789012,
    "compressedSize": 23456789,
    "savedSpace": 33332223,
    "savingsRatio": 0.59
  },
  "error": null
}
```

---

## export_asset_manifest

導出資源清單文件。

### 請求格式

```json
{
  "directory": "db://assets",
  "format": "json",
  "includeMetadata": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| directory | string | 否 | 導出的目錄範圍 |
| format | string | 否 | 輸出格式（json, csv） |
| includeMetadata | boolean | 否 | 是否包含元數據 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "exportPath": "/path/to/export/manifest.json",
    "assetCount": 1523,
    "format": "json",
    "exportTime": "2024-01-15T10:30:00Z"
  },
  "error": null
}
```

---

## 錯誤碼

所有 API 統一錯誤格式：

```json
{
  "success": false,
  "data": null,
  "error": "錯誤描述"
}
```

常見錯誤：
- `資源不存在`: 指定的資源路徑無效
- `權限不足`: 無法訪問指定目錄
- `數據庫未就緒`: 資源數據庫尚未初始化
