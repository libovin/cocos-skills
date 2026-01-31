from .client import get_client


def begin_undo_recording(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """開始 Undo 錄製"""
    client = get_client(host, port)
    return client.execute("scene_begin_undo_recording", {})


def end_undo_recording(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """結束 Undo 錄製"""
    client = get_client(host, port)
    return client.execute("scene_end_undo_recording", {})


def cancel_undo_recording(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """取消 Undo 錄製"""
    client = get_client(host, port)
    return client.execute("scene_cancel_undo_recording", {})


def copy_node(uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """複製節點"""
    client = get_client(host, port)
    return client.execute("scene_copy_node", {"uuid": uuid})


def cut_node(uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """剪切節點"""
    client = get_client(host, port)
    return client.execute("scene_cut_node", {"uuid": uuid})


def paste_node(parent_uuid: str = None, position: dict = None, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """粘貼節點"""
    args = {}
    if parent_uuid:
        args["parentUuid"] = parent_uuid
    if position:
        args["position"] = position
    
    client = get_client(host, port)
    return client.execute("scene_paste_node", args)


def move_array_element(
    uuid: str,
    component_uuid: str,
    property_name: str,
    from_index: int,
    to_index: int,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """移動數組元素"""
    client = get_client(host, port)
    return client.execute("scene_move_array_element", {
        "uuid": uuid,
        "componentUuid": component_uuid,
        "propertyName": property_name,
        "fromIndex": from_index,
        "toIndex": to_index
    })


def remove_array_element(
    uuid: str,
    component_uuid: str,
    property_name: str,
    index: int,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """移除數組元素"""
    client = get_client(host, port)
    return client.execute("scene_remove_array_element", {
        "uuid": uuid,
        "componentUuid": component_uuid,
        "propertyName": property_name,
        "index": index
    })


def reset_node_property(
    uuid: str,
    property_name: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """重置節點屬性"""
    client = get_client(host, port)
    return client.execute("scene_reset_node_property", {
        "uuid": uuid,
        "propertyName": property_name
    })


def reset_node_transform(uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """重置節點變換"""
    client = get_client(host, port)
    return client.execute("scene_reset_node_transform", {"uuid": uuid})


def reset_component(uuid: str, component_uuid: str, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """重置組件"""
    client = get_client(host, port)
    return client.execute("scene_reset_component", {
        "uuid": uuid,
        "componentUuid": component_uuid
    })


def query_scene_dirty(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """查詢場景是否有未保存的更改"""
    client = get_client(host, port)
    return client.execute("scene_query_dirty", {})


def query_scene_ready(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """查詢場景是否就緒"""
    client = get_client(host, port)
    return client.execute("scene_query_ready", {})


def query_scene_classes(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """查詢場景中的類型"""
    client = get_client(host, port)
    return client.execute("scene_query_classes", {})


def query_scene_components(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """查詢場景中的組件"""
    client = get_client(host, port)
    return client.execute("scene_query_components", {})


def query_nodes_by_asset_uuid(
    asset_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """通過資源 UUID 查詢節點"""
    client = get_client(host, port)
    return client.execute("scene_query_nodes_by_asset_uuid", {"assetUuid": asset_uuid})


def query_component_has_script(
    uuid: str,
    component_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """查詢組件是否包含腳本"""
    client = get_client(host, port)
    return client.execute("scene_query_component_has_script", {
        "uuid": uuid,
        "componentUuid": component_uuid
    })


def execute_component_method(
    uuid: str,
    component_uuid: str,
    method_name: str,
    args: list = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """執行組件方法"""
    client = get_client(host, port)
    return client.execute("scene_execute_component_method", {
        "uuid": uuid,
        "componentUuid": component_uuid,
        "methodName": method_name,
        "args": args or []
    })


def execute_scene_script(script_name: str, args: dict = None, host: str = "127.0.0.1", port: int = 8080) -> dict:
    """執行場景腳本"""
    client = get_client(host, port)
    return client.execute("scene_execute_script", {
        "scriptName": script_name,
        "args": args or {}
    })


def restore_prefab(
    node_uuid: str,
    asset_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> dict:
    """恢復預製體"""
    client = get_client(host, port)
    return client.execute("scene_restore_prefab", {
        "nodeUuid": node_uuid,
        "assetUuid": asset_uuid
    })


def soft_reload_scene(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """軟重新加載場景"""
    client = get_client(host, port)
    return client.execute("scene_soft_reload", {})


def scene_snapshot(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """拍攝場景快照"""
    client = get_client(host, port)
    return client.execute("scene_snapshot", {})


def scene_snapshot_abort(host: str = "127.0.0.1", port: int = 8080) -> dict:
    """取消場景快照"""
    client = get_client(host, port)
    return client.execute("scene_snapshot_abort", {})
