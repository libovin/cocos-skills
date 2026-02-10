# Property Operations

节点和组件属性操作相关功能。

## API 列表

| 命令 | 功能 |
|------|------|
| `set-property` | 设置属性值 |
| `reset-property` | 重置属性为默认值 |
| `move-array-element` | 移动数组元素位置 |
| `remove-array-element` | 删除数组元素 |

## set-property

设置节点或组件的属性值。

```bash
# 设置节点位置
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "position", "dump": {"value": {"x":0,"y":0,"z":10}, "type": "cc.Vec3"}}'

# 设置节点旋转
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "rotation", "dump": {"value": {"x":0,"y":0,"z":0,"w":1}, "type": "cc.Quat"}}'

# 设置节点缩放
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "scale", "dump": {"value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}}'

# 设置精灵颜色
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "__comps__.0._color", "dump": {"value": {"r":255,"g":0,"b":0,"a":255}, "type": "cc.Color"}}'

# 设置内容尺寸
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "__comps__.1._contentSize", "dump": {"value": {"width":200,"height":200}, "type": "cc.Size"}}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| path | string | 是 | 属性路径 |
| dump | object | 是 | 属性值（包含 value 和 type） |

### 路径格式

| 类型 | 格式 | 示例 |
|------|------|------|
| 节点属性 | 直接使用属性名 | `position`、`rotation`、`scale` |
| 组件属性 | `__comps__.索引.属性名` | `__comps__.0._color` |

### 支持的 type 类型

| 类型 | 说明 | 格式 |
|------|------|------|
| cc.Vec3 | 三维向量 | `{"x":0,"y":0,"z":0}` |
| cc.Quat | 四元数 | `{"x":0,"y":0,"z":0,"w":1}` |
| cc.Vec2 | 二维向量 | `{"x":0,"y":0}` |
| cc.Color | 颜色 | `{"r":255,"g":0,"b":0,"a":255}` |
| cc.Size | 尺寸 | `{"width":100,"height":100}` |
| cc.Node | 节点引用 | `{"uuid":"节点UUID"}` |
| cc.String | 字符串 | 字符串值 |
| cc.Number | 数字 | 数字值 |
| cc.Boolean | 布尔值 | true/false |
| cc.Asset | 资源引用 | `{"uuid":"资源UUID"}` |

### 常用节点属性

| 属性 | 类型 | 说明 |
|------|------|------|
| position | cc.Vec3 | 节点位置 |
| rotation | cc.Quat | 节点旋转（四元数） |
| scale | cc.Vec3 | 节点缩放 |
| eulerAngles | cc.Vec3 | 欧拉角旋转 |
| angle | number | 二维旋转角度 |

### 常用组件属性

| 路径 | 类型 | 说明 |
|------|------|------|
| `__comps__.0._color` | cc.Color | 精灵颜色 |
| `__comps__.0.spriteFrame` | cc.SpriteFrame | 精灵帧 |
| `__comps__.1._contentSize` | cc.Size | 内容尺寸 |
| `__comps__.1._anchorPoint` | cc.Vec2 | 锚点 |
| `__comps__.2.string` | cc.String | 文本内容 |
| `__comps__.2.fontSize` | cc.Number | 字体大小 |

## reset-property

将属性恢复为引擎默认值。

```bash
cocos-skills scene reset-property '{"uuid": "节点UUID", "path": "color", "dump": null}'
cocos-skills scene reset-property '{"uuid": "节点UUID", "path": "position", "dump": null}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| path | string | 是 | 属性路径 |
| dump | any | 是 | 通常为 null |

## move-array-element

移动数组元素位置。

```bash
cocos-skills scene move-array-element '{"uuid": "节点UUID", "path": "children", "target": 5, "offset": 0}'
cocos-skills scene move-array-element '{"uuid": "节点UUID", "path": "children", "target": 1, "offset": 3}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| path | string | 是 | 数组属性路径 |
| target | number | 是 | 目标索引位置 |
| offset | number | 是 | 偏移量 |

## remove-array-element

删除指定索引的数组元素。

```bash
cocos-skills scene remove-array-element '{"uuid": "节点UUID", "path": "children", "index": 0}'
cocos-skills scene remove-array-element '{"uuid": "节点UUID", "path": "children", "index": 2}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| path | string | 是 | 数组属性路径 |
| index | number | 是 | 要删除的索引位置 |

## 操作流程示例

```bash
# 1. 获取节点树，找到节点和组件信息
cocos-skills scene query-node-tree

# 2. 设置节点位置
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "position", "dump": {"value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"}}'

# 3. 设置精灵颜色
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "__comps__.0._color", "dump": {"value": {"r":255,"g":128,"b":0,"a":255}, "type": "cc.Color"}}'

# 4. 调整数组元素顺序
cocos-skills scene move-array-element '{"uuid": "节点UUID", "path": "children", "target": 0, "offset": 2}'

# 5. 保存场景
cocos-skills scene save-scene
```

## 注意事项

1. **修改后保存**：属性修改后必须调用 `save-scene`
2. **组件索引**：组件索引从 0 开始，需先通过 `query-node` 获取
3. **类型匹配**：dump.type 必须与属性的实际类型匹配
4. **数组操作**：删除数组元素后，后续元素会自动前移
