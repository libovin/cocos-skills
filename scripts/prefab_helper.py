#!/usr/bin/env python3
"""
Cocos Creator 预制体创建辅助工具（修复版）

提供创建预制体的便捷函数和模板，完全匹配 Cocos Creator 预制体格式。

使用方法:
    from scripts.prefab_helper import PrefabBuilder

    # 创建空白预制体
    builder = PrefabBuilder("MyPrefab")
    builder.add_transform(200, 200)
    builder.save("db://assets/prefabs/MyPrefab.prefab")

    # 创建带 Sprite 的预制体
    builder = PrefabBuilder("SpritePrefab")
    builder.add_transform(100, 100)
    builder.add_sprite()
    builder.save("db://assets/prefabs/SpritePrefab.prefab")
"""

import json
from typing import Any, Dict, List, Optional, Tuple
from client import execute


class PrefabBuilder:
    """
    Cocos Creator 预制体构建器（修复版）

    按照 Demo.prefab 的正确格式构建预制体。
    """

    # UI 层级
    LAYER_UI = 1073741824
    LAYER_2D = 33554432

    def __init__(self, name: str, node_name: Optional[str] = None, layer: int = None):
        """
        初始化预制体构建器

        Args:
            name: 预制体名称
            node_name: 根节点名称（默认与预制体名称相同）
            layer: 图层（默认 UI 层: 1073741824）
        """
        self.name = name
        self.node_name = node_name or name
        self.layer = layer or self.LAYER_UI
        self.items: List[Dict[str, Any]] = []
        self.comp_infos: List[Dict[str, Any]] = []
        self._init_root()

    def _init_root(self) -> None:
        """初始化预制体根对象和根节点"""
        # [0] - cc.Prefab 根对象（修复格式）
        self.items.append({
            "__type__": "cc.Prefab",
            "_name": self.name,
            "_objFlags": 0,
            "__editorExtras__": {},
            "_native": "",
            "data": {
                "__id__": 1
            },
            "optimizationPolicy": 0,
            "persistent": False
        })

        # [1] - cc.Node 根节点（修复格式）
        self.items.append({
            "__type__": "cc.Node",
            "_name": self.node_name,
            "_objFlags": 0,
            "__editorExtras__": {},
            "_parent": None,
            "_children": [],
            "_active": True,
            "_components": [],
            "_prefab": {
                "__id__": -1  # 稍后设置为 PrefabInfo 的索引
            },
            "_lpos": {
                "__type__": "cc.Vec3",
                "x": 0,
                "y": 0,
                "z": 0
            },
            "_lrot": {
                "__type__": "cc.Quat",
                "x": 0,
                "y": 0,
                "z": 0,
                "w": 1
            },
            "_lscale": {
                "__type__": "cc.Vec3",
                "x": 1,
                "y": 1,
                "z": 1
            },
            "_mobility": 0,
            "_layer": self.layer,
            "_euler": {
                "__type__": "cc.Vec3",
                "x": 0,
                "y": 0,
                "z": 0
            },
            "_id": ""
        })

    def _generate_file_id(self) -> str:
        """生成唯一的 fileId"""
        import random
        import string
        chars = string.ascii_letters + string.digits
        return ''.join(random.choices(chars, k=22))

    def _add_component(self, component_data: Dict[str, Any]) -> int:
        """
        添加组件到根节点

        Args:
            component_data: 组件数据

        Returns:
            组件在数组中的索引
        """
        comp_index = len(self.items)
        comp_info_index = len(self.items) + 1 + len(self.comp_infos)

        # 添加组件
        component_data.setdefault("_id", "")
        self.items.append(component_data)

        # 添加组件的 CompPrefabInfo
        comp_info = {
            "__type__": "cc.CompPrefabInfo",
            "fileId": self._generate_file_id()
        }
        self.comp_infos.append(comp_info)

        # 设置组件的 __prefab 引用
        component_data["__prefab"] = {
            "__id__": comp_info_index
        }

        # 添加到根节点的 components 列表
        node = self.items[1]
        node["_components"].append({
            "__id__": comp_index
        })

        return comp_index

    def add_transform(
        self,
        width: float = 100,
        height: float = 100,
        anchor_x: float = 0.5,
        anchor_y: float = 0.5
    ) -> 'PrefabBuilder':
        """
        添加 UITransform 组件

        Args:
            width: 宽度
            height: 高度
            anchor_x: 锚点 X
            anchor_y: 锚点 Y
        """
        transform = {
            "__type__": "cc.UITransform",
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": {
                "__id__": 1
            },
            "_enabled": True,
            "_contentSize": {
                "__type__": "cc.Size",
                "width": width,
                "height": height
            },
            "_anchorPoint": {
                "__type__": "cc.Vec2",
                "x": anchor_x,
                "y": anchor_y
            }
        }
        self._add_component(transform)
        return self

    def add_sprite(
        self,
        color: Optional[Dict[str, int]] = None,
        sprite_frame: Optional[str] = None
    ) -> 'PrefabBuilder':
        """
        添加 Sprite 组件

        Args:
            color: 颜色 {"r": 255, "g": 255, "b": 255, "a": 255}
            sprite_frame: 精灵帧 UUID（可选）
        """
        sprite = {
            "__type__": "cc.Sprite",
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": {
                "__id__": 1
            },
            "_enabled": True,
            "_customMaterial": None,
            "_srcBlendFactor": 2,
            "_dstBlendFactor": 4,
            "_color": color or {
                "__type__": "cc.Color",
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 255
            },
            "_spriteFrame": sprite_frame,
            "_type": 0,
            "_fillType": 0,
            "_sizeMode": 2,
            "_fillCenter": {
                "__type__": "cc.Vec2",
                "x": 0,
                "y": 0
            },
            "_fillStart": 0,
            "_fillRange": 0,
            "_isTrimmedMode": True,
            "_useGrayscale": False,
            "_atlas": None
        }
        self._add_component(sprite)
        return self

    def add_label(
        self,
        text: str = "Label",
        font_size: int = 40,
        color: Optional[Dict[str, int]] = None,
        line_height: Optional[int] = None
    ) -> 'PrefabBuilder':
        """
        添加 Label 组件

        Args:
            text: 文本内容
            font_size: 字体大小
            color: 颜色 {"r": 0, "g": 0, "b": 0, "a": 255}
            line_height: 行高（默认等于字体大小）
        """
        label = {
            "__type__": "cc.Label",
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": {
                "__id__": 1
            },
            "_enabled": True,
            "_customMaterial": None,
            "_srcBlendFactor": 2,
            "_dstBlendFactor": 4,
            "_color": color or {
                "__type__": "cc.Color",
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 255
            },
            "_string": text,
            "_horizontalAlign": 1,
            "_verticalAlign": 1,
            "_actualFontSize": font_size,
            "_fontSize": font_size,
            "_fontFamily": "Arial",
            "_lineHeight": line_height or font_size * 2,
            "_overflow": 0,
            "_enableWrapText": True,
            "_font": None,
            "_isSystemFontUsed": True,
            "_spacingX": 0,
            "_isItalic": False,
            "_isBold": False,
            "_isUnderline": False,
            "_underlineHeight": 2,
            "_cacheMode": 0,
            "_enableOutline": False,
            "_outlineColor": {
                "__type__": "cc.Color",
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 255
            },
            "_outlineWidth": 2,
            "_enableShadow": False,
            "_shadowColor": {
                "__type__": "cc.Color",
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 255
            },
            "_shadowOffset": {
                "__type__": "cc.Vec2",
                "x": 2,
                "y": 2
            },
            "_shadowBlur": 2
        }
        self._add_component(label)
        return self

    def add_widget(
        self,
        align_flags: int = 45,
        left: int = 0,
        right: int = 0,
        top: int = 0,
        bottom: int = 0
    ) -> 'PrefabBuilder':
        """
        添加 Widget 对齐组件

        Args:
            align_flags: 对齐标志位
                - 1: TOP
                - 2: BOTTOM
                - 4: LEFT
                - 8: RIGHT
                - 16: HORIZONTAL_CENTER
                - 32: VERTICAL_CENTER
                - 45: 四边对齐 (1+2+4+8+16+32)
            left: 左边距
            right: 右边距
            top: 上边距
            bottom: 下边距
        """
        widget = {
            "__type__": "cc.Widget",
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": {
                "__id__": 1
            },
            "_enabled": True,
            "_alignFlags": align_flags,
            "_target": None,
            "_left": left,
            "_right": right,
            "_top": top,
            "_bottom": bottom,
            "_horizontalCenter": 0,
            "_verticalCenter": 0,
            "_isAbsLeft": True,
            "_isAbsRight": True,
            "_isAbsTop": True,
            "_isAbsBottom": True,
            "_isAbsHorizontalCenter": True,
            "_isAbsVerticalCenter": True,
            "_originalWidth": 0,
            "_originalHeight": 0
        }
        self._add_component(widget)
        return self

    def add_button(self) -> 'PrefabBuilder':
        """
        添加 Button 组件
        """
        button = {
            "__type__": "cc.Button",
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": {
                "__id__": 1
            },
            "_enabled": True,
            "_clickEvents": [],
            "_interactable": True,
            "_transition": 2,
            "_normalColor": {
                "__type__": "cc.Color",
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 255
            },
            "_pressedColor": {
                "__type__": "cc.Color",
                "r": 200,
                "g": 200,
                "b": 200,
                "a": 255
            },
            "_hoverColor": {
                "__type__": "cc.Color",
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 255
            },
            "_disabledColor": {
                "__type__": "cc.Color",
                "r": 120,
                "g": 120,
                "b": 120,
                "a": 200
            },
            "_duration": 0.1,
            "_zoomScale": 1.2,
            "_target": None
        }
        self._add_component(button)
        return self

    def _finalize(self) -> List[Dict[str, Any]]:
        """
        完成预制体构建，添加所有 PrefabInfo

        Returns:
            完整的预制体数组
        """
        # 首先添加所有组件的 CompPrefabInfo
        for comp_info in self.comp_infos:
            self.items.append(comp_info)

        # 添加根节点的 PrefabInfo
        prefab_info_index = len(self.items)
        prefab_info = {
            "__type__": "cc.PrefabInfo",
            "root": {
                "__id__": 1
            },
            "asset": {
                "__id__": 0  # 指向 cc.Prefab
            },
            "fileId": self._generate_file_id(),
            "instance": None,
            "targetOverrides": None,
            "nestedPrefabInstanceRoots": None
        }
        self.items.append(prefab_info)

        # 更新根节点的 _prefab 引用
        self.items[1]["_prefab"] = {
            "__id__": prefab_info_index
        }

        return self.items

    def to_json(self, indent: int = 2) -> str:
        """
        转换为 JSON 字符串

        Args:
            indent: 缩进空格数

        Returns:
            JSON 字符串
        """
        self._finalize()
        return json.dumps(self.items, indent=indent, ensure_ascii=False)

    def save(self, url: str) -> Dict[str, Any]:
        """
        保存预制体到文件

        Args:
            url: 预制体路径，如 db://assets/prefabs/MyPrefab.prefab

        Returns:
            执行结果
        """
        # 生成可用 URL（避免冲突）
        url_result = execute("asset-db", "generate-available-url", [url])
        if url_result.get("success"):
            target_url = url_result.get("data", {}).get("availableUrl", url)
        else:
            target_url = url

        # 创建预制体
        content = self.to_json(indent=2)
        result = execute("asset-db", "create-asset", [target_url, content])

        # 刷新资源
        if result.get("success"):
            execute("asset-db", "refresh-asset", [target_url])

        return result


