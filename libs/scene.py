"""
場景操作模組
"""

from .client import get_client


def get_current_scene(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取當前場景"""
    client = get_client(host, port)
    return client.execute("scene_get_current_scene")


def get_scene_list(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取場景列表"""
    client = get_client(host, port)
    return client.execute("scene_get_scene_list")


def open_scene(scene_path: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """打開場景"""
    client = get_client(host, port)
    return client.execute("scene_open_scene", {"scenePath": scene_path})


def save_scene(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """保存當前場景"""
    client = get_client(host, port)
    return client.execute("scene_save_scene")


def save_scene_as(path: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """另存為"""
    client = get_client(host, port)
    return client.execute("scene_save_scene_as", {"path": path})


def create_scene(scene_name: str, save_path: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """創建場景"""
    client = get_client(host, port)
    return client.execute("scene_create_scene", {"sceneName": scene_name, "savePath": save_path})


def close_scene(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """關閉場景"""
    client = get_client(host, port)
    return client.execute("scene_close_scene")


def get_scene_hierarchy(include_components: bool = False, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取場景層級"""
    client = get_client(host, port)
    return client.execute("scene_get_scene_hierarchy", {"includeComponents": include_components})
