# Validation API 參考

Cocos Creator 驗證 API 完整參考。

## 目錄

- [validate_asset](#validate_asset) - 驗證資源是否存在且有效
- [validate_asset_references](#validate_asset_references) - 驗證資源引用關係
- [find_duplicate_assets](#find_duplicate_assets) - 查找重複的資源文件

---

## validate_asset

驗證資源是否存在且有效。

### 請求格式

```json
{
  "uuid": "asset-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 資源 UUID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "valid": true,
    "uuid": "asset-uuid",
    "type": "texture",
    "url": "db://assets/textures/sprite.png",
    "exists": true,
    "corrupted": false
  },
  "error": null
}
```

### 驗證檢查項

| 檢查項 | 說明 |
|------|------|
| exists | 資源文件是否存在 |
| corrupted | 資源文件是否損壞 |
| valid | 資源是否可以正常載入 |

---

## validate_asset_references

驗證資源的引用關係完整性。

### 請求格式

```json
{
  "uuid": "asset-uuid"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| uuid | string | 是 | 資源 UUID |

### 響應格式

```json
{
  "success": true,
  "data": {
    "valid": true,
    "uuid": "asset-uuid",
    "referenceCount": 5,
    "referencePaths": [
      "db://assets/scenes/Game.scene",
      "db://assets/prefabs/Player.prefab"
    ],
    "brokenReferences": [],
    "missingDependencies": []
  },
  "error": null
}
```

### 驗證檢查項

| 檢查項 | 說明 |
|------|------|
| referenceCount | 被引用的次數 |
| referencePaths | 引用該資源的資源列表 |
| brokenReferences | 損壞的引用 |
| missingDependencies | 缺失的依賴資源 |

---

## find_duplicate_assets

查找項目中重複的資源文件。

### 請求格式

```json
{
  "directory": "db://assets",
  "checkBy": "hash"
}
```

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| directory | string | 否 | 搜索目錄 |
| checkBy | string | 否 | 檢查方式（hash, name, size） |

### 檢查方式

| 方式 | 說明 |
|------|------|
| hash | 通過文件哈希值判斷（最準確） |
| name | 通過文件名判斷 |
| size | 通過文件大小判斷 |

### 響應格式

```json
{
  "success": true,
  "data": {
    "duplicates": [
      {
        "hash": "abc123def456",
        "size": 245678,
        "assets": [
          {
            "uuid": "uuid-1",
            "url": "db://assets/textures/image.png",
            "path": "/path/to/assets/textures/image.png"
          },
          {
            "uuid": "uuid-2",
            "url": "db://assets/textures/copy.png",
            "path": "/path/to/assets/textures/copy.png"
          }
        ]
      }
    ],
    "groupCount": 12,
    "totalDuplicateCount": 34,
    "wastedSpace": 5678901
  },
  "error": null
}
```

### 返回數據說明

| 字段 | 說明 |
|------|------|
| groupCount | 重複組數量 |
| totalDuplicateCount | 總重複資源數量 |
| wastedSpace | 浪費的存儲空間（字節） |

---

## 使用場景

### 檢查資源完整性

```python
# 驗證單個資源
validate_asset(uuid="asset-uuid")

# 驗證引用關係
validate_asset_references(uuid="asset-uuid")
```

### 清理重複資源

```python
# 查找重複資源
result = find_duplicate_assets(directory="db://assets")

# 遍歷重複組，保留一個刪除其他
for group in result['data']['duplicates']:
    # 保留第一個，刪除其餘
    keep = group['assets'][0]
    for asset in group['assets'][1:]:
        delete_asset(url=asset['url'])
```

### 批量驗證

```python
# 獲取所有資源
assets = get_assets()

# 批量驗證
for asset in assets:
    result = validate_asset(uuid=asset['uuid'])
    if not result['data']['valid']:
        print(f"資源 {asset['url']} 無效")
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
- `資源不存在`: 指定的 UUID 無效
- `無法訪問資源`: 資源文件無法讀取
- `損壞的資源`: 資源文件已損壞
