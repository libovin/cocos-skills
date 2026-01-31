# 節點層級結構

Cocos Creator 場景中的節點組織方式和層級關係。

## 層級結構

```
Scene (場景根)
├── Canvas (畫布節點 - UI 根容器)
│   ├── Panel (面板)
│   │   ├── Button (按鈕)
│   │   │   ├── Background (背景圖)
│   │   │   └── Label (文字標籤)
│   │   └── ListView (列表視圖)
│   │       └── Item (列表項模板)
│   └── Widget (小部件)
│       └── ProgressBar (進度條)
├── Main Camera (主相機)
├── Lights (光源組)
│   ├── Directional Light (方向光)
│   └── Ambient Light (環境光)
└── Game World (遊戲世界容器)
    ├── Player (玩家)
    │   ├── Sprite (角色精靈)
    │   ├── Rigidbody2D (物理組件)
    │   └── Collider2D (碰撞體)
    ├── Enemies (敵人組)
    │   ├── Enemy1
    │   └── Enemy2
    └── Props (道具組)
        ├── Coin (金幣)
        └── PowerUp (能量道具)
```

## 節點類型

### 2D 節點

用於 UI 和 2D 遊戲對象。

| 節點類型 | 典型組件 | 用途 |
|---------|---------|------|
| Canvas | CanvasComponent, UITransform | UI 根容器 |
| Panel | UITransform, Sprite | UI 面板 |
| Button | Button, Sprite | 可交互按鈕 |
| Label | Label, UITransform | 文字顯示 |
| Sprite | Sprite, UITransform | 圖片顯示 |
| Widget | UITransform | UI 小部件 |

### 3D 節點

用於 3D 遊戲對象。

| 節點類型 | 典型組件 | 用途 |
|---------|---------|------|
| Camera | Camera | 3D 相機 |
| Light | LightSource | 光源 |
| Mesh Renderer | MeshRenderer | 3D 模型渲染 |
| Particle System | ParticleSystem | 粒子效果 |

## 節點屬性

### 基本屬性

```typescript
{
  "name": "Player",           // 節點名稱
  "uuid": "xxx-xxx-xxx",      // 唯一標識
  "active": true,             // 是否激活
  "parent": "parent-uuid",    // 父節點 UUID
  "children": [...]           // 子節點 UUID 列表
}
```

### 變換屬性

```typescript
{
  "position": {"x": 0, "y": 0, "z": 0},    // 位置
  "rotation": {"x": 0, "y": 0, "z": 0},    // 歐拉角旋轉（度）
  "scale": {"x": 1, "y": 1, "z": 1}        // 縮放
}
```

### 四元數旋轉 (Quaternion)

```typescript
{
  "rotation": {"x": 0, "y": 0, "z": 0, "w": 1}  // 四元數
}
```

## 節點操作

### 查找節點

```python
# 按名稱查找
execute_tool("node_find", {"name": "Player"})

# 按路徑查找
execute_tool("node_find", {"path": "Canvas/Panel/Button"})

# 獲取所有節點
execute_tool("node_get_all")
```

### 創建節點

```python
# 創建根節點
execute_tool("node_create", {
    "name": "Player",
    "parentUuid": "scene-uuid"
})

# 創建子節點
execute_tool("node_create", {
    "name": "Sprite",
    "parentUuid": "player-uuid",
    "position": {"x": 0, "y": 0}
})
```

### 修改節點

```python
# 設置位置
execute_tool("node_set_transform", {
    "uuid": "node-uuid",
    "position": {"x": 100, "y": 200, "z": 0}
})

# 設置激活狀態
execute_tool("node_set_property", {
    "uuid": "node-uuid",
    "path": "active",
    "value": True
})
```

### 組織節點

```python
# 移動節點到新父節點
execute_tool("node_move", {
    "uuid": "node-uuid",
    "parentUuid": "new-parent-uuid"
})

# 複製節點
execute_tool("node_duplicate", {
    "uuid": "node-uuid",
    "recursive": True  # 包含子節點
})
```

## 層級遍歷

### 廣度優先遍歷

```
Level 0: Scene
Level 1: Canvas, Camera, GameWorld
Level 2: Panel, Player, Enemies
Level 3: Button, Sprite, Enemy1, Enemy2
```

### 深度優先遍歷

```
Scene → Canvas → Panel → Button → Camera → GameWorld → Player → Enemies → Enemy1 → Enemy2
```

## 最佳實踐

### 命名規範

```
Canvas                    # UI 根容器
├── MainMenuPanel         # 功能面板 (XxxPanel)
│   ├── StartButton       # 按鈕 (XxxButton)
│   └── TitleLabel        # 標籤 (XxxLabel)
└── HUDPanel              # 抬頭顯示
    ├── HealthBar         # 進度條 (XxxBar)
    └── ScoreLabel        # 分數顯示
```

### 組織原則

1. **功能分組**: 將相關節點放在同一父節點下
2. **層級深度**: 避免過深的層級（建議不超過 5 層）
3. **命名清晰**: 使用有意義的名稱，體現節點用途
4. **使用空節點**: 用空節點作為邏輯分組容器

### 常見模式

```
Scene
├── UI                    # 所有 UI 節點
├── Cameras               # 所有相機
├── Lights                # 所有光源
├── Environment           # 環境效果
└── Gameplay              # 遊戲邏輯
    ├── Player
    ├── Enemies
    └── Collectibles
```

## 性能考慮

### 節點數量

- 建議單個場景不超過 500 個激活節點
- 使用對象池重用節點
- 非激活節點不參與渲染和更新

### 層級優化

- 扁平化層級結構
- 避免頻繁的節點創建/銷毀
- 使用預製體實例化替代動態創建

### 渲染批次

- 相同材質的精靈放在同一層級
- 使用自動圖集合併繪製調用
