# Property Operations

节点和组件属性操作相关功能。

## API 列表

| 命令 | 功能 |
|------|------|
| `set-property` | 设置属性值（支持批量设置） |
| `reset-property` | 重置属性为默认值 |
| `move-array-element` | 移动数组元素位置 |
| `remove-array-element` | 删除数组元素 |

---

## set-property

设置节点或组件的属性值，支持节点属性、组件属性和引用绑定。

### 基本语法

```bash
# 设置节点属性（component 可省略，默认为 cc.Node）
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "properties": [
    {"name": "position", "value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"},
    {"name": "scale", "value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}
  ]
}'

# 设置组件属性（需要指定 component）
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Sprite",
  "properties": [
    {"name": "color", "value": {"r":255,"g":0,"b":0,"a":255}, "type": "cc.Color"}
  ]
}'
```

### 参数说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 目标节点的 UUID |
| component | string | 否 | 组件类型，默认为 `cc.Node` |
| properties | array | 是 | 属性数组，每项包含 `name`、`value`、`type` |

**component 可选值：**
- 省略或 `cc.Node` - 节点属性（position, scale, angle 等）
- `cc.Sprite` - 精灵组件属性
- `cc.Label` - 标签组件属性
- `cc.Button` - 按钮组件属性
- 自定义脚本 - 动态查询属性验证

---

### 使用示例

#### 节点属性（component 可省略）

```bash
# 设置节点属性
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "properties": [
    {"name": "position", "value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"},
    {"name": "scale", "value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}
  ]
}'
```

#### 组件属性（需要指定 component）

```bash
# 设置 Sprite 组件属性
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Sprite",
  "properties": [
    {"name": "color", "value": {"r":255,"g":128,"b":0,"a":255}, "type": "cc.Color"},
    {"name": "sizeMode", "value": 0, "type": "cc.Number"}
  ]
}'

# 设置 Label 组件属性
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Label",
  "properties": [
    {"name": "string", "value": "Hello World", "type": "cc.String"},
    {"name": "fontSize", "value": 32, "type": "cc.Number"},
    {"name": "color", "value": {"r":255,"g":255,"b":255,"a":255}, "type": "cc.Color"}
  ]
}'
```

#### 组件引用绑定

```bash
# 绑定节点引用
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Button",
  "properties": [
    {"name": "target", "value": {"uuid": "目标节点UUID"}, "type": "cc.Node"}
  ]
}'

# 绑定预制体引用
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "Game2048",
  "properties": [
    {"name": "tilePrefab", "value": {"uuid": "Tile预制体UUID"}, "type": "cc.Prefab"}
  ]
}'
```

#### 组件类型属性绑定（重要）

当脚本组件的属性类型为 `cc.Label`、`cc.Sprite` 等组件类型时，**必须使用组件 UUID 而非节点 UUID**。

```bash
# 错误示例：使用节点 UUID 设置 cc.Label 类型属性（会失败）
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "Game2048",
  "properties": [
    {"name": "scoreLabel", "value": {"uuid": "节点UUID"}, "type": "cc.Label"}
  ]
}'

# 正确示例：使用组件 UUID 设置 cc.Label 类型属性
# 首先通过 query-component 获取组件 UUID
cocos-skills scene query-node <节点UUID> 
# 找到 cc.Label 组件的 uuid，如 "abc123"

cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "Game2048",
  "properties": [
    {"name": "scoreLabel", "value": {"uuid": "cc.Label组件UUID"}, "type": "cc.Label"}
  ]
}'
```

**常见组件类型属性：**
| 属性类型 | 说明 | value.uuid 应为 |
|----------|------|-----------------|
| `cc.Label` | 标签组件引用 | cc.Label 组件的 UUID |
| `cc.Sprite` | 精灵组件引用 | cc.Sprite 组件的 UUID |
| `cc.Button` | 按钮组件引用 | cc.Button 组件的 UUID |
| `cc.Node` | 节点引用 | 节点的 UUID |

**获取组件 UUID 的方法：**
```bash
# 查询节点下的所有组件
cocos-skills scene query-node <节点UUID>

# 返回结果中每个组件都有 uuid 字段
# {
#   "type": "cc.Label",
#   "uuid": "组件UUID",  <-- 使用这个
#   ...
# }
```

#### 激活状态

```bash
# 激活/停用节点
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "properties": [
    {"name": "active", "value": true, "type": "cc.Boolean"}
  ]
}'
```

