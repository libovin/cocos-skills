# Node Operations

场景节点操作相关功能。

## API 列表

| 命令 | 功能 |
|------|------|
| `query-node-tree` | 查询场景节点树 |
| `create-node` | 创建新节点 |
| `remove-node` | 删除节点 |
| `copy-node` | 复制节点 |
| `duplicate-node` | 快速复制节点 |
| `paste-node` | 粘贴节点 |
| `cut-node` | 剪切节点 |
| `set-parent` | 设置父节点 |
| `reset-node` | 重置节点变换 |
| `restore-prefab` | 恢复预制体 |

## query-node-tree

查询场景的节点树结构，返回节点的层级关系。

```bash
cocos-skills scene query-node-tree
cocos-skills scene query-node-tree minimal
cocos-skills scene query-node-tree basic
cocos-skills scene query-node-tree '{"only":"uuid,name,path"}'
cocos-skills scene query-node-tree '{"onlyActive":true}'
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filter | string/object | 否 | 过滤选项 |

### 预设配置

| 预设 | 说明 |
|------|------|
| minimal | 仅 uuid 和 name |
| basic | uuid、name、path、active |
| full | 完整信息（默认） |

### 选项参数

```json
{
  "only": "uuid,name,path",     // 字符串或数组，指定包含的字段
  "onlyActive": true            // 是否仅包含激活的节点
}
```

### 响应

```json
{
  "success": true,
  "data": {
    "uuid": "根节点UUID",
    "name": "Canvas",
    "path": "/Canvas",
    "active": true,
    "children": [
      {
        "uuid": "子节点UUID",
        "name": "Sprite",
        "path": "/Canvas/Sprite",
        "active": true,
        "components": [...]
      }
    ]
  }
}
```

## create-node

创建新节点并返回节点 UUID。

```bash
cocos-skills scene create-node '{"parent": "父节点UUID", "name": "ChildNode","type": "cc.Sprite"}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| parent | string | 否 | 父节点 UUID |
| name | string | 否 | 节点名称 |
| type | string | 否 | 节点类型 |

### 支持的 type 类型

| 类别 | 类型 | 说明 |
|------|------|------|
| 基础 | cc.Camera | 相机 |
| 2D | cc.Sprite, cc.Label, cc.Graphics | 精灵/文本/绘图 |
| 2D | cc.Mask, cc.ParticleSystem2D, cc.TiledMap | 遮罩/粒子/地图 |
| UI | cc.Button, cc.Canvas, cc.EditBox | 按钮/画布/输入框 |
| UI | cc.Layout, cc.PageView, cc.ProgressBar | 布局/翻页/进度条 |
| UI | cc.ScrollView, cc.Slider, cc.Toggle | 滚动/滑块/开关 |
| UI | cc.RichText, cc.VideoPlayer, cc.WebView | 富文本/视频/网页 |
| UI | cc.Widget | 对齐组件 |
| 3D | cc.MeshRenderer, cc.Terrain | 网格/地形 |

### 响应

```json
{
  "success": true,
  "data": {
    "uuid": "新节点的UUID"
  }
}
```

## remove-node

删除节点及其所有子节点（不可撤销），支持单个或批量删除。

```bash
# 删除单个节点
cocos-skills scene remove-node '{"uuid":"<节点UUID>"}'

# 批量删除多个节点
cocos-skills scene remove-node '{"uuid":["<节点UUID1>","<节点UUID2>"]}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string/array | 是 | 节点 UUID（单个字符串或 UUID 数组） |

## copy-node

复制节点到剪贴板。

```bash
cocos-skills scene copy-node <节点UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 要复制的节点 UUID |

## paste-node

粘贴剪贴板中的节点。

```bash
# 粘贴单个节点
cocos-skills scene paste-node '{"uuids":"节点UUID","target":"目标节点UUID"}'

# 粘贴多个节点
cocos-skills scene paste-node '{"uuids":["节点UUID1","节点UUID2"],"target":"目标节点UUID"}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuids | string/array | 是 | 要粘贴的节点 UUID（单个或数组） |
| target | string | 是 | 目标父节点 UUID |

## duplicate-node

快捷复制并粘贴（等同于 copy-node + paste-node）。

```bash
cocos-skills scene duplicate-node <节点UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 要复制的节点 UUID |

## cut-node

剪切节点到剪贴板。

```bash
cocos-skills scene cut-node <节点UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 要剪切的节点 UUID |

## set-parent

设置节点的父节点（移动节点），支持批量移动。

```bash
# 单个节点
cocos-skills scene set-parent '{"uuids":"节点UUID","parent":"父节点UUID"}'

# 多个节点
cocos-skills scene set-parent '{"uuids":["节点UUID1","节点UUID2"],"parent":"父节点UUID"}'

# 指定插入位置
cocos-skills scene set-parent '{"uuids":"节点UUID","parent":"父节点UUID","index":0}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuids | array | 是 | 要移动的节点 UUID 数组 |
| parent | string | 是 | 新父节点的 UUID |
| index | number | 否 | 插入位置（默认末尾） |

### 循环检测

系统会自动检测并阻止会形成循环引用的节点移动：
- 不能将父节点移动到其子节点下
- 检测到循环会抛出错误提示

## reset-node

重置节点变换为默认值。

```bash
cocos-skills scene reset-node <节点UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |

重置效果：
- position → (0, 0, 0)
- rotation → (0, 0, 0)
- scale → (1, 1, 1)

## restore-prefab

恢复预制体实例到原始状态。

```bash
cocos-skills scene restore-prefab <预制体UUID>
```

## 操作流程示例

```bash
# 1. 获取节点树，找到节点 UUID
cocos-skills scene query-node-tree

# 2. 创建节点
cocos-skills scene create-node '{"parent": "父UUID", "name": "MyNode"}'

# 3. 复制节点
cocos-skills scene copy-node <源节点UUID>

# 4. 粘贴节点
cocos-skills scene paste-node '{"uuids":"源节点UUID","target":"父节点UUID"}'

# 5. 保存场景
cocos-skills scene save-scene
```

## 注意事项

1. **修改后保存**：节点操作后必须调用 `save-scene`
2. **删除不可撤销**：`remove-node` 操作不可撤销
3. **UUID 获取**：节点 UUID 通过 `query-node-tree` 获取
4. **循环检测**：`set-parent` 会自动检测循环引用
