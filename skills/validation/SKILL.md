---
name: cocos-validation
description: Cocos Creator 验证技能。提供资源有效性验证、资源引用验证、重复资源查找等功能。当需要检查资源完整性、验证资源引用关系或清理重复资源时使用此技能。
---

# Cocos Creator 验证

提供 Cocos Creator 项目的资源验证功能，包括资源有效性检查、资源引用验证、重复资源查找等。

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [validate_asset](references/api-reference.md#validate_asset) | 验证资源是否存在且有效 | 资源有效性检查 |
| [validate_asset_references](references/api-reference.md#validate_asset_references) | 验证资源引用关系 | 引用完整性检查 |
| [find_duplicate_assets](references/api-reference.md#find_duplicate_assets) | 查找重复的资源文件 | 清理重复资源 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

## 使用示例

```python
from src.validation import (
    validate_asset,
    validate_asset_references,
    find_duplicate_assets
)

# 验证资源是否存在且有效
result = validate_asset(uuid="asset-uuid")
print(f"资源有效: {result['data']['valid']}")
print(f"资源类型: {result['data']['type']}")

# 验证资源引用关系
result = validate_asset_references(uuid="asset-uuid")
print(f"引用有效: {result['data']['valid']}")
print(f"被引用次数: {result['data']['referenceCount']}")
print(f"引用路径: {result['data']['referencePaths']}")

# 查找重复的资源
result = find_duplicate_assets()
print(f"找到 {len(result['data']['duplicates'])} 组重复资源")
for group in result['data']['duplicates']:
    print(f"  组: {group['hash']}")
    for asset in group['assets']:
        print(f"    - {asset['path']}")
```
