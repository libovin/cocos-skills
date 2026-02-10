# Property Operations

节点和组件属性操作相关功能。

## API 列表

| 命令 | 功能 |
|------|------|
| `set-property` | 设置属性值 |
| `reset-property` | 重置属性为默认值 |
| `move-array-element` | 移动数组元素位置 |
| `remove-array-element` | 删除数组元素 |

---

## set-property

设置节点或组件的属性值，支持节点属性、组件属性和引用绑定。

### 基本语法

```bash
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "属性路径", "dump": {"value": "值", "type": "类型"}}'
```

### 使用示例

#### 节点变换属性

```bash
# 设置节点位置
cocos-skills scene set-property '{"uuid": "xxx", "path": "position", "dump": {"value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"}}'

# 设置节点旋转（四元数）
cocos-skills scene set-property '{"uuid": "xxx", "path": "rotation", "dump": {"value": {"x":0,"y":0,"z":0,"w":1}, "type": "cc.Quat"}}'

# 设置节点缩放
cocos-skills scene set-property '{"uuid": "xxx", "path": "scale", "dump": {"value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}}'

# 设置欧拉角旋转
cocos-skills scene set-property '{"uuid": "xxx", "path": "eulerAngles", "dump": {"value": {"x":0,"y":0,"z":45}, "type": "cc.Vec3"}}'

# 设置 2D 旋转角度
cocos-skills scene set-property '{"uuid": "xxx", "path": "angle", "dump": {"value": 90, "type": "cc.Number"}}'
```

#### 组件属性

```bash
# Sprite 颜色
cocos-skills scene set-property '{"uuid": "xxx", "path": "__comps__.0._color", "dump": {"value": {"r":255,"g":128,"b":0,"a":255}, "type": "cc.Color"}}'

# 内容尺寸
cocos-skills scene set-property '{"uuid": "xxx", "path": "__comps__.1._contentSize", "dump": {"value": {"width":200,"height":100}, "type": "cc.Size"}}'

# Label 文本
cocos-skills scene set-property '{"uuid": "xxx", "path": "__comps__.1._string", "dump": {"value": "Hello World", "type": "cc.String"}}'

# Label 字体大小
cocos-skills scene set-property '{"uuid": "xxx", "path": "__comps__.1._fontSize", "dump": {"value": 32, "type": "cc.Number"}}'

# Label 字体颜色
cocos-skills scene set-property '{"uuid": "xxx", "path": "__comps__.1._color", "dump": {"value": {"r":255,"g":255,"b":255,"a":255}, "type": "cc.Color"}}'
```

#### 组件引用绑定

```bash
# 绑定节点引用（UI 组件目标）
cocos-skills scene set-property '{"uuid": "Game2048UUID", "path": "__comps__.1.grid", "dump": {"value": {"uuid": "GridContainerUUID"}, "type": "cc.Node"}}'

# 绑定预制体资源引用
cocos-skills scene set-property '{"uuid": "GridContainerUUID", "path": "__comps__.0.tilePrefab", "dump": {"value": {"uuid": "TilePrefabUUID"}, "type": "cc.Prefab"}}'

# 绑定多个引用
cocos-skills scene set-property '{"uuid": "xxx", "path": "__comps__.0.target", "dump": {"value": {"uuid": "目标UUID"}, "type": "cc.Node"}}'
cocos-skills scene set-property '{"uuid": "xxx", "path": "__comps__.0.tilePrefab", "dump": {"value": {"uuid": "TileUUID"}, "type": "cc.Prefab"}}'
```

#### 激活状态

```bash
# 激活/停用节点
cocos-skills scene set-property '{"uuid": "xxx", "path": "_active", "dump": {"value": true, "type": "cc.Boolean"}}'
cocos-skills scene set-property '{"uuid": "xxx", "path": "_active", "dump": {"value": false, "type": "cc.Boolean"}}'
```

### 参数说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 目标节点的 UUID，通过 `query-node-tree` 获取 |
| path | string | 是 | 属性路径，节点属性直接用属性名，组件属性用 `__comps__.索引.属性名` |
| dump | object | 是 | 包含 `value` 和 `type` 两个字段的对象 |

