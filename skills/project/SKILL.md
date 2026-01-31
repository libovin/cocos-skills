---
name: cocos-project
description: Cocos Creator 项目管理技能。提供项目运行、构建、资源管理、资产操作等功能。当需要运行游戏预览、构建发布版本、管理项目资源或操作资产文件时使用此技能。
---

# Cocos Creator 项目管理

提供 Cocos Creator 项目的完整管理功能，包括项目运行、构建、资源管理、资产操作等。

## 可用操作

### 项目运行与构建
| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [run_project](references/api-reference.md#run_project) | 运行项目预览 | 游戏测试 |
| [build_project](references/api-reference.md#build_project) | 构建项目 | 发布版本 |
| [get_build_settings](references/api-reference.md#get_build_settings) | 获取构建设置 | 构建配置 |
| [open_build_panel](references/api-reference.md#open_build_panel) | 打开构建面板 | UI 交互 |
| [check_builder_status](references/api-reference.md#check_builder_status) | 检查构建器状态 | 构建监控 |
| [start_preview_server](references/api-reference.md#start_preview_server) | 启动预览服务器 | 预览服务 |
| [stop_preview_server](references/api-reference.md#stop_preview_server) | 停止预览服务器 | 停止服务 |

### 项目信息
| [get_project_info](references/api-reference.md#get_project_info) | 获取项目信息 | 项目信息 |
| [get_project_settings](references/api-reference.md#get_project_settings) | 获取项目设置 | 设置查询 |

### 资源数据库
| [refresh_assets](references/api-reference.md#refresh_assets) | 刷新资源数据库 | 资源同步 |
| [import_asset](references/api-reference.md#import_asset) | 导入资源文件 | 资源导入 |
| [get_asset_info](references/api-reference.md#get_asset_info) | 获取资源信息 | 资源查询 |
| [get_assets](references/api-reference.md#get_assets) | 获取资源列表 | 资源浏览 |

### 资源操作
| [create_asset](references/api-reference.md#create_asset) | 创建新资源 | 资源创建 |
| [copy_asset](references/api-reference.md#copy_asset) | 复制资源 | 资源复制 |
| [move_asset](references/api-reference.md#move_asset) | 移动资源 | 资源移动 |
| [delete_asset](references/api-reference.md#delete_asset) | 删除资源 | 资源删除 |
| [save_asset](references/api-reference.md#save_asset) | 保存资源 | 资源保存 |
| [reimport_asset](references/api-reference.md#reimport_asset) | 重新导入资源 | 资源刷新 |

### 资源查询
| [query_asset_path](references/api-reference.md#query_asset_path) | 查询资源路径 | 路径转换 |
| [query_asset_uuid](references/api-reference.md#query_asset_uuid) | 查询资源 UUID | UUID 查询 |
| [query_asset_url](references/api-reference.md#query_asset_url) | 查询资源 URL | URL 查询 |
| [find_asset_by_name](references/api-reference.md#find_asset_by_name) | 按名称查找资源 | 名称搜索 |
| [get_asset_details](references/api-reference.md#get_asset_details) | 获取资源详细信息 | 详细信息 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

## 使用示例

```python
from src.project import (
    run_project,
    build_project,
    get_project_info,
    get_project_settings,
    refresh_assets,
    import_asset,
    get_asset_info,
    get_assets,
    get_build_settings,
    open_build_panel,
    check_builder_status,
    start_preview_server,
    stop_preview_server,
    create_asset,
    copy_asset,
    move_asset,
    delete_asset,
    save_asset,
    reimport_asset,
    query_asset_path,
    query_asset_uuid,
    query_asset_url,
    find_asset_by_name,
    get_asset_details
)

# 获取项目信息
result = get_project_info()
print(f"项目名称: {result['data']['name']}")
print(f"项目路径: {result['data']['path']}")
print(f"Cocos 版本: {result['data']['cocosVersion']}")

# 获取项目设置
result = get_project_settings(category="general")
print(f"项目设置: {result['data']}")

# 刷新资源
result = refresh_assets(folder="db://assets/textures")
print(f"刷新成功: {result['success']}")

# 导入资源
result = import_asset(
    source_path="/path/to/image.png",
    target_folder="db://assets/textures"
)
print(f"资源 UUID: {result['data']['uuid']}")

# 获取资源信息
result = get_asset_info(asset_path="db://assets/textures/hero.png")
print(f"资源信息: {result['data']}")

# 获取资源列表
result = get_assets(type="texture", folder="db://assets")
print(f"纹理数量: {len(result['data']['assets'])}")

# 打开构建面板
result = open_build_panel()
print(f"打开成功: {result['success']}")

# 构建项目
result = build_project(platform="web-mobile", debug=True)
print(f"构建结果: {result['data']['message']}")

# 创建资源
result = create_asset(
    url="db://assets/data/config.json",
    content='{"key": "value"}',
    overwrite=False
)
print(f"创建成功: {result['success']}")

# 复制资源
result = copy_asset(
    source="db://assets/textures/old.png",
    target="db://assets/textures/new.png",
    overwrite=False
)
print(f"复制成功: {result['success']}")

# 移动资源
result = move_asset(
    source="db://assets/textures/old.png",
    target="db://assets/backup/old.png",
    overwrite=True
)
print(f"移动成功: {result['success']}")

# 删除资源
result = delete_asset(url="db://assets/temp/temp.png")
print(f"删除成功: {result['success']}")

# 保存资源
result = save_asset(
    url="db://assets/data/config.json",
    content='{"key": "new value"}'
)
print(f"保存成功: {result['success']}")

# 重新导入资源
result = reimport_asset(url="db://assets/textures/hero.png")
print(f"重新导入成功: {result['success']}")

# 查询资源路径
result = query_asset_path(url="db://assets/textures/hero.png")
print(f"磁盘路径: {result['data']['path']}")

# 查询资源 UUID
result = query_asset_uuid(url="db://assets/textures/hero.png")
print(f"UUID: {result['data']['uuid']}")

# 查询资源 URL
result = query_asset_url(uuid="xxx-xxx-xxx")
print(f"URL: {result['data']['url']}")

# 按名称查找资源
result = find_asset_by_name(
    name="hero",
    exact_match=False,
    asset_type="texture",
    max_results=10
)
print(f"找到资源: {len(result['data']['assets'])} 个")

# 获取资源详细信息
result = get_asset_details(
    asset_path="db://assets/sprites/player.plist",
    include_sub_assets=True
)
print(f"资源详细: {result['data']}")
```
