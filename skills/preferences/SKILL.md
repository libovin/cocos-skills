---
name: cocos-preferences
description: Cocos Creator 偏好设置技能。提供偏好设置面板打开、配置查询与修改、导出导入等功能。当需要管理编辑器偏好设置、修改配置参数或备份恢复设置时使用此技能。
---

# Cocos Creator 偏好设置

提供 Cocos Creator 编辑器偏好设置的管理功能，包括设置面板打开、配置查询与修改、导出导入等。

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [open_preferences_settings](references/api-reference.md#open_preferences_settings) | 打开偏好设置面板 | UI 交互 |
| [query_preferences_config](references/api-reference.md#query_preferences_config) | 查询偏好设置配置 | 配置读取 |
| [set_preferences_config](references/api-reference.md#set_preferences_config) | 设置偏好配置 | 配置修改 |
| [get_all_preferences](references/api-reference.md#get_all_preferences) | 获取所有可用偏好类别 | 配置探索 |
| [reset_preferences](references/api-reference.md#reset_preferences) | 重置偏好设置为默认值 | 恢复默认 |
| [export_preferences](references/api-reference.md#export_preferences) | 导出当前偏好配置 | 配置备份 |
| [import_preferences](references/api-reference.md#import_preferences) | 从文件导入偏好配置 | 配置恢复 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

## 使用示例

```python
from src.preferences import (
    open_preferences_settings,
    query_preferences_config,
    set_preferences_config,
    get_all_preferences,
    reset_preferences,
    export_preferences,
    import_preferences
)

# 打开偏好设置面板
result = open_preferences_settings(tab="external-tools")
print(f"打开成功: {result['success']}")

# 查询特定配置
result = query_preferences_config(name="general", path="language", type="global")
print(f"配置值: {result['data']['config']}")

# 设置配置
result = set_preferences_config(
    name="general",
    path="language",
    value="zh-CN",
    type="global"
)
print(f"设置成功: {result['success']}")

# 获取所有偏好设置
result = get_all_preferences()
print(f"可用类别: {result['data']['categories']}")

# 重置特定类别
result = reset_preferences(name="general", type="global")
print(f"重置成功: {result['success']}")

# 导出偏好设置
result = export_preferences(export_path="/path/to/preferences.json")
print(f"导出数据: {result['data']['jsonData']}")

# 导入偏好设置
result = import_preferences(import_path="/path/to/preferences.json")
print(f"导入成功: {result['success']}")
```