### 路径格式详解

#### 节点属性（直接使用属性名）

| 路径 | 类型 | 示例值 | 说明 |
|------|------|--------|------|
| `position` | cc.Vec3 | {x:0, y:0, z:0} | 世界坐标位置 |
| `_lpos` | cc.Vec3 | {x:0, y:0, z:0} | 本地坐标位置 |
| `rotation` | cc.Quat | {x:0, y:0, z:0, w:1} | 四元数旋转 |
| `scale` | cc.Vec3 | {x:1, y:1, z:1} | 缩放 |
| `eulerAngles` | cc.Vec3 | {x:0, y:0, z:0} | 欧拉角（度） |
| `angle` | cc.Number | 0-360 | 2D 旋转角度 |
| `_active` | cc.Boolean | true/false | 是否激活 |

#### 组件属性（使用 `__comps__.索引.属性名`）

| 路径 | 组件类型 | 说明 |
|------|----------|------|
| `__comps__.0._color` | Sprite | 精灵颜色 |
| `__comps__.0.spriteFrame` | Sprite | 精灵帧引用 |
| `__comps__.1._contentSize` | UITransform | 内容尺寸 |
| `__comps__.1._anchorPoint` | UITransform | 锚点 |
| `__comps__.1._string` | Label | 文本内容 |
| `__comps__.1._fontSize` | Label | 字体大小 |
| `__comps__.1._horizontalAlign` | Label | 水平对齐 |
| `__comps__.1._verticalAlign` | Label | 垂直对齐 |
| `__comps__.0._interactable` | Button | 是否可交互 |
| `__comps__.0.normalColor` | Button | 普通状态颜色 |
| `__comps__.0.pressedColor` | Button | 按下状态颜色 |

### 支持的 type 类型

| 类型 | 说明 | Value 格式 | 常用于 |
|------|------|------------|----------|
| `cc.Vec3` | 三维向量 | `{"x":0, "y":0, "z":0}` | position, scale, eulerAngles |
| `cc.Quat` | 四元数 | `{"x":0, "y":0, "z":0, "w":1}` | rotation |
| `cc.Vec2` | 二维向量 | `{"x":0, "y":0}` | anchorPoint, size 分量 |
| `cc.Color` | 颜色 | `{"r":255, "g":0, "b":0, "a":255}` | 颜色相关属性 (范围 0-255) |
| `cc.Size` | 尺寸 | `{"width":100, "height":100}` | _contentSize, spriteFrame size |
| `cc.Node` | 节点引用 | `{"uuid":"节点UUID"}` | 组件的节点引用属性 |
| `cc.String` | 字符串 | `"文本内容"` | Label._string, 节点名称 |
| `cc.Number` | 数字 | `123` 或 `123.45` | fontSize, angle, 数组索引 |
| `cc.Boolean` | 布尔值 | `true` 或 `false` | _active, enabled, visible |
| `cc.Asset` | 资源引用 | `{"uuid":"资源UUID"}` | spriteFrame, material, texture |
| `cc.Prefab` | 预制体引用 | `{"uuid":"预制体UUID"}` | tilePrefab 等预制体属性 |
| `cc.SpriteFrame` | 精灵帧引用 | `{"uuid":"帧UUID"}` | Sprite.spriteFrame |
| `cc.Material` | 材质引用 | `{"uuid":"材质UUID"}` | 渲染材质 |
| `cc.Texture2D` | 纹理引用 | `{"uuid":"纹理UUID"}` | 纹理资源 |
| `cc.Font` | 字体引用 | `{"uuid":"字体UUID"}` | Label.font |
| `cc.AudioClip` | 音频引用 | `{"uuid":"音频UUID"}` | AudioSource.clip |

### 常用属性速查表

#### Sprite 组件

| 属性路径 | 类型 | 示例 |
|----------|------|------|
| `__comps__.0._color` | cc.Color | 设置精灵颜色 |
| `__comps__.0.spriteFrame` | cc.SpriteFrame | 设置精灵帧 |
| `__comps__.0._grayscale` | cc.Boolean | 是否灰度 |
| `__comps__.0._useGrayscale` | cc.Boolean | 是否使用灰度 |

