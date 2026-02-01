---
name: cocos-skill
description: Cocos Creator 自动化操作技能包。通过 HTTP 协议与 Cocos Creator 编辑器通信，提供场景管理、构建工具、资源管理、配置管理等完整功能。当需要通过 Claude Code 操作 Cocos Creator 场景、构建项目、管理资源或自动化游戏开发流程时使用此技能包。
---

# Cocos Creator Skill

Cocos Creator 自动化操作技能包，提供与 Cocos Creator 编辑器 HTTP 服务器的完整通信接口。

## 功能概述

此技能包包含以下子技能，与 VALID_MODULES 定义的模块一一对应：

| 子技能 | 对应模块 | 功能 | 使用场景 |
|--------|----------|------|----------|
| [cocos-asset-db](skills/asset-db/SKILL.md) | asset-db | 资源数据库管理 | 资源的创建、导入、复制、移动、删除、查询 |
| [cocos-builder](skills/builder/SKILL.md) | builder | 构建工具管理 | 打开构建面板、查询构建 worker 状态 |
| [cocos-device](skills/device/SKILL.md) | device | 设备信息查询 | 查询连接的设备信息 |
| [cocos-engine](skills/engine/SKILL.md) | engine | 引擎信息查询 | 查询引擎信息和版本 |
| [cocos-extension](skills/extension/SKILL.md) | extension | 扩展管理 | 创建扩展模板 |
| [cocos-information](skills/information/SKILL.md) | information | 信息面板管理 | 查询信息、打开/关闭信息对话框 |
| [cocos-preferences](skills/preferences/SKILL.md) | preferences | 偏好设置管理 | 打开设置、查询和修改配置 |
| [cocos-program](skills/program/SKILL.md) | program | 程序管理 | 查询程序信息、打开程序、打开 URL |
| [cocos-programming](skills/programming/SKILL.md) | programming | 编程设置 | 查询共享设置和插件列表 |
| [cocos-project](skills/project/SKILL.md) | project | 项目管理 | 打开项目设置、查询和修改项目配置 |
| [cocos-scene](skills/scene/SKILL.md) | scene | 场景管理 | 场景的打开、保存、关闭、节点和组件操作 |
| [cocos-server](skills/server/SKILL.md) | server | 服务器管理 | 查询 IP 列表和端口信息 |

## 快速开始

### 连接测试

```python
from scripts.client import health_check
health_check()
```

### 场景操作

```python
from scripts.client import execute

# 获取当前场景
execute("scene", "query-is-ready")

# 打开场景
execute("scene", "open-scene", ["db://assets/scenes/Main.scene"])

# 查询节点树
execute("scene", "query-node-tree")
```

### API 使用模式

所有模块操作都使用统一的 API:

```python
from scripts.client import execute

# 基本语法
execute("模块名", "操作名", [参数1, 参数2, ...])

# 示例：资源数据库操作
execute("asset-db", "create-asset", ["db://assets/data/config.json", '{"key": "value"}'])
execute("asset-db", "query-asset-info", ["db://assets/textures/hero.png"])

# 示例：场景操作
execute("scene", "create-node", ["Canvas/NewNode"])
execute("scene", "set-property", ["node-uuid", "position", {"x": 100, "y": 100}])

# 示例：项目配置
execute("project", "open-settings")
execute("project", "query-config", ["general"])
```

## 项目结构

```
cocos-skill/
├── SKILL.md                           # 本文件
├── skills/
│   ├── asset-db/                      # 资源数据库 (asset-db)
│   ├── builder/                       # 构建工具 (builder)
│   ├── device/                        # 设备信息 (device)
│   ├── engine/                        # 引擎信息 (engine)
│   ├── extension/                     # 扩展管理 (extension)
│   ├── information/                   # 信息面板 (information)
│   ├── preferences/                   # 偏好设置 (preferences)
│   ├── program/                       # 程序管理 (program)
│   ├── programming/                   # 编程设置 (programming)
│   ├── project/                       # 项目管理 (project)
│   ├── scene/                         # 场景管理 (scene)
│   └── server/                        # 服务器管理 (server)
└── scripts/
    └── client.py                      # HTTP 客户端
```

## 全局函数

| 函数 | 功能 | 使用场景 |
|------|------|----------|
| `health_check()` | 健康检查 | 连接诊断 |
| `get_status()` | 获取状态 | 状态查询 |
| `get_modules()` | 获取模块列表 | API 探索 |
| `get_module_actions(module)` | 获取模块操作 | 操作查询 |
| `execute(module, action, params)` | 执行 API 调用 | 通用执行器 |

## 连接配置

客户端会自动从 `~/.cocos-http/cocos-http.json` 读取服务器配置：

```json
{
  "currentProject": "project-name",
  "projects": {
    "project-name": {
      "serverUrl": "http://127.0.0.1:54321"
    }
  }
}
```

默认连接地址：`http://127.0.0.1:54321`

## 依赖项

- Python 3.8+
- urllib (标准库)
