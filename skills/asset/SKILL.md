---
name: cocos-asset
description: Cocos Creator 资源管理技能。提供资源元数据管理、批量导入/删除、纹理压缩、资源清单导出等功能。当需要管理游戏资源、处理资源引用、批量操作资源文件或导出资源清单时使用此技能。
---

# Cocos Creator 资源管理

提供 Cocos Creator 编辑器资源管理的完整功能，包括资源元数据操作、批量资源处理、纹理压缩、资源清单导出等功能。

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [save_asset_meta](references/api-reference.md#save_asset_meta) | 保存资源元数据 | 资源元数据管理 |
| [generate_available_url](references/api-reference.md#generate_available_url) | 生成可用资源 URL | 新资源创建 |
| [query_asset_db_ready](references/api-reference.md#query_asset_db_ready) | 查询资源数据库就绪状态 | 连接检查 |
| [open_asset_external](references/api-reference.md#open_asset_external) | 使用外部程序打开资源 | 外部编辑 |
| [batch_import_assets](references/api-reference.md#batch_import_assets) | 批量导入资源 | 资源批量导入 |
| [batch_delete_assets](references/api-reference.md#batch_delete_assets) | 批量删除资源 | 资源批量删除 |
| [validate_asset_references](references/api-reference.md#validate_asset_references) | 验证资源引用 | 引用完整性检查 |
| [get_asset_dependencies](references/api-reference.md#get_asset_dependencies) | 获取资源依赖关系 | 依赖分析 |
| [get_unused_assets](references/api-reference.md#get_unused_assets) | 查找未使用的资源 | 清理优化 |
| [compress_textures](references/api-reference.md#compress_textures) | 批量压缩纹理资源 | 存储优化 |
| [export_asset_manifest](references/api-reference.md#export_asset_manifest) | 导出资源清单 | 资源清点 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md) |
**资源路径格式**: 参见 [资源路径格式](references/asset-path-format.md)

## 使用示例

```python
from src.asset import (
    save_asset_meta,
    generate_available_url,
    query_asset_db_ready,
    batch_import_assets,
    batch_delete_assets,
    validate_asset_references,
    compress_textures,
    export_asset_manifest
)

# 查询资源数据库就绪状态
result = query_asset_db_ready()
print(f"资源数据库就绪: {result}")

# 生成可用 URL
result = generate_available_url("db://assets/newTexture.png")
print(f"可用 URL: {result['data']['availableUrl']}")

# 批量导入资源
result = batch_import_assets(
    source_directory="/path/to/source",
    target_directory="db://assets/textures",
    file_filter=[".png", ".jpg"],
    recursive=True,
    overwrite=False
)
print(f"导入成功: {result['data']['successCount']} 个文件")

# 批量删除资源
result = batch_delete_assets(urls=[
    "db://assets/textures/old1.png",
    "db://assets/textures/old2.png"
])
print(f"删除成功: {result['data']['successCount']} 个文件")

# 验证资源引用
result = validate_asset_references(directory="db://assets")
print(f"损坏引用数: {result['data']['brokenReferences']}")

# 压缩纹理
result = compress_textures(
    directory="db://assets/textures",
    format="webp",
    quality=0.8
)
print(f"压缩完成: {result}")

# 导出资源清单
result = export_asset_manifest(
    directory="db://assets",
    format="json",
    include_metadata=True
)
print(f"清单已导出: {result['data']}")
```
