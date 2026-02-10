---
name: cocos-skills
description: Cocos Creator HTTP API CLI 工具。通过命令行自动化控制 Cocos Creator 编辑器，支持场景管理、资源操作、项目配置、构建、引擎查询等 13 个模块 150+ 操作。当需要通过命令行与 Cocos Creator 编辑器交互、自动化游戏开发流程、批量处理场景和资源时使用此技能。
---

# Cocos Skills

Cocos Creator HTTP API 命令行工具，用于自动化控制 Cocos Creator 编辑器。

## 核心原则

### 工作流程

标准操作流程：

```
1. 检查服务器状态 → 2. 执行模块操作 → 3. 验证结果
```

### 服务器配置

工具读取 `~/.cocos-http/cocos-http.json` 获取服务器 URL：

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

默认地址：`http://127.0.0.1:54321`

## 快速开始

```bash
# 检查服务器状态
cocos-skills health

# 查看所有模块
cocos-skills list-modules

# 查看模块帮助
cocos-skills scene -h

# 执行操作
cocos-skills scene open-scene db://assets/Main.scene
```

## 可用模块

| 模块 | 描述 | 命令 |
|------|------|------|
| **scene** | 场景管理 (53 操作) | `cocos-skills scene -h` |
| **asset-db** | 资源数据库 (22 操作) | `cocos-skills asset-db -h` |
| **project** | 项目设置 | `cocos-skills project -h` |
| **builder** | 构建工具 | `cocos-skills builder -h` |
| **engine** | 引擎信息 | `cocos-skills engine -h` |
| **preferences** | 偏好设置 | `cocos-skills preferences -h` |
| **programming** | 编程设置 | `cocos-skills programming -h` |
| **information** | 信息对话框 | `cocos-skills information -h` |
| **program** | 外部程序 | `cocos-skills program -h` |
| **server** | 服务器信息 | `cocos-skills server -h` |
| **device** | 设备查询 | `cocos-skills device -h` |
| **extension** | 扩展模板 | `cocos-skills extension -h` |

## 核心操作

详细文档：[references/](references/)

### 资源操作

**详细指南**: [asset-operations.md](references/asset-operations.md)

```bash
# 创建资源
cocos-skills asset-db create-asset db://assets/prefabs/Test.prefab

# 导入外部资源
cocos-skills asset-db import-asset db://assets/sprite.png "C:/path/to/image.png"

# 复制资源
cocos-skills asset-db copy-asset db://assets/Old.prefab db://assets/New.prefab

# 查询资源信息
cocos-skills asset-db query-asset-info db://assets/texture.png

# 查询资源使用情况
cocos-skills asset-db query-asset-users <uuid>
```

### 场景操作

**详细指南**: [scene-operations.md](references/scene-operations.md)

```bash
# 查询场景状态
cocos-skills scene query-is-ready

# 打开场景
cocos-skills scene open-scene db://assets/Main.scene

# 查询节点树
cocos-skills scene query-node-tree

# 保存场景
cocos-skills scene save-scene
```

### 节点操作

**详细指南**: [node-operations.md](references/node-operations.md)

```bash
# 创建节点
cocos-skills scene create-node '{"parent": "父节点UUID", "name": "ChildNode","type": "cc.Sprite"}'

# 复制节点（使用 UUID）
cocos-skills scene copy-node <节点UUID>

# 粘贴节点
cocos-skills scene paste-node '{"uuids":"节点UUID","target":"父节点UUID"}'

# 设置父节点
cocos-skills scene set-parent '{"uuids":"节点UUID","parent":"父节点UUID"}'

# 删除节点（使用 UUID）
cocos-skills scene remove-node '{"uuid":"节点UUID"}'

# 批量删除节点
cocos-skills scene remove-node '{"uuid":["节点UUID1","节点UUID2"]}'
```

### 组件操作

**详细指南**: [component-operations.md](references/component-operations.md)

```bash
# 添加组件
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Sprite"}'

# 移除组件
cocos-skills scene remove-component '{"uuid": "组件UUID"}'
```

### 属性操作

**详细指南**: [property-operations.md](references/property-operations.md)

```bash
# 设置节点位置
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "position", "dump": {"value": {"x":100,"y":0,"z":0}, "type": "cc.Vec3"}}'

# 设置精灵颜色
cocos-skills scene set-property '{"uuid": "节点UUID", "path": "__comps__.0._color", "dump": {"value": {"r":255,"g":0,"b":0,"a":255}, "type": "cc.Color"}}'

# 重置属性
cocos-skills scene reset-property '{"uuid": "节点UUID", "path": "position", "dump": null}'
```

## 响应格式

所有命令返回 JSON 格式：

```json
{
  "success": true,
  "data": { ... }
}
```

使用 `--json` (默认) 或 `--verbose` 控制输出格式。

## 路径格式

Cocos Creator 使用 `db://` 协议的路径：

| 类型 | 格式 |
|------|------|
| 场景文件 | `db://assets/scenes/Main.scene` |
| 预制体 | `db://assets/prefabs/Enemy.prefab` |
| 图片资源 | `db://assets/textures/sprite.png` |

## 注意事项

1. **参数格式**: JSON 参数需要用引号包裹
2. **节点 UUID**: 节点操作通常需要 UUID（从 query-node-tree 获取）
3. **场景保存**: 修改场景后记得执行 save-scene
4. **服务器连接**: 确保 Cocos Creator HTTP Server 已启动
5. **查看帮助**: 使用 `-h` 参数查看具体模块的详细帮助
