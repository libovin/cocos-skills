---
name: cocos-skill
description: Cocos Creator 自动化操作技能包。通过 HTTP 协议与 Cocos Creator 编辑器通信，提供场景管理、节点操作、预制体处理、组件管理等完整功能。当需要通过 Claude Code 操作 Cocos Creator 场景、编辑节点属性、管理预制体或自动化游戏开发流程时使用此技能包。
---

# Cocos Creator Skill

Cocos Creator 自动化操作技能包，提供与 Cocos Creator 编辑器 HTTP 服务器的完整通信接口。

## 功能概述

此技能包包含以下子技能：

| 子技能 | 功能 | 使用场景 |
|--------|------|----------|
| [cocos-architecture](skills/architecture/SKILL.md) | 架构知识 | 理解场景、节点、组件、预制体关系 |
| [cocos-server](skills/server/SKILL.md) | 服务器连接管理 | 检查连接、获取状态、列出工具 |
| [cocos-scene](skills/scene/SKILL.md) | 场景管理 | 打开、关闭、保存场景，查询层级 |
| [cocos-node](skills/node/SKILL.md) | 节点操作 | 创建、查询、修改、删除节点 |
| [cocos-prefab](skills/prefab/SKILL.md) | 预制体管理 | 实例化、创建、应用修改 |
| [cocos-component](skills/component/SKILL.md) | 组件管理 | 添加、移除、设置组件属性 |
| [cocos-asset](skills/asset/SKILL.md) | 资源管理 | 批量导入/删除、纹理压缩、资源清单导出 |
| [cocos-broadcast](skills/broadcast/SKILL.md) | 广播消息监听 | 监听编辑器事件、记录广播日志 |
| [cocos-debug](skills/debug/SKILL.md) | 调试工具 | 控制台日志、脚本执行、性能监控 |
| [cocos-preferences](skills/preferences/SKILL.md) | 偏好设置 | 配置查询与修改、导出导入 |
| [cocos-project](skills/project/SKILL.md) | 项目管理 | 运行、构建、资源管理 |
| [cocos-validation](skills/validation/SKILL.md) | 验证工具 | 资源有效性验证、重复资源查找 |
| [cocos-scene-view](skills/scene-view/SKILL.md) | 场景视图控制 | Gizmo 工具、视图模式、摄像机控制 |
| [cocos-scene-advanced](skills/scene-advanced/SKILL.md) | 高级场景操作 | 属性重置、剪贴板、Undo/Redo |
| [cocos-reference-image](skills/reference-image/SKILL.md) | 参考图管理 | 参考图位置、视口控制、节点追踪 |

## 快速开始

### 连接测试

```python
from libs.client import health_check
health_check()
```

### 场景操作

```python
from libs.client import execute_tool

# 获取当前场景
execute_tool("scene_get_current")

# 打开场景
execute_tool("scene_open", {"uuid": "db://assets/scenes/Main.scene"})

# 获取层级结构
execute_tool("scene_get_hierarchy", {"dump": True})
```

## 项目结构

```
cocos-skill/
├── SKILL.md                           # 本文件
├── skills/
│   ├── architecture/                  # 架构知识
│   │   └── SKILL.md
│   ├── server/                        # 服务器管理
│   ├── scene/                         # 场景管理
│   │   └── references/
│   │       └── hierarchy-structure.md # 节点层级结构
│   ├── node/                          # 节点操作
│   ├── prefab/                        # 预制体管理
│   ├── component/                     # 组件管理
│   │   └── references/
│   │       └── component-types.md     # 组件类型参考
│   ├── asset/                         # 资源管理
│   │   └── references/
│   │       └── asset-path-format.md   # 资源路径格式
│   ├── broadcast/                     # 广播消息监听
│   ├── debug/                         # 调试工具
│   ├── preferences/                   # 偏好设置
│   ├── project/                       # 项目管理
│   ├── validation/                    # 验证工具
│   ├── scene-view/                    # 场景视图控制
│   ├── scene-advanced/                # 高级场景操作
│   └── reference-image/               # 参考图管理
└── libs/                              # Python 库模块
    ├── client.py                      # HTTP 客户端
    ├── node.py                        # 节点操作
    └── component.py                   # 组件操作
```

## 依赖项

- Python 3.8+
- urllib (标准库)
