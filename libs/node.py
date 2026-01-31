"""
節點操作模塊
"""

from typing import Optional
from .client import get_client


def create_node(
    name: str,
    parent_uuid: str = None,
    position: dict = None,
    rotation: dict = None,
    scale: dict = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """創建節點"""
    args = {"name": name}
    if parent_uuid:
        args["parentUuid"] = parent_uuid
    if position:
        args["position"] = position
    if rotation:
        args["rotation"] = rotation
    if scale:
        args["scale"] = scale

    client = get_client(host, port)
    return client.execute("node_create", args)


def get_node_info(uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取節點信息"""
    client = get_client(host, port)
    return client.execute("node_get_node_info", {"uuid": uuid})


def find_nodes(pattern: str, exact_match: bool = False, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """查找節點"""
    client = get_client(host, port)
    return client.execute("node_find_nodes", {"pattern": pattern, "exactMatch": exact_match})


def find_node_by_name(name: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """按名稱查找節點"""
    client = get_client(host, port)
    return client.execute("node_find_node_by_name", {"name": name})


def get_all_nodes(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取所有節點"""
    client = get_client(host, port)
    return client.execute("node_get_all_nodes")


def set_node_property(
    uuid: str,
    property: str,
    value: any,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """設置節點屬性"""
    client = get_client(host, port)
    return client.execute("node_set_node_property", {"uuid": uuid, "property": property, "value": value})


def set_node_transform(
    uuid: str,
    position: dict = None,
    rotation: dict = None,
    scale: dict = None,
    space: str = "world",
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """設置節點變換"""
    args = {"uuid": uuid, "space": space}
    if position:
        args["position"] = position
    if rotation:
        args["rotation"] = rotation
    if scale:
        args["scale"] = scale

    client = get_client(host, port)
    return client.execute("node_set_node_transform", args)


def delete_node(uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """刪除節點"""
    client = get_client(host, port)
    return client.execute("node_delete", {"uuid": uuid})


def move_node(node_uuid: str, new_parent_uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """移動節點"""
    client = get_client(host, port)
    return client.execute("node_move", {"nodeUuid": node_uuid, "newParentUuid": new_parent_uuid})


def duplicate_node(
    uuid: str,
    include_children: bool = True,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """複製節點"""
    client = get_client(host, port)
    return client.execute("node_duplicate", {"uuid": uuid, "includeChildren": include_children})


def detect_node_type(uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """檢測節點類型"""
    client = get_client(host, port)
    return client.execute("node_detect_node_type", {"uuid": uuid})
