---
name: cocos-scene-view
description: Cocos Creator 场景视图技能。提供 Gizmo 工具、视图模式、网格显示、摄像机控制等功能。当需要控制场景编辑器视图、调整 Gizmo 工具、切换 2D/3D 模式或控制摄像机时使用此技能。
---

# Cocos Creator 场景视图

提供 Cocos Creator 编辑器场景视图的完整控制功能，包括 Gizmo 工具选择、视图模式切换、网格显示、摄像机控制等。

## 可用操作

### Gizmo 工具
| [change_gizmo_tool](references/api-reference.md#change_gizmo_tool) | 切换 Gizmo 工具 | 工具选择 |
| [query_gizmo_tool_name](references/api-reference.md#query_gizmo_tool_name) | 查询当前 Gizmo 工具 | 工具查询 |

### 变换轴心点
| [change_gizmo_pivot](references/api-reference.md#change_gizmo_pivot) | 切换变换轴心点 | 轴心点切换 |
| [query_gizmo_pivot](references/api-reference.md#query_gizmo_pivot) | 查询当前轴心点 | 轴心点查询 |

### 坐标系
| [change_gizmo_coordinate](references/api-reference.md#change_gizmo_coordinate) | 切换坐标系 | 坐标系切换 |
| [query_gizmo_coordinate](references/api-reference.md#query_gizmo_coordinate) | 查询当前坐标系 | 坐标系查询 |

### 视图模式
| [change_view_mode_2d_3d](references/api-reference.md#change_view_mode_2d_3d) | 切换 2D/3D 视图模式 | 视图模式切换 |
| [query_view_mode_2d_3d](references/api-reference.md#query_view_mode_2d_3d) | 查询当前视图模式 | 视图模式查询 |

### 网格设置
| [set_grid_visible](references/api-reference.md#set_grid_visible) | 设置网格可见性 | 网格显示控制 |
| [query_grid_visible](references/api-reference.md#query_grid_visible) | 查询网格可见性 | 网格状态查询 |

### Icon Gizmo
| [set_icon_gizmo_3d](references/api-reference.md#set_icon_gizmo_3d) | 设置 IconGizmo 为 3D/2D 模式 | IconGizmo 模式 |
| [query_icon_gizmo_3d](references/api-reference.md#query_icon_gizmo_3d) | 查询 IconGizmo 模式 | 模式查询 |
| [set_icon_gizmo_size](references/api-reference.md#set_icon_gizmo_size) | 设置 IconGizmo 大小 | 大小设置 |
| [query_icon_gizmo_size](references/api-reference.md#query_icon_gizmo_size) | 查询 IconGizmo 大小 | 大小查询 |

### 摄像机控制
| [focus_camera_on_nodes](references/api-reference.md#focus_camera_on_nodes) | 将摄像机聚焦到节点 | 摄像机聚焦 |
| [align_camera_with_view](references/api-reference.md#align_camera_with_view) | 将摄像机与当前视图对齐 | 摄像机对齐 |
| [align_view_with_node](references/api-reference.md#align_view_with_node) | 将视图与选中节点对齐 | 视图对齐 |

### 场景视图管理
| [get_scene_view_status](references/api-reference.md#get_scene_view_status) | 获取场景视图状态 | 状态查询 |
| [reset_scene_view](references/api-reference.md#reset_scene_view) | 重置场景视图 | 视图重置 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

## 使用示例

```python
from src.scene_view import (
    change_gizmo_tool,
    query_gizmo_tool_name,
    change_gizmo_pivot,
    query_gizmo_pivot,
    change_gizmo_coordinate,
    query_gizmo_coordinate,
    change_view_mode_2d_3d,
    query_view_mode_2d_3d,
    set_grid_visible,
    query_grid_visible,
    set_icon_gizmo_3d,
    query_icon_gizmo_3d,
    set_icon_gizmo_size,
    query_icon_gizmo_size,
    focus_camera_on_nodes,
    align_camera_with_view,
    align_view_with_node,
    get_scene_view_status,
    reset_scene_view
)

# 切换 Gizmo 工具
result = change_gizmo_tool(name="position")
print(f"工具已切换: {result['message']}")

# 查询当前工具
result = query_gizmo_tool_name()
print(f"当前工具: {result['data']['currentTool']}")

# 切换轴心点
result = change_gizmo_pivot(name="center")
print(f"轴心点已切换: {result['message']}")

# 切换坐标系
result = change_gizmo_coordinate(type="local")
print(f"坐标系已切换: {result['message']}")

# 查询当前坐标系
result = query_gizmo_coordinate()
print(f"当前坐标系: {result['data']['coordinate']}")

# 切换到 2D 模式
result = change_view_mode_2d_3d(is2D=True)
print(f"视图模式: {result['message']}")

# 查询当前视图模式
result = query_view_mode_2d_3d()
print(f"当前模式: {result['data']['viewMode']}")

# 显示网格
result = set_grid_visible(visible=True)
print(f"网格状态: {result['message']}")

# 查询网格可见性
result = query_grid_visible()
print(f"网格可见: {result['data']['visible']}")

# 设置 IconGizmo 为 3D 模式
result = set_icon_gizmo_3d(is3D=True)
print(f"IconGizmo 模式: {result['message']}")

# 查询 IconGizmo 模式
result = query_icon_gizmo_3d()
print(f"IconGizmo 模式: {result['data']['mode']}")

# 设置 IconGizmo 大小
result = set_icon_gizmo_size(size=24)
print(f"IconGizmo 大小: {result['message']}")

# 查询 IconGizmo 大小
result = query_icon_gizmo_size()
print(f"IconGizmo 大小: {result['data']['size']}")

# 聚焦摄像机到节点
result = focus_camera_on_nodes(uuids=["node-uuid-1", "node-uuid-2"])
print(f"聚焦状态: {result['message']}")

# 将摄像机与视图对齐
result = align_camera_with_view()
print(f"对齐状态: {result['message']}")

# 将视图与节点对齐
result = align_view_with_node()
print(f"对齐状态: {result['message']}")

# 获取完整的场景视图状态
result = get_scene_view_status()
print(f"完整状态: {result['data']}")

# 重置场景视图
result = reset_scene_view()
print(f"重置状态: {result['message']}")
```
