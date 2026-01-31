# 組件類型參考

Cocos Creator 可用的內建組件類型及屬性說明。

## 渲染組件

### Sprite (精靈)

顯示 2D 圖片或幀動畫。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Sprite"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| spriteFrame | SpriteFrame | 精靈幀資源 |
| type | SpriteType | 類型: SIMPLE, SLICED, TILED, FILLED |
| sizeMode | SizeMode | 尺寸模式: TRIMMED, RAW, CUSTOM |
|fillType | FillType | 填充類型: HORIZONTAL, VERTICAL, RADIAL |
| fillStart | number | 填充起始位置 (0-1) |
| fillRange | number | 填充範圍 (0-1) |

### Label (標籤)

顯示文字。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Label"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| string | string | 文字內容 |
| fontSize | number | 字體大小 |
| font | Font | 字體資源 |
| color | Color | 文字顏色 |
| lineHeight | number | 行高 |
| horizontalAlign | HorizontalAlign | 水平對齊: LEFT, CENTER, RIGHT |
| verticalAlign | VerticalAlign | 垂直對齊: TOP, CENTER, BOTTOM |
| overflow | Overflow | 溢出處理: NONE, CLAMP, SHRINK, RESIZE_HEIGHT |

### Mask (遮罩)

限制子節點的顯示區域。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Mask"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| type | MaskType | 遮罩類型: RECT, ELLIPSE, GRAPHICS_STENCIL, IMAGE_STENCIL |
| segments | number | 橢圓/多邊形邊數 |
| inverted | boolean | 是否反向遮罩 |

## UI 組件

### Button (按鈕)

響應點擊事件的交互組件。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Button"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| target | Node | 點擊目標節點 |
| transition | Transition | 過渡類型: NONE, COLOR, SPRITE, SCALE |
| normalColor | Color | 正常狀態顏色 |
| pressedColor | Color | 按下狀態顏色 |
| hoverColor | Color | 懸停狀態顏色 |
| disabledColor | Color | 禁用狀態顏色 |
| duration | number | 過渡動畫時長 |
| zoomScale | number | 縮放比例 |
| clickEvents | array | 點擊事件列表 |

### Toggle (開關)

兩態開關控件。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Toggle"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| isChecked | boolean | 是否選中 |
| checkMark | Sprite | 選中標記 |
| toggleGroup | ToggleGroup | 所屬的開關組 |
| checkEvents | array | 狀態變化事件 |

### Slider (滑動條)

數值選擇控件。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Slider"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| direction | Direction | 方向: HORIZONTAL, VERTICAL |
| progress | number | 當前進度 (0-1) |
| handle | Node | 滑塊節點 |
| slideEvents | array | 滑動事件 |

### ScrollView (滾動視圖)

可滾動的內容容器。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.ScrollView"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| horizontal | boolean | 是否允許水平滾動 |
| vertical | boolean | 是否允許垂直滾動 |
| inertia | boolean | 是否有慣性 |
| brake | number | 慣性停止係數 |
| elastic | boolean | 是否有彈性效果 |
| content | Node | 內容節點 |

## 2D 物理組件

### Rigidbody2D (剛體)

模擬物理行為。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.RigidBody2D"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| type | BodyType | 類型: STATIC, KINEMATIC, DYNAMIC |
| linearVelocity | Vec2 | 線性速度 |
| angularVelocity | number | 角速度 |
| fixedRotation | boolean | 固定旋轉 |
| gravityScale | number | 重力縮放 |
| linearDamping | number | 線性阻尼 |
| angularDamping | number | 角阻尼 |

### Collider2D (碰撞體)