def create_empty_prefab(name: str, url: str, layer: int = None) -> Dict[str, Any]:
    """
    快捷函数：创建空白预制体

    Args:
        name: 预制体名称
        url: 保存路径
        layer: 图层（默认 UI 层）

    Returns:
        执行结果
    """
    return PrefabBuilder(name, layer=layer).add_transform(100, 100).save(url)


def create_sprite_prefab(
    name: str,
    url: str,
    width: float = 100,
    height: float = 100,
    color: Optional[Dict[str, int]] = None,
    layer: int = None
) -> Dict[str, Any]:
    """
    快捷函数：创建带 Sprite 的预制体

    Args:
        name: 预制体名称
        url: 保存路径
        width: 宽度
        height: 高度
        color: 颜色
        layer: 图层（默认 UI 层）

    Returns:
        执行结果
    """
    return (PrefabBuilder(name, layer=layer)
            .add_transform(width, height)
            .add_sprite(color)
            .save(url))


def create_label_prefab(
    name: str,
    url: str,
    text: str = "Label",
    font_size: int = 40,
    layer: int = None
) -> Dict[str, Any]:
    """
    快捷函数：创建带 Label 的预制体

    Args:
        name: 预制体名称
        url: 保存路径
        text: 文本内容
        font_size: 字体大小
        layer: 图层（默认 UI 层）

    Returns:
        执行结果
    """
    return (PrefabBuilder(name, layer=layer)
            .add_transform(200, 50)
            .add_label(text, font_size)
            .save(url))


