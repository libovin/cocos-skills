---
name: cocos-scene-advanced
description: Cocos Creator 高级场景技能。提供节点属性重置、数组操作、剪贴板、Undo/Redo、场景快照等功能。当需要进行高级场景操作、重置节点属性、管理剪贴板或录制 Undo 操作时使用此技能。
---

# Cocos Creator 高级场景

提供 Cocos Creator 编辑器的高级场景操作功能，包括节点属性重置、数组元素操作、剪贴板管理、Undo/Redo 录制、场景快照等。

## 可用操作

### 属性重置
| [reset_node_property](references/api-reference.md#reset_node_property) | 重置节点属性为默认值 | 属性重置 |
| [reset_node_transform](references/api-reference.md#reset_node_transform) | 重置节点变换 | 变换重置 |
| [reset_component](references/api-reference.md#reset_component) | 重置组件为默认值 | 组件重置 |

### 数组操作
| [move_array_element](references/api-reference.md#move_array_element) | 移动数组元素位置 | 数组重排 |
| [remove_array_element](references/api-reference.md#remove_array_element) | 移除指定索引的数组元素 | 数组编辑 |

### 剪贴板操作
| [copy_node](references/api-reference.md#copy_node) | 复制节点以供粘贴操作 | 节点复制 |
| [paste_node](references/api-reference.md#paste_node) | 粘贴之前复制的节点 | 节点粘贴 |
| [cut_node](references/api-reference.md#cut_node) | 剪切节点 | 节点剪切 |

### 组件执行
| [execute_component_method](references/api-reference.md#execute_component_method) | 执行组件上的方法 | 组件方法调用 |
| [execute_scene_script](references/api-reference.md#execute_scene_script) | 执行场景脚本方法 | 脚本执行 |

### 场景快照
| [scene_snapshot](references/api-reference.md#scene_snapshot) | 创建场景状态快照 | 快照创建 |
| [scene_snapshot_abort](references/api-reference.md#scene_snapshot_abort) | 中止场景快照创建 | 快照中止 |

### Undo 操作
| [begin_undo_recording](references/api-reference.md#begin_undo_recording) | 开始录制 Undo 数据 | Undo 开始 |
| [end_undo_recording](references/api-reference.md#end_undo_recording) | 结束录制 Undo 数据 | Undo 结束 |
| [cancel_undo_recording](references/api-reference.md#cancel_undo_recording) | 取消 Undo 录制 | Undo 取消 |

### 场景查询
| [soft_reload_scene](references/api-reference.md#soft_reload_scene) | 软加载当前场景 | 场景重载 |
| [query_scene_ready](references/api-reference.md#query_scene_ready) | 查询场景是否就绪 | 就绪检查 |
| [query_scene_dirty](references/api-reference.md#query_scene_dirty) | 查询场景是否有未保存的更改 | 修改检查 |
| [query_scene_classes](references/api-reference.md#query_scene_classes) | 查询所有已注册的类 | 类列表查询 |
| [query_scene_components](references/api-reference.md#query_scene_components) | 查询可用的场景组件 | 组件列表查询 |
| [query_component_has_script](references/api-reference.md#query_component_has_script) | 检查组件是否有脚本 | 脚本检查 |
| [query_nodes_by_asset_uuid](references/api-reference.md#query_nodes_by_asset_uuid) | 查找使用特定资源 UUID 的节点 | 资源引用查询 |
| [restore_prefab](references/api-reference.md#restore_prefab) | 从资源恢复预制体实例 | 预制体恢复 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

## 使用示例

```python
from src.scene_advanced import (
    reset_node_property,
    move_array_element,
    remove_array_element,
    copy_node,
    paste_node,
    cut_node,
    reset_node_transform,
    reset_component,
    restore_prefab,
    execute_component_method,
    execute_scene_script,
    scene_snapshot,
    scene_snapshot_abort,
    begin_undo_recording,
    end_undo_recording,
    cancel_undo_recording,
    soft_reload_scene,
    query_scene_ready,
    query_scene_dirty,
    query_scene_classes,
    query_scene_components,
    query_component_has_script,
    query_nodes_by_asset_uuid
)

# 重置节点属性
result = reset_node_property(uuid="node-uuid", path="position")
print(f"重置结果: {result['message']}")

# 移动数组元素
result = move_array_element(
    uuid="node-uuid",
    path="__comps__",
    target=0,
    offset=1
)
print(f"移动结果: {result['message']}")

# 移除数组元素
result = remove_array_element(
    uuid="node-uuid",
    path="__comps__",
    index=2
)
print(f"移除结果: {result['message']}")

# 复制节点
result = copy_node(uuids=["node-uuid-1", "node-uuid-2"])
print(f"复制的 UUID: {result['data']['copiedUuids']}")

# 粘贴节点
result = paste_node(
    target="parent-node-uuid",
    uuids=["copied-uuid-1"],
    keep_world_transform=False
)
print(f"粘贴的新 UUID: {result['data']['newUuids']}")

# 剪切节点
result = cut_node(uuids=["node-uuid"])
print(f"剪切的 UUID: {result['data']['cutUuids']}")

# 重置节点变换
result = reset_node_transform(uuid="node-uuid")
print(f"重置结果: {result['message']}")

# 重置组件
result = reset_component(uuid="component-uuid")
print(f"重置结果: {result['message']}")

# 恢复预制体
result = restore_prefab(
    node_uuid="prefab-instance-uuid",
    asset_uuid="prefab-asset-uuid"
)
print(f"恢复结果: {result['message']}")

# 执行组件方法
result = execute_component_method(
    uuid="component-uuid",
    name="play",
    args=["animation-name"]
)
print(f"执行结果: {result['data']}")

# 执行场景脚本
result = execute_scene_script(
    name="my-plugin",
    method="myMethod",
    args=["arg1", "arg2"]
)
print(f"执行结果: {result['data']}")

# 创建场景快照
result = scene_snapshot()
print(f"快照 ID: {result['data']['snapshotId']}")

# 中止快照
result = scene_snapshot_abort()
print(f"中止结果: {result['message']}")

# 开始 Undo 录制
result = begin_undo_recording(node_uuid="node-uuid")
print(f"Undo ID: {result['data']['undoId']}")

# 结束 Undo 录制
result = end_undo_recording(undo_id="undo-uuid")
print(f"录制完成: {result['message']}")

# 取消 Undo 录制
result = cancel_undo_recording(undo_id="undo-uuid")
print(f"取消结果: {result['message']}")

# 软加载场景
result = soft_reload_scene()
print(f"重载结果: {result['message']}")

# 查询场景就绪状态
result = query_scene_ready()
print(f"场景就绪: {result['data']['ready']}")

# 查询场景是否有未保存的更改
result = query_scene_dirty()
print(f"有未保存更改: {result['data']['dirty']}")

# 查询所有注册的类
result = query_scene_classes(extends="cc.Component")
print(f"类数量: {len(result['data']['classes'])}")

# 查询可用的场景组件
result = query_scene_components()
print(f"组件数量: {len(result['data']['components'])}")

# 检查组件是否有脚本
result = query_component_has_script(class_name="PlayerController")
print(f"有脚本: {result['data']['hasScript']}")

# 按资源 UUID 查找节点
result = query_nodes_by_asset_uuid(asset_uuid="texture-uuid")
print(f"找到的节点: {result['data']['nodes']}")
```
