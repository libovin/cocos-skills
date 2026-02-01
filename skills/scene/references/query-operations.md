# 查询操作 API 参考

节点和类的查询功能相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `query-node` | 查询节点信息 |
| `query-node-tree` | 查询节点树 |
| `query-nodes-by-asset-uuid` | 按资源 UUID 查询节点 |
| `query-classes` | 查询可用类列表 |

---

## query-node

查询节点的详细信息。

```python
execute("scene", "query-node", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "node-uuid",
    "name": "Canvas",
    "parent": "parent-uuid",
    "children": ["child-1", "child-2"],
    "components": ["comp-1", "comp-2"],
    "props": {
      "position": {"x": 0, "y": 0, "z": 0},
      "scale": {"x": 1, "y": 1, "z": 1},
      "active": true
    }
  }
}
```

---

## query-node-tree

查询场景的完整节点树结构。

```python
execute("scene", "query-node-tree")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "scene-uuid",
    "name": "Scene",
    "children": [
      {
        "uuid": "canvas-uuid",
        "name": "Canvas",
        "children": [
          {"uuid": "node-1", "name": "Node1", "children": []},
          {"uuid": "node-2", "name": "Node2", "children": []}
        ]
      }
    ]
  }
}
```

---

## query-nodes-by-asset-uuid

查询所有使用指定资源的节点。

```python
execute("scene", "query-nodes-by-asset-uuid", ["asset-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| assetUuid | string | 资源 UUID |

### 返回值

```json
{
  "success": true,
  "data": [
    {"uuid": "node-1", "name": "Sprite1"},
    {"uuid": "node-2", "name": "Sprite2"}
  ]
}
```

---

## query-classes

查询可实例化的类列表。

```python
execute("scene", "query-classes")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": [
    "cc.Node",
    "cc.Sprite",
    "cc.Label",
    "cc.Animation",
    "cc.ParticleSystem",
    "cc.TiledMap",
    "cc.VideoPlayer",
    "cc.WebView"
  ]
}
```
