# 节点操作 API 参考

场景节点的创建、删除、复制和层级管理相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `create-node` | 创建节点 |
| `remove-node` | 删除节点 |
| `reset-node` | 重置节点 |
| `copy-node` | 复制节点 |
| `duplicate-node` | 快速复制节点 |
| `paste-node` | 粘贴节点 |
| `cut-node` | 剪切节点 |
| `set-parent` | 设置父节点 |

---

## create-node

创建新节点。

```python
execute("scene", "create-node", ["Canvas/NewNode"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| path | string | 节点路径，如 "Canvas/NewNode" |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "new-node-uuid",
    "name": "NewNode"
  }
}
```

---

## remove-node

删除指定节点。

```python
execute("scene", "remove-node", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## reset-node

重置节点到默认状态。

```python
execute("scene", "reset-node", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## copy-node

复制节点到剪贴板。

```python
execute("scene", "copy-node", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## duplicate-node

立即复制节点（不经过剪贴板）。

```python
execute("scene", "duplicate-node", ["node-uuid"])
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
    "uuid": "duplicated-node-uuid",
    "name": "Node (1)"
  }
}
```

---

## paste-node

粘贴剪贴板中的节点。

```python
execute("scene", "paste-node", ["parent-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| parentUuid | string | 父节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": {
    "uuid": "pasted-node-uuid"
  }
}
```

---

## cut-node

剪切节点到剪贴板。

```python
execute("scene", "cut-node", ["node-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```

---

## set-parent

设置节点的父节点。

```python
execute("scene", "set-parent", ["node-uuid", "parent-uuid"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 节点 UUID |
| parentUuid | string | 父节点 UUID |

### 返回值

```json
{
  "success": true,
  "data": null
}
```
