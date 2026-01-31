"""
組件操作模塊
"""

from .client import get_client


def add_component(
    uuid: str,
    component_type: str = None,
    script_name: str = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """添加組件"""
    args = {"uuid": uuid}
    if component_type:
        args["componentType"] = component_type
    if script_name:
        args["scriptName"] = script_name

    client = get_client(host, port)
    return client.execute("component_add", args)


def remove_component(
    uuid: str,
    component_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """移除組件"""
    client = get_client(host, port)
    return client.execute("component_remove", {"uuid": uuid, "componentUuid": component_uuid})


def get_components(uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取組件列表"""
    client = get_client(host, port)
    return client.execute("component_get_components", {"uuid": uuid})


def get_component_info(
    uuid: str,
    component_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """獲取組件信息"""
    client = get_client(host, port)
    return client.execute("component_get_component_info", {"uuid": uuid, "componentUuid": component_uuid})


def set_component_property(
    uuid: str,
    component_uuid: str,
    property: str,
    value: any = None,
    properties: dict = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """設置組件屬性"""
    args = {"uuid": uuid, "componentUuid": component_uuid, "property": property}
    if value is not None:
        args["value"] = value
    if properties:
        args["properties"] = properties

    client = get_client(host, port)
    return client.execute("set_component_property", args)


def attach_script(
    uuid: str,
    script_path: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """附加腳本組件"""
    client = get_client(host, port)
    return client.execute("component_attach_script", {
        "uuid": uuid,
        "scriptPath": script_path
    })


def get_available_types(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """獲取可用組件類型"""
    client = get_client(host, port)
    return client.execute("component_get_available_types")


def get_available_components(
    category: str = "all",
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """獲取可用組件列表"""
    client = get_client(host, port)
    return client.execute("component_get_available_components", {"category": category})