定義碰撞形狀。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.BoxCollider2D"
})
```

**碰撞體類型**:

| 類型 | 說明 | 屬性 |
|------|------|------|
| BoxCollider2D | 矩形 | size, offset |
| CircleCollider2D | 圓形 | radius, offset |
| PolygonCollider2D | 多邊形 | points, offset |
| ChainCollider2D | 鏈條 | points, loop |

### PhysicsMaterial2D (物理材質)

定義摩擦和彈性。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.PhysicsMaterial2D"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| friction | number | 摩擦係數 (0-1) |
| restitution | number | 彈性係數 (0-1) |

## 3D 組件

### Camera (相機)

3D 場景的渲染相機。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Camera"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| priority | number | 渲染優先級 |
| fov | number | 視野角度 |
| near | number | 近裁剪面距離 |
| far | number | 遠裁剪面距離 |
| color | Color | 背景顏色 |
| clearColorFlags | ClearFlag | 清除標誌 |

### Light (光源)

提供照明。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Light"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| type | LightType | 類型: DIRECTIONAL, POINT, SPOT, AMBIENT |
| color | Color | 光源顏色 |
| intensity | number | 光照強度 |
| range | number | 照射範圍 (點光源/聚光燈) |
| spotAngle | number | 聚光角度 (聚光燈) |

### MeshRenderer (網格渲染器)

渲染 3D 模型。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.MeshRenderer"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| mesh | Mesh | 網格資源 |
| material | Material | 材質資源 |

## 動畫組件

### Animation (動畫)

播放精靈動畫或骨骼動畫。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Animation"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| defaultClip | AnimationClip | 默認動畫剪輯 |
| clips | array | 動畫剪輯列表 |
| playOnLoad | boolean | 加載時是否播放 |

### Spine/Skeleton (骨骼動畫)

Spine 骨骼動畫。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "sp.Skeleton"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| skeletonData | SkeletonData | 骨骼數據 |
| defaultSkin | string | 默認皮膚 |
| defaultAnimation | string | 默認動畫 |
| loop | boolean | 是否循環 |
| premultipliedAlpha | boolean | 預乘 Alpha |

## 音頻組件

### AudioSource (音頻源)

播放音樂和音效。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.AudioSource"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| clip | AudioClip | 音頻剪輯 |
| loop | boolean | 是否循環 |
| volume | number | 音量 (0-1) |
| playOnLoad | boolean | 加載時播放 |

## 粒子組件

### ParticleSystem (粒子系統)

粒子特效。

```python
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.ParticleSystem"
})
```

| 屬性 | 類型 | 說明 |
|------|------|------|
| file | ParticleAsset | 粒子資源 |
| duration | number | 持續時間 |
| emissionRate | number | 發射速率 |
| life | number | 粒子壽命 |
| totalParticles | number | 粒子總數 |
| startColor | Color | 起始顏色 |
| endColor | Color | 結束顏色 |

## 腳本組件

### 自定義腳本

用戶編寫的 TypeScript/JavaScript 腳本。

```python
# 附加腳本組件
execute_tool("component_attach_script", {
    "uuid": "node-uuid",
    "scriptPath": "db://assets/scripts/PlayerController.ts"
})
```

**常用生命週期方法**:

```typescript
// 組件加載時
onLoad() {}

// 組件啟用時
start() {}

// 每幀更新
update(deltaTime: number) {}

// 延遲更新
lateUpdate(deltaTime: number) {}

// 組件禁用時
onDisable() {}

// 組件銷毀時
onDestroy() {}
```

## 組件操作示例

### 查詢組件

```python
# 獲取節點的所有組件
execute_tool("component_get_components", {
    "uuid": "node-uuid"
})

# 獲取特定組件信息
execute_tool("component_get_component_info", {
    "uuid": "node-uuid",
    "componentUuid": "component-uuid"
})
```

### 設置組件屬性

```python
# 設置屬性值
execute_tool("set_component_property", {
    "uuid": "node-uuid",
    "componentUuid": "component-uuid",
    "property": "enabled",
    "value": True
})

# 批量設置屬性
execute_tool("set_component_property", {
    "uuid": "node-uuid",
    "componentUuid": "component-uuid",
    "properties": {
        "color": {"r": 255, "g": 0, "b": 0, "a": 255},
        "fontSize": 32
    }
})
```

### 移除組件

```python
execute_tool("component_remove", {
    "uuid": "node-uuid",
    "componentUuid": "component-uuid"
})
```
