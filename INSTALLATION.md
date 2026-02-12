# Cocos Agent Skills 安装文档

本文档介绍如何将 Cocos Agent Skills 安装到 Claude Code，以便通过自然语言命令控制 Cocos Creator 编辑器。

---

## 前置要求

- **Node.js**: >= 18.0.0
- **Cocos Creator**: 已安装并运行 HTTP Server
- **cocos-skills-ext**: Cocos Creator cocos-skills-ext 扩展（必需）

---

## 安装方式

### Claude Code 安装

Claude Code 内置了 Plugin Marketplace 功能，可以直接从 GitHub 仓库安装技能。

#### 安装步骤

1. **在 Claude Code 中添加 Marketplace**

```text
/plugin marketplace add git@github.com:libovin/cocos-skills.git
```

2. **安装技能**

```text
/plugin install cocos-creator@cocos-creator-skills
```

3. **重启 Claude Code,验证测试**

```text
/cocos-skills
```

### Trae 安装

Trae 支持通过 GitHub 仓库直接安装自定义命令和工具。

#### 安装步骤

1. **打开 Trae 设置**

在 Trae 界面中点击设置图标，进入插件/扩展管理页面。

2. **克隆并安装**

```bash
# 克隆仓库
git clone https://github.com/libovin/cocos-skills.git

# 进入目录
cd cocos-skills

# 复制到 Trae skills 目录
cp -r skills/cocos-skills ~/.trae-cn/skills/
```

3. **重启 Trae**

重启后
在 设置-> 规则与技能 -> 技能 菜单下就能看 cocos-skills 开启即可使用；