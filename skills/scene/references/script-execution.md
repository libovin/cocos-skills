# 脚本执行 API 参考

场景脚本和热更新操作相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `execute-scene-script` | 执行场景脚本 |
| `soft-reload` | 软重载脚本 |

---

## execute-scene-script

在场景上下文中执行脚本代码。

```python
execute("scene", "execute-scene-script", ["cc.find('Canvas').getComponent(cc.Sprite).enabled = false"])
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| script | string | 要执行的脚本代码 |

### 返回值

```json
{
  "success": true,
  "data": {
    "result": "execution result"  // 脚本返回值
  }
}
```

---

## soft-reload

软重载所有脚本（热更新）。

```python
execute("scene", "soft-reload")
```

### 说明

软重载会重新加载所有脚本文件，但不会重置场景状态或丢失数据。适用于开发调试时的脚本修改。

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": {
    "reloaded": 5  // 重新加载的脚本数量
  }
}
```
