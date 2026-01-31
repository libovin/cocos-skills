# Project API 參考

Cocos Creator 項目管理 API 完整參考。

## 目錄

### 項目運行與構建
- [run_project](#run_project) - 運行項目預覽
- [build_project](#build_project) - 構建項目
- [get_build_settings](#get_build_settings) - 獲取構建設置
- [open_build_panel](#open_build_panel) - 打開構建面板
- [check_builder_status](#check_builder_status) - 檢查構建器狀態
- [start_preview_server](#start_preview_server) - 啟動預覽服務器
- [stop_preview_server](#stop_preview_server) - 停止預覽服務器

### 項目信息
- [get_project_info](#get_project_info) - 獲取項目信息
- [get_project_settings](#get_project_settings) - 獲取項目設置

### 資源數據庫
- [refresh_assets](#refresh_assets) - 刷新資源數據庫
- [import_asset](#import_asset) - 導入資源文件
- [get_asset_info](#get_asset_info) - 獲取資源信息
- [get_assets](#get_assets) - 獲取資源列表

### 資源操作
- [create_asset](#create_asset) - 創建新資源
- [copy_asset](#copy_asset) - 複製資源
- [move_asset](#move_asset) - 移動資源
- [delete_asset](#delete_asset) - 刪除資源
- [save_asset](#save_asset) - 保存資源
- [reimport_asset](#reimport_asset) - 重新導入資源

### 資源查詢
- [query_asset_path](#query_asset_path) - 查詢資源路徑
- [query_asset_uuid](#query_asset_uuid) - 查詢資源 UUID
- [query_asset_url](#query_asset_url) - 查詢資源 URL
- [find_asset_by_name](#find_asset_by_name) - 按名稱查找資源
- [get_asset_details](#get_asset_details) - 獲取資源詳細信息

---

## 項目運行與構建

### run_project

運行項目預覽。

### 請求格式

```json
{
  "platform": "web-desktop",
  "debug": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| platform | string | 否 | 運行平台 |
| debug | boolean | 否 | 是否調試模式 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "url": "http://localhost:7456",
    "platform": "web-desktop",
    "debug": true
  },
  "error": null
}
```

---

### build_project

構建項目到指定平台。

### 請求格式

```json
{
  "platform": "web-mobile",
  "debug": true,
  "outputDir": "/path/to/output"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| platform | string | 是 | 構建平台 |
| debug | boolean | 否 | 是否調試版本 |
| outputDir | string | 否 | 輸出目錄 |

### 支持平台

- web-mobile
- web-desktop
- android
- ios
- windows
- mac

### 響應格式

```json
{
  "success": true,
  "data": {
    "message": "構建完成",
    "platform": "web-mobile",
    "outputPath": "/path/to/output"
  },
  "error": null
}
```

---

### get_build_settings

獲取構建設置。

### 請求格式

```json
{
  "platform": "web-mobile"
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "platform": "web-mobile",
    "settings": {
      "orientation": {
        "landscapeLeft": true,
        "landscapeRight": true
      },
      "webp": true
    }
  },
  "error": null
}
```

---

### open_build_panel

打開構建面板。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "opened": true
  },
  "error": null
}
```

---

### check_builder_status

檢查構建器狀態。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "isBuilding": false,
    "currentPlatform": null,
    "progress": 0
  },
  "error": null
}
```

---

### start_preview_server

啟動預覽服務器。

### 請求格式

```json
{
  "port": 7456
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "url": "http://localhost:7456",
    "port": 7456
  },
  "error": null
}
```

---

### stop_preview_server

停止預覽服務器。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "stopped": true
  },
  "error": null
}
```

---

## 項目信息

### get_project_info

獲取項目基本信息。

### 請求格式

```json
{}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "name": "MyGame",
    "path": "/path/to/project",
    "uuid": "project-uuid",
    "cocosVersion": "3.8.0",
    "type": "3d"
  },
  "error": null
}
```

---

### get_project_settings

獲取項目設置。

### 請求格式

```json
{
  "category": "general"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| category | string | 否 | 設置類別 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "category": "general",
    "settings": {
      "stepsPerFrame": 5,
      "fixedFPS": 60
    }
  },
  "error": null
}
```

---

## 資源數據庫

### refresh_assets

刷新資源數據庫。

### 請求格式

```json
{
  "folder": "db://assets/textures"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| folder | string | 否 | 要刷新的文件夾 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "refreshed": true,
    "assetCount": 234
  },
  "error": null
}
```

---

### import_asset

導入資源文件。

### 請求格式

```json
{
  "sourcePath": "/path/to/image.png",
  "targetFolder": "db://assets/textures"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| sourcePath | string | 是 | 源文件路徑 |
| targetFolder | string | 是 | 目標文件夾 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "uuid": "asset-uuid",
    "url": "db://assets/textures/image.png"
  },
  "error": null
}
```

---

### get_asset_info

獲取資源信息。

### 請求格式

```json
{
  "assetPath": "db://assets/textures/hero.png"
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "uuid": "asset-uuid",
    "url": "db://assets/textures/hero.png",
    "type": "texture",
    "path": "/path/to/assets/textures/hero.png"
  },
  "error": null
}
```

---

### get_assets

獲取資源列表。

### 請求格式

```json
{
  "type": "texture",
  "folder": "db://assets"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| type | string | 否 | 資源類型 |
| folder | string | 否 | 搜索文件夾 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "uuid": "uuid-1",
        "url": "db://assets/textures/a.png",
        "type": "texture"
      }
    ],
    "count": 45
  },
  "error": null
}
```

---

## 資源操作

### create_asset

創建新資源。

### 請求格式

```json
{
  "url": "db://assets/data/config.json",
  "content": "{\"key\": \"value\"}",
  "overwrite": false
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| url | string | 是 | 資源 URL |
| content | string | 是 | 資源內容 |
| overwrite | boolean | 否 | 是否覆蓋 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "uuid": "asset-uuid",
    "url": "db://assets/data/config.json",
    "created": true
  },
  "error": null
}
```

---

### copy_asset

複製資源。

### 請求格式

```json
{
  "source": "db://assets/textures/old.png",
  "target": "db://assets/textures/new.png",
  "overwrite": false
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "source": "db://assets/textures/old.png",
    "target": "db://assets/textures/new.png",
    "copied": true
  },
  "error": null
}
```

---

### move_asset

移動資源。

### 請求格式

```json
{
  "source": "db://assets/textures/old.png",
  "target": "db://assets/backup/old.png",
  "overwrite": true
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "source": "db://assets/textures/old.png",
    "target": "db://assets/backup/old.png",
    "moved": true
  },
  "error": null
}
```

---

### delete_asset

刪除資源。

### 請求格式

```json
{
  "url": "db://assets/temp/temp.png"
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "url": "db://assets/temp/temp.png",
    "deleted": true
  },
  "error": null
}
```

---

### save_asset

保存資源。

### 請求格式

```json
{
  "url": "db://assets/data/config.json",
  "content": "{\"key\": \"new value\"}"
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "url": "db://assets/data/config.json",
    "saved": true
  },
  "error": null
}
```

---

### reimport_asset

重新導入資源。

### 請求格式

```json
{
  "url": "db://assets/textures/hero.png"
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "url": "db://assets/textures/hero.png",
    "reimported": true
  },
  "error": null
}
```

---

## 資源查詢

### query_asset_path

查詢資源的文件系統路徑。

### 請求格式

```json
{
  "url": "db://assets/textures/hero.png"
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "url": "db://assets/textures/hero.png",
    "path": "/path/to/assets/textures/hero.png"
  },
  "error": null
}
```

---

### query_asset_uuid

查詢資源的 UUID。

### 請求格式

```json
{
  "url": "db://assets/textures/hero.png"
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "url": "db://assets/textures/hero.png",
    "uuid": "asset-uuid"
  },
  "error": null
}
```

---

### query_asset_url

通過 UUID 查詢資源 URL。

### 請求格式

```json
{
  "uuid": "xxx-xxx-xxx"
}
```

### 響應格式

```json
{
  "success": true,
  "data": {
    "uuid": "xxx-xxx-xxx",
    "url": "db://assets/textures/hero.png"
  },
  "error": null
}
```

---

### find_asset_by_name

按名稱查找資源。

### 請求格式

```json
{
  "name": "hero",
  "exactMatch": false,
  "assetType": "texture",
  "maxResults": 10
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | 是 | 資源名稱 |
| exactMatch | boolean | 否 | 是否精確匹配 |
| assetType | string | 否 | 資源類型 |
| maxResults | number | 否 | 最大結果數 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "uuid": "uuid-1",
        "url": "db://assets/textures/hero.png",
        "name": "hero.png",
        "type": "texture"
      }
    ],
    "count": 5
  },
  "error": null
}
```

---

### get_asset_details

獲取資源詳細信息。

### 請求格式

```json
{
  "assetPath": "db://assets/sprites/player.plist",
  "includeSubAssets": true
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| assetPath | string | 是 | 資源路徑 |
| includeSubAssets | boolean | 否 | 是否包含子資源 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "uuid": "asset-uuid",
    "url": "db://assets/sprites/player.plist",
    "type": "texture-atlas",
    "subAssets": [
      {
        "uuid": "sub-uuid-1",
        "name": "player_walk_01"
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
- `資源不存在`: 指定的資源路徑無效
- `權限不足`: 無法訪問指定路徑
- `構建失敗`: 構建過程中發生錯誤
- `UUID 無效`: 指定的 UUID 不存在
