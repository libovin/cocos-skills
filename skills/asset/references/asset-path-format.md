# 資源路徑格式

Cocos Creator 資源系統的路徑格式和使用規範。

## 資源數據庫路徑 (db://)

Cocos Creator 使用 `db://` 前綴表示資源數據庫路徑。

### 基本格式

```
db://assets/[folder]/[filename].[extension]
```

### 常見資源路徑

| 資源類型 | 路徑示例 | 說明 |
|---------|---------|------|
| 場景 | `db://assets/scenes/Main.scene` | 場景文件 |
| 預製體 | `db://assets/prefabs/Player.prefab` | 預製體 |
| 圖片 | `db://assets/textures/hero.png` | 圖片資源 |
| 音頻 | `db://assets/audio/bgm.mp3` | 音頻文件 |
| 腳本 | `db://assets/scripts/GameLogic.ts` | 腳本文件 |
| 字體 | `db://assets/fonts/arial.ttf` | 字體文件 |
| 動畫 | `db://assets/animations/idle.anim` | 動畫剪輯 |

## 項目結構約定

### 推薦的資源組織

```
assets/
├── scenes/               # 場景
│   ├── Main.scene
│   ├── Level1.scene
│   └── Level2.scene
├── prefabs/              # 預製體
│   ├── characters/
│   │   ├── Player.prefab
│   │   └── Enemy.prefab
│   └── ui/
│       ├── Button.prefab
│       └── Panel.prefab
├── sprites/              # 精靈圖片
│   ├── characters/
│   ├── items/
│   └── effects/
├── textures/             # 紋理圖片
│   ├── backgrounds/
│   └── particles/
├── audio/                # 音頻
│   ├── bgm/              # 背景音樂
│   └── sfx/              # 音效
├── scripts/              # 腳本
│   ├── components/
│   ├── managers/
│   └── utils/
├── animations/           # 動畫
│   ├── clips/
│   └── controllers/
├── fonts/                # 字體
├── materials/            # 材質
└── data/                 # 數據文件
    ├── config/
    └── localization/
```

## 資源 UUID

每個資源都有唯一的 UUID 標識。

### UUID 格式

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

示例: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### UUID 與路徑轉換

```python
# 路徑 → UUID
execute_tool("query_asset_uuid", {
    "url": "db://assets/textures/hero.png"
})

# UUID → 路徑
execute_tool("query_asset_url", {
    "uuid": "xxx-xxx-xxx"
})

# 路徑 → 磁盤路徑
execute_tool("query_asset_path", {
    "url": "db://assets/textures/hero.png"
})
```

## 資源引用

### meta 文件

每個資源都有對應的 `.meta` 文件，存儲資源的元數據和 UUID。

```
hero.png           # 資源文件
hero.png.meta     # 元數據文件
```

### meta 文件內容

```json
{
  "ver": "1.1.0",
  "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "importType": "image",
  "displayName": "hero",
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890@6c48a",
  "name": "hero",
  "userData": {
    "type": "sprite-frame",
    "wrapModeS": "clamp-to-edge",
    "wrapModeT": "clamp-to-edge"
  }
}
```

### 資源依賴

資源可以引用其他資源：

```
Scene.scene
  ├─→ Prefab.prefab
  │    └─→ Sprite.png
  └─→ Audio.mp3
```

### 查詢資源依賴

```python
execute_tool("get_asset_dependencies", {
    "url": "db://assets/scenes/Main.scene",
    "recursive": True
})
```

## 資源操作

### 導入資源

```python
execute_tool("import_asset", {
    "sourcePath": "/path/to/file.png",
    "targetFolder": "db://assets/textures"
})
```

### 創建資源

```python
execute_tool("create_asset", {
    "url": "db://assets/data/config.json",
    "content": '{"key": "value"}',
    "overwrite": False
})
```

### 保存資源

```python
execute_tool("save_asset", {
    "url": "db://assets/data/config.json",
    "content": '{"key": "new value"}'
})
```

### 複製資源

```python
execute_tool("copy_asset", {
    "source": "db://assets/prefabs/Enemy.prefab",
    "target": "db://assets/prefabs/Boss.prefab",
    "overwrite": False
})
```

### 移動資源

```python
execute_tool("move_asset", {
    "source": "db://assets/textures/old.png",
    "target": "db://assets/textures/new.png",
    "overwrite": True
})
```

### 刪除資源

```python
execute_tool("delete_asset", {
    "url": "db://assets/temp/unused.prefab"
})
```

### 批量刪除

```python
execute_tool("batch_delete_assets", {
    "urls": [
        "db://assets/temp/old1.png",
        "db://assets/temp/old2.png"
    ]
})
```

## 資源驗證

### 檢查資源有效性

```python
execute_tool("validate_asset", {
    "uuid": "asset-uuid"
})
```

### 驗證資源引用

```python
execute_tool("validate_asset_references", {
    "directory": "db://assets",
    "checkMissing": True
})
```

### 查找未使用的資源

```python
execute_tool("get_unused_assets", {
    "directory": "db://assets"
})
```

## 資源查詢

### 按名稱查找

```python
execute_tool("find_asset_by_name", {
    "name": "hero",
    "exactMatch": False,
    "assetType": "texture",
    "maxResults": 10
})
```

### 獲取資源信息

```python
execute_tool("get_asset_info", {
    "assetPath": "db://assets/textures/hero.png"
})
```

### 獲取資源詳情

```python
execute_tool("get_asset_details", {
    "assetPath": "db://assets/sprites/player.plist",
    "includeSubAssets": True
})
```

### 獲取資源列表

```python
execute_tool("get_assets", {
    "type": "texture",
    "folder": "db://assets/textures"
})
```

## 資源路徑規範

### 命名規範

```
// ✅ 好的命名
db://assets/sprites/characters/player_idle.png
db://assets/audio/bgm/battle_theme.mp3
db://assets/scripts/components/PlayerController.ts

// ❌ 不好的命名
db://assets/sprites/a.png
db://assets/audio/1.mp3
db://assets/scripts/script.ts
```

### 路徑規範

- 使用小寫字母和數字
- 使用連字符 `-` 分隔單詞
- 使用下劃線 `_` 分割詞組
- 避免使用特殊字符
- 避免使用空格

### 示例

```
// 資源文件命名
main-menu-bg.png       // 主菜單背景
player_run_anim.anim   // 玩家跑步動畫
btn_start_normal.png   // 開始按鈕正常狀態

// 資源夾命名
ui-panels/             // UI 面板
char-player/           // 玩家角色
sfx-ui/                // UI 音效
```

## 常見問題

### 資源找不到

```
錯誤: Failed to load resource: db://assets/textures/missing.png

解決:
1. 檢查路徑是否正確
2. 確認資源是否存在
3. 重新導入資源
```

### UUID 錯誤

```
錯誤: Invalid uuid: xxx-xxx

解決:
1. 使用 query_asset_uuid 獲取正確的 UUID
2. 檢查 meta 文件是否完整
```

### 資源依賴斷裂

```
錯誤: Missing dependency: xxx-xxx-xxx

解決:
1. 使用 validate_asset_references 檢查
2. 修復斷裂的引用
3. 刪除無效的引用
```