#### Label 组件

| 属性路径 | 类型 | 示例 |
|----------|------|------|
| `__comps__.1._string` | cc.String | 设置文本 |
| `__comps__.1._fontSize` | cc.Number | 设置字号 |
| `__comps__.1._color` | cc.Color | 设置文字颜色 |
| `__comps__.1._lineHeight` | cc.Number | 设置行高 |
| `__comps__.1._horizontalAlign` | cc.Number | 0=左, 1=中, 2=右 |
| `__comps__.1._verticalAlign` cc.Number | 0=顶, 1=中, 2=底 |
| `__comps__.1._overflow` | cc.Number | 0=裁剪, 1=自动换行, 2=不换行 |

#### Button 组件

| 属性路径 | 类型 | 示例 |
|----------|------|------|
| `__comps__.2._interactable` | cc.Boolean | 是否可交互 |
| `__comps__.2._normalColor` | cc.Color | 普通状态颜色 |
| `__comps__.2._pressedColor` | cc.Color | 按下状态颜色 |
| `__comps__.2._hoverColor` | cc.Color | 悬停状态颜色 |
| `__comps__.2._disabledColor` | cc.Color | 禁用状态颜色 |

#### UITransform 组件

| 属性路径 | 类型 | 示例 |
|----------|------|------|
| `__comps__.0._contentSize` | cc.Size | 设置内容大小 |
| `__comps__.0._anchorPoint` | cc.Vec2 | 设置锚点 |

### 组件引用绑定指南

#### 查找组件索引

```bash
# 1. 查询节点获取组件列表
cocos-skills scene query-node <节点UUID>

# 2. 从返回的 components 数组中确定索引
# components[0] = UITransform
# components[1] = Sprite
# components[2] = 自定义脚本
```

#### 绑定不同类型的引用

```bash
# 节点引用（如 Button 的点击目标）
cocos-skills scene set-property '{"uuid": "按钮UUID", "path": "__comps__.2.target", "dump": {"value": {"uuid": "目标节点UUID"}, "type": "cc.Node"}}'

# 预制体引用（如 Grid 的 Tile 预制体）
cocos-skills scene set-property '{"uuid": "GridUUID", "path": "__comps__.0.tilePrefab", "dump": {"value": {"uuid": "Tile预制体UUID"}, "type": "cc.Prefab"}}'

# 精灵帧引用（设置图片）
cocos-skills scene set-property '{"uuid": "SpriteUUID", "path": "__comps__.0.spriteFrame", "dump": {"value": {"uuid": "图片资源UUID"}, "type": "cc.SpriteFrame"}}'
```

### 完整工作流程示例

#### 场景 1：设置 UI 元素位置和样式

```bash
# 1. 打开场景
cocos-skills scene open-scene db://assets/scenes/Main.scene

# 2. 查询节点树，获取 UUID
cocos-skills scene query-node-tree minimal

# 3. 设置标题位置
cocos-skills scene set-property '{"uuid": "TitleUUID", "path": "position", "dump": {"value": {"x":0,"y":300,"z":0}, "type": "cc.Vec3"}}'

# 4. 设置标题文本
cocos-skills scene set-property '{"uuid": "TitleUUID", "path": "__comps__.1._string", "dump": {"value": "游戏标题", "type": "cc.String"}}'

# 5. 设置标题颜色
cocos-skills scene set-property '{"uuid": "TitleUUID", "path": "__comps__.1._color", "dump": {"value": {"r":255,"g":215,"b":0,"a":255}, "type": "cc.Color"}}'

# 6. 设置标题大小
cocos-skills scene set-property '{"uuid": "TitleUUID", "path": "__comps__.1._fontSize", "dump": {"value": 48, "type": "cc.Number"}}'

# 7. 保存场景
cocos-skills scene save-scene
```

#### 场景 2：绑定组件引用

