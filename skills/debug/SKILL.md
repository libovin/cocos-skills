---
name: cocos-debug
description: Cocos Creator 调试技能。提供控制台日志、脚本执行、节点树查看、性能统计、场景验证等功能。当需要查看控制台输出、执行调试脚本、分析性能问题或验证场景状态时使用此技能。
---

# Cocos Creator 调试

提供 Cocos Creator 编辑器的调试功能，包括控制台日志、脚本执行、性能监控、场景验证等。

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [get_console_logs](references/api-reference.md#get_console_logs) | 获取编辑器控制台日志 | 查看日志 |
| [clear_console](references/api-reference.md#clear_console) | 清除控制台 | 清理日志 |
| [execute_script](references/api-reference.md#execute_script) | 在场景上下文中执行 JavaScript | 动态测试 |
| [get_node_tree](references/api-reference.md#get_node_tree) | 获取节点树用于调试 | 场景结构分析 |
| [get_performance_stats](references/api-reference.md#get_performance_stats) | 获取性能统计信息 | 性能分析 |
| [validate_scene](references/api-reference.md#validate_scene) | 验证当前场景问题 | 场景健康检查 |
| [get_editor_info](references/api-reference.md#get_editor_info) | 获取编辑器和环境信息 | 环境诊断 |
| [get_project_logs](references/api-reference.md#get_project_logs) | 获取项目日志 | 日志分析 |
| [get_log_file_info](references/api-reference.md#get_log_file_info) | 获取项目日志文件信息 | 日志文件管理 |
| [search_project_logs](references/api-reference.md#search_project_logs) | 在项目日志中搜索特定模式 | 问题追踪 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

## 使用示例

```python
from src.debug import (
    get_console_logs,
    clear_console,
    execute_script,
    get_node_tree,
    get_performance_stats,
    validate_scene,
    get_editor_info,
    get_project_logs,
    get_log_file_info,
    search_project_logs
)

# 获取控制台日志
result = get_console_logs(limit=100, filter="error")
print(f"错误日志: {result['data']['logs']}")

# 清除控制台
result = clear_console()
print(f"清除成功: {result['success']}")

# 执行脚本
result = execute_script("console.log('Hello from script!')")
print(f"执行结果: {result['data']['result']}")

# 获取节点树
result = get_node_tree(root_uuid="xxx", max_depth=3)
print(f"节点树: {result['data']}")

# 获取性能统计
result = get_performance_stats()
print(f"节点数: {result['data']['nodeCount']}")
print(f"组件数: {result['data']['componentCount']}")
print(f"Draw Calls: {result['data']['drawCalls']}")

# 验证场景
result = validate_scene(check_missing_assets=True, check_performance=True)
print(f"场景有效: {result['data']['valid']}")
print(f"问题数量: {result['data']['issueCount']}")

# 获取编辑器信息
result = get_editor_info()
print(f"编辑器版本: {result['data']['editor']['version']}")

# 获取项目日志
result = get_project_logs(lines=100, filter_keyword="error", log_level="ERROR")
print(f"日志行数: {len(result['data']['logs'])}")

# 搜索日志
result = search_project_logs(pattern="TypeError", max_results=10, context_lines=3)
print(f"匹配结果: {result['data']['results']}")
```
