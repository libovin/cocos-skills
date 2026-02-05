"""
Cocos Creator 自动场景管理模块
提供场景的打开、节点创建和保存功能，支持嵌套节点路径
"""

from typing import Any, Dict, List, Optional

from client import execute


# ============================================================================
# 场景管理功能
# ============================================================================


def open_scene(scene_path: str) -> bool:
    """
    打开指定路径的场景文件

    Args:
        scene_path: 场景文件路径，格式如 "db://assets/scenes/Main.scene"

    Returns:
        成功返回 True，失败返回 False
    """
    try:
        result = execute("scene", "open-scene", [scene_path])
        return result.get("success", False)
    except Exception:
        return False


def create_node(
    scene: str, node_path: str, properties: Optional[Dict[str, Any]] = None
) -> str:
    """
    在指定场景中创建节点，支持嵌套路径

    自动创建路径中所有不存在的父节点。例如 "Canvas/UI/Header/Title"
    会依次创建 Canvas、UI、Header、Title 四个节点。

    Args:
        scene: 场景文件路径，如 "db://assets/scenes/Main.scene"
        node_path: 节点路径，如 "Canvas/UI/Header/Title"
        properties: 要设置的节点属性，如 {"name": "Title", "active": True}

    Returns:
        成功返回最后创建节点的 UUID，失败返回空字符串 ""
    """
    if properties is None:
        properties = {}

    try:
        # 打开场景
        open_result = execute("scene", "open-scene", [scene])
        if not open_result.get("success"):
            return ""

        # 分割节点路径
        path_parts = node_path.strip("/").split("/")
        current_path = ""

        # 依次创建每个层级的节点
        for part in path_parts:
            if not part:
                continue

            current_path = f"{current_path}/{part}" if current_path else part

            # 创建节点
            create_result = execute("scene", "create-node", [current_path])

            if not create_result.get("success"):
                return ""

            # 如果是最后一个节点，应用属性
            if part == path_parts[-1] and properties:
                node_uuid = create_result.get("data", {}).get("__id__")
                if node_uuid:
                    for prop_name, prop_value in properties.items():
                        execute(
                            "scene", "set-property", [node_uuid, prop_name, prop_value]
                        )

            # 返回最后一个创建的节点 UUID
            if part == path_parts[-1]:
                node_uuid = create_result.get("data", {}).get("__id__")
                return node_uuid if node_uuid else ""

        return ""

    except Exception:
        return ""


def save_scene() -> bool:
    """
    保存当前场景

    Returns:
        成功返回 True，失败返回 False
    """
    try:
        result = execute("scene", "save-scene")
        return result.get("success", False)
    except Exception:
        return False
