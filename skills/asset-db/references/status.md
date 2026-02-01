# 状态查询 API 参考

资源数据库状态查询相关 API。

## API 列表

| API | 功能 |
|-----|------|
| `query-ready` | 查询资源数据库就绪状态 |

---

## query-ready

查询资源数据库是否就绪可操作。

```python
execute("asset-db", "query-ready")
```

### 参数

无参数

### 返回值

```json
{
  "success": true,
  "data": true  // true 表示资源数据库就绪
}
```

### 使用场景

- 资源操作前进行连接检查
- 确认资源数据库可用性
- 自动化脚本中的状态验证
