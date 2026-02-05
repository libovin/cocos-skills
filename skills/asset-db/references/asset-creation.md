# 资源创建与导入 API 参考

创建新资源或导入外部资源文件到项目中的相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `create-asset` | 创建新资源 |
| `import-asset` | 导入资源文件 |
| `generate-available-url` | 生成可用资源 URL |

---

## create-asset

创建新的资源文件。

```python
execute("asset-db", "create-asset", ["db://assets/data/config.json", '{"key": "value"}'])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 资源路径，格式：db://assets/xxx |
| content | string | 资源内容（JSON 字符串） |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "new-asset-uuid",
    "url": "db://assets/data/config.json"
  }
}
```

### 使用场景

- 创建 JSON 配置文件
- 创建文本数据文件
- 动态生成游戏资源

---

## import-asset

从外部文件导入资源到项目中。

```python
execute("asset-db", "import-asset", ["/path/to/file.png", "db://assets/textures"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| sourcePath | string | 源文件路径 |
| targetDirectory | string | 目标目录 |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "imported-asset-uuid",
    "url": "db://assets/textures/file.png"
  }
}
```

### 使用场景

- 导入美术资源（图片、音频等）
- 批量导入外部素材
- 复制外部文件到项目

---

## generate-available-url

生成可用的资源 URL（用于创建新资源时避免文件名冲突）。

