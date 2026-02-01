# 组件操作 API 参考

节点组件的创建、删除、查询和方法执行相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `create-component` | 创建组件 |
| `remove-component` | 移除组件 |
| `reset-component` | 重置组件 |
| `execute-component-method` | 执行组件方法 |
| `query-component` | 查询组件信息 |
| `query-components` | 查询组件列表 |
| `query-component-has-script` | 查询是否有脚本组件 |

---

## create-component

为节点添加新组件。

```python
execute("scene", "create-component", ["node-uuid", "cc.Sprite"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| component | string | 组件类名，如 "cc.Sprite"、"cc.Animation" |

### 常用组件

| 组件名 | 说明 |
|--------|------|
| cc.Sprite | 精灵组件 |
| cc.Animation | 动画组件 |
| cc.Label | 文本标签 |
| cc.UIButton | 按钮组件 |
| cc.Widget | 对齐组件 |
| RigidBody2D | 刚体组件 |
| BoxCollider2D | 盒碰撞器 |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "component-uuid",
    "type": "cc.Sprite"
  }
}
```

---

## remove-component

从节点移除组件。

```python
execute("scene", "remove-component", ["node-uuid", "component-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| componentUuid | string | 组件 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## reset-component

重置组件到默认状态。

```python
execute("scene", "reset-component", ["node-uuid", "component-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| componentUuid | string | 组件 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## execute-component-method

执行组件的方法。

```python
execute("scene", "execute-component-method", ["node-uuid", "component-uuid", "setEnabled", [true]])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| componentUuid | string | 组件 UUID |
| method | string | 方法名 |
| params | array | 方法参数数组 |

### 返回值

```json
{
  "success": true,
  "data": {
    "result": "method return value"
  }
}
```

---

## query-component

查询组件的详细信息。

```python
execute("scene", "query-component", ["node-uuid", "component-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| componentUuid | string | 组件 UUID |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "component-uuid",
    "type": "cc.Sprite",
    "props": {
      "spriteFrame": "uuid",
      "size": {"width": 100, "height": 100}
    }
  }
}
```

---

## query-components

查询节点的所有组件列表。

```python
execute("scene", "query-components", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": [
    {"uuid": "comp-1", "type": "cc.Sprite"},
    {"uuid": "comp-2", "type": "cc.Transform"},
    {"uuid": "comp-3", "type": "cc.UITransform"}
  ]
}
```

---

## query-component-has-script

查询节点是否有脚本组件。

```python
execute("scene", "query-component-has-script", ["node-uuid", "PlayerController"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| scriptName | string | 脚本类名 |

### 返回值

```json
{
  "success": true,
  "data": true  // true 表示存在该脚本组件
}
```