---

### 节点属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `position` | cc.Vec3 | 世界坐标位置 |
| `scale` | cc.Vec3 | 缩放 |
| `angle` | cc.Vec3 | 旋转角度 |
| `layer` | cc.Enum | 层级 |
| `mobility` | cc.Enum | 移动性 (0=Static, 1=Stationary, 2=Movable) |
| `name` | cc.String | 节点名称 |
| `active` | cc.Boolean | 是否激活 |

---

### 支持的 type 类型

| 类型 | 说明 | Value 格式 | 常用于 |
|------|------|------------|----------|
| `cc.Vec3` | 三维向量 | `{"x":0, "y":0, "z":0}` | position, scale, angle |
| `cc.Quat` | 四元数 | `{"x":0, "y":0, "z":0, "w":1}` | rotation |
| `cc.Vec2` | 二维向量 | `{"x":0, "y":0}` | anchorPoint, size 分量 |
| `cc.Color` | 颜色 | `{"r":255, "g":0, "b":0, "a":255}` | 颜色相关属性 (范围 0-255) |
| `cc.Size` | 尺寸 | `{"width":100, "height":100}` | contentSize |
| `cc.Node` | 节点引用 | `{"uuid":"节点UUID"}` | 组件的节点引用属性 |
| `cc.Label` | 标签组件引用 | `{"uuid":"组件UUID"}` | 脚本中的 cc.Label 类型属性 |
| `cc.Sprite` | 精灵组件引用 | `{"uuid":"组件UUID"}` | 脚本中的 cc.Sprite 类型属性 |
| `cc.Button` | 按钮组件引用 | `{"uuid":"组件UUID"}` | 脚本中的 cc.Button 类型属性 |
| `cc.String` | 字符串 | `"文本内容"` | Label.string, 节点名称 |
| `cc.Number` | 数字 | `123` 或 `123.45` | fontSize, angle |
| `cc.Boolean` | 布尔值 | `true` 或 `false` | active, enabled |
| `cc.Asset` | 资源引用 | `{"uuid":"资源UUID"}` | spriteFrame, material |
| `cc.Prefab` | 预制体引用 | `{"uuid":"预制体UUID"}` | 预制体属性 |
| `cc.SpriteFrame` | 精灵帧引用 | `{"uuid":"帧UUID"}` | Sprite.spriteFrame |

> **注意**：`cc.Label`、`cc.Sprite`、`cc.Button` 等组件类型引用需要使用**组件 UUID**（通过 `query-component --raw` 获取），而非节点 UUID。

---

### 常用属性速查表

#### Sprite 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `color` | cc.Color | 颜色 |
| `spriteFrame` | cc.SpriteFrame | 精灵帧 |
| `type` | cc.Enum | 精灵类型 (0=SIMPLE, 1=SLICED, 2=TILED, 3=FILLED) |
| `sizeMode` | cc.Enum | 尺寸模式 (0=CUSTOM, 1=TRIMMED, 2=RAW) |
| `grayscale` | cc.Boolean | 是否灰度 |

#### Label 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `string` | cc.String | 文本内容 |
| `fontSize` | cc.Number | 字体大小 |
| `color` | cc.Color | 文字颜色 |
| `lineHeight` | cc.Number | 行高 |
| `horizontalAlign` | cc.Enum | 水平对齐 (0=左, 1=中, 2=右) |
| `verticalAlign` | cc.Enum | 垂直对齐 (0=顶, 1=中, 2=底) |
| `overflow` | cc.Enum | 溢出模式 (0=NONE, 1=CLAMP, 2=SHRINK, 3=RESIZE_HEIGHT) |

#### Button 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `interactable` | cc.Boolean | 是否可交互 |
| `transition` | cc.Enum | 过渡类型 (0=无, 1=颜色, 2=精灵, 3=缩放) |
| `target` | cc.Node | 目标节点 |

#### UITransform 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `contentSize` | cc.Size | 内容大小 |
| `anchorPoint` | cc.Vec2 | 锚点 |

#### Widget 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `top` | cc.Number | 上边距 |
| `bottom` | cc.Number | 下边距 |
| `left` | cc.Number | 左边距 |
| `right` | cc.Number | 右边距 |

---

### 完整工作流程示例

#### 场景 1：批量设置 UI 元素属性

