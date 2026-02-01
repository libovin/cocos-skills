# 快照操作 API 参考

场景快照功能相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `snapshot` | 创建场景快照 |
| `snapshot-abort` | 中止快照 |

---

## snapshot

创建场景的快照记录。

```python
execute("scene", "snapshot")
```

### 说明

快照功能会记录当前场景的状态，可以在之后恢复到该状态。适用于保存编辑过程中的关键状态点。

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": {
    "snapshotId": "snapshot-uuid",
    "timestamp": 1234567890
  }
}
```

---

## snapshot-abort

中止当前快照操作。

```python
execute("scene", "snapshot-abort")
```

### 说明

中止快照会取消正在进行的快照创建或恢复操作。

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": null
}
```
