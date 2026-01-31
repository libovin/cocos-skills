---
name: cocos-reference-image
description: Cocos Creator 参考图技能。提供参考图管理、坐标获取、视口控制、节点追踪等功能。当需要使用参考图辅助场景编辑、调整视图或追踪节点位置时使用此技能。
---

# Cocos Creator 参考图

提供 Cocos Creator 编辑器参考图功能的管理，包括屏幕坐标获取、视口控制、节点追踪、位置设置等。

## 可用操作

### 屏幕位置与视口
| [get_reference_image_screen_position](references/api-reference.md#get_reference_image_screen_position) | 获取参考图在屏幕上的位置 | 位置查询 |
| [get_reference_image_viewport](references/api-reference.md#get_reference_image_viewport) | 获取参考图视口 | 视口查询 |
| [set_reference_image_viewport](references/api-reference.md#set_reference_image_viewport) | 设置参考图视口 | 视口设置 |

### 可见性与锁定
| [set_reference_image_visible](references/api-reference.md#set_reference_image_visible) | 设置参考图可见性 | 可见性控制 |
| [get_reference_image_visible](references/api-reference.md#get_reference_image_visible) | 查询参考图可见性 | 可见性查询 |
| [get_reference_image_locked](references/api-reference.md#get_reference_image_locked) | 查询参考图是否锁定 | 锁定状态查询 |
| [set_reference_image_locked](references/api-reference.md#set_reference_image_locked) | 设置参考图锁定状态 | 锁定控制 |

### 摄像机偏移
| [get_reference_image_camera_offset](references/api-reference.md#get_reference_image_camera_offset) | 获取摄像机偏移 | 偏移查询 |
| [set_reference_image_camera_offset](references/api-reference.md#set_reference_image_camera_offset) | 设置摄像机偏移 | 偏移设置 |

### 节点追踪
| [get_reference_image_nodes](references/api-reference.md#get_reference_image_nodes) | 获取追踪的节点 | 追踪节点查询 |
| [set_reference_image_nodes](references/api-reference.md#set_reference_image_nodes) | 设置追踪的节点 | 追踪节点设置 |

### 位置控制
| [get_reference_image_position](references/api-reference.md#get_reference_image_position) | 获取参考图位置 | 位置查询 |
| [set_reference_image_position](references/api-reference.md#set_reference_image_position) | 设置参考图位置 | 位置设置 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

## 使用示例

```python
from src.reference_image import (
    get_reference_image_screen_position,
    get_reference_image_viewport,
    set_reference_image_viewport,
    set_reference_image_visible,
    get_reference_image_visible,
    get_reference_image_camera_offset,
    set_reference_image_camera_offset,
    get_reference_image_nodes,
    set_reference_image_nodes,
    get_reference_image_position,
    set_reference_image_position,
    get_reference_image_locked,
    set_reference_image_locked
)

# 获取参考图屏幕位置
result = get_reference_image_screen_position()
print(f"屏幕位置: {result['data']['position']}")

# 获取视口
result = get_reference_image_viewport()
print(f"视口: {result['data']['viewport']}")

# 设置视口
result = set_reference_image_viewport(x=0, y=0, width=1920, height=1080)
print(f"视口已设置: {result['message']}")

# 显示参考图
result = set_reference_image_visible(visible=True)
print(f"可见性: {result['message']}")

# 查询可见性
result = get_reference_image_visible()
print(f"可见: {result['data']['visible']}")

# 获取摄像机偏移
result = get_reference_image_camera_offset()
print(f"摄像机偏移: {result['data']['offset']}")

# 设置摄像机偏移
result = set_reference_image_camera_offset(x=100, y=50)
print(f"偏移已设置: {result['message']}")

# 获取追踪的节点
result = get_reference_image_nodes()
print(f"追踪的节点: {result['data']['nodes']}")

# 设置追踪的节点
result = set_reference_image_nodes(uuids=["node-uuid-1", "node-uuid-2"])
print(f"节点已设置: {result['message']}")

# 获取参考图位置
result = get_reference_image_position()
print(f"位置: {result['data']['position']}")

# 设置参考图位置
result = set_reference_image_position(x=100, y=200)
print(f"位置已设置: {result['message']}")

# 查询锁定状态
result = get_reference_image_locked()
print(f"已锁定: {result['data']['locked']}")

# 锁定参考图
result = set_reference_image_locked(locked=True)
print(f"锁定状态: {result['message']}")
```