```bash
# 1. 打开场景
cocos-skills scene open-scene db://assets/scenes/Main.scene

# 2. 查询节点树，获取 UUID
cocos-skills scene query-node-tree minimal

# 3. 设置节点属性（component 可省略）
cocos-skills scene set-property '{
  "uuid": "TitleUUID",
  "properties": [
    {"name": "position", "value": {"x":0,"y":300,"z":0}, "type": "cc.Vec3"},
    {"name": "scale", "value": {"x":1.5,"y":1.5,"z":1}, "type": "cc.Vec3"}
  ]
}'

# 4. 设置 Label 组件属性
cocos-skills scene set-property '{
  "uuid": "TitleUUID",
  "component": "cc.Label",
  "properties": [
    {"name": "string", "value": "游戏标题", "type": "cc.String"},
    {"name": "fontSize", "value": 48, "type": "cc.Number"},
    {"name": "color", "value": {"r":255,"g":215,"b":0,"a":255}, "type": "cc.Color"}
  ]
}'

# 5. 保存场景
cocos-skills scene save-scene
```

#### 场景 2：绑定组件引用

```bash
# 1. 查询预制体资源 UUID
cocos-skills asset-db query-uuid db://assets/prefabs/Tile.prefab

# 2. 查询节点 UUID
cocos-skills scene query-node-tree minimal

# 3. 绑定引用
cocos-skills scene set-property '{
  "uuid": "GridNodeUUID",
  "component": "Game2048",
  "properties": [
    {"name": "tilePrefab", "value": {"uuid": "TilePrefabUUID"}, "type": "cc.Prefab"},
    {"name": "tileContainer", "value": {"uuid": "ContainerNodeUUID"}, "type": "cc.Node"},
    {"name": "gridSize", "value": 4, "type": "cc.Number"},
    {"name": "tileSize", "value": 80, "type": "cc.Number"}
  ]
}'

# 4. 保存场景
cocos-skills scene save-scene
```

---

## reset-property

将属性恢复为引擎默认值。

```bash
# 重置位置为原点
cocos-skills scene reset-property '{"uuid": "xxx", "path": "position", "dump": null}'

# 重置颜色为默认白色
cocos-skills scene reset-property '{"uuid": "xxx", "path": "__comps__.0.color", "dump": null}'

# 重置缩放为 (1, 1, 1)
cocos-skills scene reset-property '{"uuid": "xxx", "path": "scale", "dump": null}'
```

### 参数说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| path | string | 是 | 要重置的属性路径 |
| dump | any | 是 | 通常传 `null` |

---

## move-array-element

移动数组元素位置，常用于调整子节点顺序或数组元素顺序。

```bash
# 将第 3 个元素移动到第 1 个位置
cocos-skills scene move-array-element '{"uuid": "节点UUID", "path": "children", "target": 1, "offset": 2}'

# 将元素向后移动 3 位
cocos-skills scene move-array-element '{"uuid": "节点UUID", "path": "children", "target": 5, "offset": -3}'
```

### 参数说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| path | string | 是 | 数组属性路径（如 `children`） |
| target | number | 是 | 目标索引位置 |
| offset | number | 是 | 偏移量（可为负数） |

---

## remove-array-element

删除指定索引的数组元素，后续元素会自动前移。

```bash
# 删除第一个子节点
cocos-skills scene remove-array-element '{"uuid": "父节点UUID", "path": "children", "index": 0}'

# 删除第三个子节点
cocos-skills scene remove-array-element '{"uuid": "父节点UUID", "path": "children", "index": 2}'
```

### 参数说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| path | string | 是 | 数组属性路径 |
| index | number | 是 | 要删除的索引位置（从 0 开始） |

---

## 最佳实践

### 1. 节点属性可省略 component

```bash
# 简化写法（推荐）
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "properties": [
    {"name": "position", "value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"}
  ]
}'

# 等价于显式指定 cc.Node
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Node",
  "properties": [
    {"name": "position", "value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"}
  ]
}'
```

### 2. 操作前检查

```bash
# 查询节点状态
cocos-skills scene query-node <节点UUID>

# 查询场景脏标记
cocos-skills scene query-dirty
```

---

## 注意事项

1. **修改后保存**：所有属性修改后必须调用 `save-scene`，否则编辑器刷新后更改会丢失
2. **类型匹配**：type 必须与属性的实际类型匹配，否则会返回错误
3. **数组操作**：删除数组元素后，后续元素的索引会变化，需要注意
4. **引用完整性**：绑定节点引用时确保目标节点存在，避免空引用
