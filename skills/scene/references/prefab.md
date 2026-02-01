# 预制体 API 参考

预制体的恢复操作相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `restore-prefab` | 恢复预制体状态 |

---

## restore-prefab

将预制体实例恢复到原始状态。

```python
execute("scene", "restore-prefab", ["node-uuid"])
```

### 说明

当预制体实例被修改后，可以使用此 API 撤销所有修改，恢复到预制体资源的原始状态。

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| uuid | string | 预制体实例节点的 UUID |

### 返回值

```json
{
  "success": true,
  "data": {
    "restored": true  // 是否成功恢复
  }
}
```

### 使用场景

- 撤销对预制体实例的修改
- 同步预制体资源的最新更改
- 重置预制体到初始状态