```bash
# 1. 查询预制体资源 UUID
cocos-skills asset-db query-uuid db://assets/prefabs/Tile.prefab

# 2. 查询节点 UUID
cocos-skills scene query-node-tree minimal

# 3. 绑定预制体到 Grid 组件
cocos-skills scene set-property '{"uuid": "GridNodeUUID", "path": "__comps__.0.tilePrefab", "dump": {"value": {"uuid": "TilePrefabUUID"}, "type": "cc.Prefab"}}'

# 4. 绑定容器节点
cocos-skills scene set-property '{"uuid": "GridNodeUUID", "path": "__comps__.0.tileContainer", "dump": {"value": {"uuid": "ContainerNodeUUID"}, "type": "cc.Node"}}'

# 5. 设置 Grid 配置
cocos-skills scene set-property '{"uuid": "GridNodeUUID", "path": "__comps__.0.gridSize", "dump": {"value": 4, "type": "cc.Number"}}'
cocos-skills scene set-property '{"uuid": "GridNodeUUID", "path": "__comps__.0.tileSize", "dump": {"value": 80, "type": "cc.Number"}}'
cocos-skills scene set-property '{"uuid": "GridNodeUUID", "path": "__comps__.0.gapSize", "dump": {"value": 10, "type": "cc.Number"}}'

# 6. 保存场景
cocos-skills scene save-scene
```

### 错误排查

#### 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `无效的 type 值` | type 不在支持列表中 | 检查 type 是否为支持的类型（如 cc.Vec3, cc.Color） |
| `参数必须是对象类型` | JSON 格式错误 | 确保 JSON 对象格式正确，使用单引号包裹 |
| `属性不存在` | 路径错误 | 检查组件索引是否正确，使用 query-node 验证 |
| `类型不匹配` | value 格式与 type 不符 | 确保 value 结构与 type 匹配（如 cc.Color 需要 r/g/b/a 字段） |

---

## reset-property

将属性恢复为引擎默认值。

```bash
# 重置位置为原点
cocos-skills scene reset-property '{"uuid": "xxx", "path": "position", "dump": null}'

# 重置颜色为默认白色
cocos-skills scene reset-property '{"uuid": "xxx", "path": "__comps__.0._color", "dump": null}'

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

### 1. 操作前检查

```bash
# 查询节点状态
cocos-skills scene query-node <节点UUID>

# 查询场景脏标记
cocos-skills scene query-dirty
```

### 2. 批量操作脚本

```javascript
// 使用 Node.js 脚本批量设置
import { execute } from './cli/dist/lib/client.js';

async function batchSetProperties() {
  const nodes = [
    { uuid: 'node1', path: 'position', value: {x:0, y:100, z:0}, type: 'cc.Vec3' },
    { uuid: 'node1', path: '__comps__.0._color', value: {r:255, g:0, b:0, a:255}, type: 'cc.Color' },
    { uuid: 'node2', path: 'scale', value: {x:2, y:2, z:1}, type: 'cc.Vec3' },
  ];

  for (const prop of nodes) {
    await execute('scene', 'set-property', [{
      uuid: prop.uuid,
      path: prop.path,
      dump: { value: prop.value, type: prop.type }
    }]);
  }

  await execute('scene', 'save-scene', []);
}
```

### 3. 获取 UUID 的技巧

```bash
# 列出所有节点（精简模式）
cocos-skills scene query-node-tree minimal

# 列出所有节点（基本信息）
cocos-skills scene query-node-tree basic

# 查询特定节点
cocos-skills scene query-node <节点UUID>

# 查询资源 UUID
cocos-skills asset-db query-uuid db://assets/prefabs/Tile.prefab
```

---

## 注意事项

1. **修改后保存**：所有属性修改后必须调用 `save-scene`，否则编辑器刷新后更改会丢失
2. **组件索引**：组件索引从 0 开始，建议先用 `query-node` 查看组件列表
3. **类型匹配**：dump.type 必须与属性的实际类型匹配，否则会返回错误
4. **数组操作**：删除数组元素后，后续元素的索引会变化，需要注意
5. **引用完整性**：绑定节点引用时确保目标节点存在，避免空引用