def create_button_prefab(
    name: str,
    url: str,
    width: float = 150,
    height: float = 50,
    layer: int = None
) -> Dict[str, Any]:
    """
    快捷函数：创建带 Button 的预制体

    Args:
        name: 预制体名称
        url: 保存路径
        width: 宽度
        height: 高度
        layer: 图层（默认 UI 层）

    Returns:
        执行结果
    """
    return (PrefabBuilder(name, layer=layer)
            .add_transform(width, height)
            .add_sprite({"r": 100, "g": 150, "b": 200, "a": 255})
            .add_button()
            .save(url))


if __name__ == "__main__":
    # 示例：创建各种预制体

    print("=" * 60)
    print("  测试修复后的预制体创建")
    print("=" * 60)

    # 1. 空白预制体
    print("\n[1/5] 创建空白预制体...")
    result = create_empty_prefab("TestEmpty", "db://assets/prefabs/TestEmpty.prefab")
    print(f"  success: {result.get('success')}, invalid: {result.get('data', {}).get('invalid')}")

    # 2. Sprite 预制体
    print("\n[2/5] 创建 Sprite 预制体...")
    result = create_sprite_prefab("TestBox", "db://assets/prefabs/TestBox.prefab", 80, 80)
    print(f"  success: {result.get('success')}, invalid: {result.get('data', {}).get('invalid')}")

    # 3. Label 预制体
    print("\n[3/5] 创建 Label 预制体...")
    result = create_label_prefab("TestLabel", "db://assets/prefabs/TestLabel.prefab", "Hello", 32)
    print(f"  success: {result.get('success')}, invalid: {result.get('data', {}).get('invalid')}")

    # 4. Button 预制体
    print("\n[4/5] 创建 Button 预制体...")
    result = create_button_prefab("TestButton", "db://assets/prefabs/TestButton.prefab")
    print(f"  success: {result.get('success')}, invalid: {result.get('data', {}).get('invalid')}")

    # 5. 使用 Builder 自定义
    print("\n[5/5] 创建自定义预制体...")
    builder = PrefabBuilder("TestContainer")
    builder.add_transform(300, 200)
    builder.add_widget(align_flags=45)  # 四边对齐
    builder.add_sprite({"r": 50, "g": 50, "b": 50, "a": 255})
    result = builder.save("db://assets/prefabs/TestContainer.prefab")
    print(f"  success: {result.get('success')}, invalid: {result.get('data', {}).get('invalid')}")

    print("\n" + "=" * 60)
    print("  测试完成！")
    print("=" * 60)