```python
execute("asset-db", "generate-available-url", ["db://assets/newTexture.png"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | 期望的资源 URL |

### 返回值

```json
{
  "success": true,
  "data": {
    "availableUrl": "db://assets/newTexture (1).png"
  }
}
```

### 说明

当目标 URL 已存在时，系统会自动生成带数字后缀的可用 URL。

### 使用场景

- 创建新资源前检查文件名冲突
- 自动生成唯一文件名
- 批量创建资源文件

---

## 预制体创建指南

### 预制体格式说明

Cocos Creator 的预制体（.prefab）文件使用**数组格式**，而不是单个 JSON 对象。这是创建预制体时必须遵守的重要规则。

### 格式对比

**❌ 错误格式（单个对象）**
```json
{
  "__type__": "cc.Prefab",
  "_name": "MyPrefab",
  "data": {
    "__type__": "cc.Node",
    ...
  }
}
```

**✓ 正确格式（数组）**
```json
[
  {
    "__type__": "cc.Prefab",
    "_name": "MyPrefab",
    "data": {
      "__id__": 1
    }
  },
  {
    "__type__": "cc.Node",
    "_name": "MyNode",
    ...
  }
]
```

### 数组结构说明

预制体数组中的每个对象通过 `__id__` 相互引用：

| 索引 | 类型 | 说明 |
|------|------|------|
| [0] | cc.Prefab | 预制体根对象 |
| [1] | cc.Node | 根节点 |
| [2+] | cc.Component | 节点组件 |
| [N] | cc.PrefabInfo | 预制体信息 |

### 空白预制体模板（正确格式）

最简单的预制体（仅包含一个空节点）：

```json
[
  {
    "__type__": "cc.Prefab",
    "_name": "EmptyPrefab",
    "_objFlags": 0,
    "__editorExtras__": {},
    "_native": "",
    "data": {
      "__id__": 1
    },
    "optimizationPolicy": 0,
    "persistent": false
  },
  {
    "__type__": "cc.Node",
    "_name": "EmptyNode",
    "_objFlags": 0,
    "__editorExtras__": {},
    "_parent": null,
    "_children": [],
    "_active": true,
    "_components": [
      {
        "__id__": 2
      }
    ],
    "_prefab": {
      "__id__": 4
    },
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": 0,
      "y": 0,
      "z": 0,
      "w": 1
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_mobility": 0,
    "_layer": 1073741824,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    },
    "_id": ""
  },
  {
    "__type__": "cc.UITransform",
    "_name": "",
    "_objFlags": 0,
    "__editorExtras__": {},
    "node": {
      "__id__": 1
    },
    "_enabled": true,
    "_contentSize": {
      "__type__": "cc.Size",
      "width": 100,
      "height": 100
    },
    "_anchorPoint": {
      "__type__": "cc.Vec2",
      "x": 0.5,
      "y": 0.5
    },
    "_id": "",
    "__prefab": {
      "__id__": 3
    }
  },
  {
    "__type__": "cc.CompPrefabInfo",
    "fileId": "transform-file-id"
  },
  {
    "__type__": "cc.PrefabInfo",
    "root": {
      "__id__": 1
    },
    "asset": {
      "__id__": 0
    },
    "fileId": "prefab-file-id",
    "instance": null,
    "targetOverrides": null,
    "nestedPrefabInstanceRoots": null
  }
]
```

**关键格式要点**：

1. **cc.Prefab 根对象**：
   - `_native: ""` - 必须字段
   - `optimizationPolicy: 0` - 优化策略
   - ~~`asyncLoadAssets`~~ - 不需要此字段

2. **cc.Node**：
   - `_id: ""` - 节点 ID（空字符串）
   - `_layer: 1073741824` - UI 层（2D 层为 33554432）

3. **组件**：
   - `_id: ""` - 组件 ID
   - `__prefab: {"__id__": N}` - 指向 cc.CompPrefabInfo

4. **cc.CompPrefabInfo**：
   - 每个组件都需要一个 CompPrefabInfo
   - `fileId` - 22 位随机字符串

5. **cc.PrefabInfo**：
   - `asset: {"__id__": 0}` - 指向 cc.Prefab
   - `targetOverrides: null` - 目标覆盖
   - `nestedPrefabInstanceRoots: null` - 嵌套预制体实例根节点

### 带子节点的预制体

包含子节点的预制体示例（如 Tile 预制体）：

```json
[
  {
    "__type__": "cc.Prefab",
    "_name": "Tile",
    "data": {
      "__id__": 1
    }
  },
  {
    "__type__": "cc.Node",
    "_name": "Tile",
    "_children": [
      {
        "__id__": 2
      }
    ],
    "_components": [
      {
        "__id__": 3
      },
      {
        "__id__": 4
      }
    ],
    "_prefab": {
      "__id__": 6
    }
  },
  {
    "__type__": "cc.Node",
    "_name": "Label",
    "_parent": {
      "__id__": 1
    },
    "_children": [],
    "_components": [
      {
        "__id__": 5
      }
    ]
  },
  {
    "__type__": "cc.UITransform",
    "node": {
      "__id__": 1
    },
    "_contentSize": {
      "__type__": "cc.Size",
      "width": 80,
      "height": 80
    }
  },
  {
    "__type__": "cc.Sprite",
    "node": {
      "__id__": 1
    }
  },
  {
    "__type__": "cc.Label",
    "node": {
      "__id__": 2
    }
  },
  {
    "__type__": "cc.PrefabInfo",
    "root": {
      "__id__": 1
    }
  }
]
```

### 创建预制体步骤

1. **检查文件名冲突**
   ```python
   execute("asset-db", "generate-available-url", ["db://assets/prefabs/NewPrefab.prefab"])
   ```

2. **准备预制体内容**（数组格式）
   ```python
   prefab_content = json.dumps([
     { "__type__": "cc.Prefab", ... },
     { "__type__": "cc.Node", ... },
     ...
   ], indent=2)
   ```

3. **创建预制体文件**
   ```python
   execute("asset-db", "create-asset", ["db://assets/prefabs/NewPrefab.prefab", prefab_content])
   ```

4. **刷新资源数据库**
   ```python
   execute("asset-db", "refresh-asset", ["db://assets/prefabs/NewPrefab.prefab"])
   ```

### 常用组件类型

| 组件类型 | 用途 |
|----------|------|
| cc.UITransform | UI 变换（尺寸、锚点） |
| cc.Sprite | 精灵渲染 |
| cc.Label | 文本标签 |
| cc.Widget | UI 对齐布局 |
| cc.Button | 按钮交互 |
| cc.Layout | 布局容器 |
| cc ScrollView | 滚动视图 |

### 注意事项

1. **必须使用数组格式** - 预制体文件必须是 JSON 数组，不是对象
2. **__id__ 引用** - 使用 `{"__id__": N}` 引用数组中的其他元素
3. **PrefabInfo** - 数组最后一个元素通常是 `cc.PrefabInfo`
4. **组件关联** - 组件的 `node` 属性必须正确指向所属节点
5. **刷新资源** - 创建后调用 `refresh-asset` 使编辑器识别新预制体
6. **组件的 __prefab** - 每个组件的 `__prefab` 必须指向 `cc.CompPrefabInfo`，不能为 `null`
7. **正确的字段** - 使用 `optimizationPolicy` 和 `_native`，而不是 `asyncLoadAssets`
8. **推荐使用辅助工具** - 使用 `scripts/prefab_helper.py` 中的 `PrefabBuilder` 类来自动生成正确格式的预制体

### 推荐工具

为了避免手动创建预制体时出现格式错误，建议使用预制体辅助工具：

```python
from scripts.prefab_helper import PrefabBuilder

# 创建预制体
builder = PrefabBuilder("MyPrefab")
builder.add_transform(200, 200)
builder.add_sprite()
builder.save("db://assets/prefabs/MyPrefab.prefab")
```

辅助工具会自动处理：
- 正确的数组格式
- CompPrefabInfo 生成
- __id__ 引用关联
- 所有必需字段
