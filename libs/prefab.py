"""
預製體操作模組
"""

from .client import get_client


def get_prefab_list(folder: str = "db://assets", host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取預製體列表"""
    client = get_client(host, port)
    return client.execute("prefab_get_list", {"folder": folder})


def load_prefab(prefab_path: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """載入預製體資源"""
    client = get_client(host, port)
    return client.execute("prefab_load", {"prefabPath": prefab_path})


def get_prefab_info(prefab_path: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取預製體信息"""
    client = get_client(host, port)
    return client.execute("prefab_get_prefab_info", {"prefabPath": prefab_path})


def instantiate_prefab(
    prefab_path: str,
    parent_uuid: str = None,
    position: dict = None,
    name: str = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """實例化預製體"""
    args = {"prefabPath": prefab_path}
    if parent_uuid:
        args["parentUuid"] = parent_uuid
    if position:
        args["position"] = position
    if name:
        args["name"] = name

    client = get_client(host, port)
    return client.execute("prefab_instantiate", args)


def create_prefab(
    node_uuid: str,
    save_path: str,
    prefab_name: str = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """創建預製體"""
    args = {"nodeUuid": node_uuid, "savePath": save_path}
    if prefab_name:
        args["prefabName"] = prefab_name

    client = get_client(host, port)
    return client.execute("prefab_create", args)


def update_prefab(
    prefab_path: str,
    node_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """更新預製體"""
    client = get_client(host, port)
    return client.execute("prefab_update", {
        "prefabPath": prefab_path,
        "nodeUuid": node_uuid
    })


def apply_prefab(node_uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """應用預製體"""
    client = get_client(host, port)
    return client.execute("prefab_apply", {"nodeUuid": node_uuid})


def revert_prefab(node_uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """還原預製體"""
    client = get_client(host, port)
    return client.execute("prefab_revert", {"nodeUuid": node_uuid})


def unlink_prefab(node_uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """解除預製體連結"""
    client = get_client(host, port)
    return client.execute("prefab_unlink", {"nodeUuid": node_uuid})


def validate_prefab(prefab_path: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """驗證預製體"""
    client = get_client(host, port)
    return client.execute("prefab_validate", {"prefabPath": prefab_path})


def duplicate_prefab(
    source_path: str,
    target_path: str,
    new_name: str = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """複製預製體"""
    args = {"sourcePrefabPath": source_path, "targetPrefabPath": target_path}
    if new_name:
        args["newPrefabName"] = new_name

    client = get_client(host, port)
    return client.execute("prefab_duplicate", args)


def restore_prefab_node(
    node_uuid: str,
    asset_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """恢復預製體節點"""
    client = get_client(host, port)
    return client.execute("prefab_restore", {
        "nodeUuid": node_uuid,
        "assetUuid": asset_uuid
    })
