import sys
import json
from typing import Dict, Any, Optional, List
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client

def reset_node_property(
    uuid: str,
    path: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_reset_property", {
        "uuid": uuid,
        "path": path
    })

def move_array_element(
    uuid: str,
    path: str,
    target: int,
    offset: int,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_move_array", {
        "uuid": uuid,
        "path": path,
        "target": target,
        "offset": offset
    })

def remove_array_element(
    uuid: str,
    path: str,
    index: int,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_remove_array", {
        "uuid": uuid,
        "path": path,
        "index": index
    })

def copy_node(
    uuids,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_copy", {"uuids": uuids})

def paste_node(
    target: str,
    uuids,
    keep_world_transform: bool = False,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_paste", {
        "target": target,
        "uuids": uuids,
        "keepWorldTransform": keep_world_transform
    })

def cut_node(
    uuids,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_cut", {"uuids": uuids})

def reset_node_transform(
    uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_reset_transform", {"uuid": uuid})

def reset_component(
    uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_reset_component", {"uuid": uuid})

def restore_prefab(
    node_uuid: str,
    asset_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_restore_prefab", {
        "nodeUuid": node_uuid,
        "assetUuid": asset_uuid
    })

def execute_component_method(
    uuid: str,
    name: str,
    args: Optional[List] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    request_args = {"uuid": uuid, "name": name}
    if args:
        request_args["args"] = args
    return client.execute("scene_advanced_exec_component", request_args)

def execute_scene_script(
    name: str,
    method: str,
    args: Optional[List] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    request_args = {"name": name, "method": method}
    if args:
        request_args["args"] = args
    return client.execute("scene_advanced_exec_script", request_args)

def scene_snapshot(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_snapshot", {})

def scene_snapshot_abort(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_snapshot_abort", {})

def begin_undo_recording(
    node_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_undo_begin", {
        "nodeUuid": node_uuid
    })

def end_undo_recording(
    undo_id: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_undo_end", {"undoId": undo_id})

def cancel_undo_recording(
    undo_id: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_undo_cancel", {"undoId": undo_id})

def soft_reload_scene(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_soft_reload", {})

def query_scene_ready(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_ready", {})

def query_scene_dirty(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_dirty", {})

def query_scene_classes(
    extends: Optional[str] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    args = {}
    if extends:
        args["extends"] = extends
    return client.execute("scene_advanced_classes", args)

def query_scene_components(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_components", {})

def query_component_has_script(
    class_name: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_has_script", {
        "className": class_name
    })

def query_nodes_by_asset_uuid(
    asset_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_advanced_nodes_by_asset", {
        "assetUuid": asset_uuid
    })

def main():
    if len(sys.argv) < 2:
        print("用法: python scene_advanced.py <command> [args]")
        print("命令:")
        print("  reset-property <uuid> <path>")
        print("  move-array <uuid> <path> <target> <offset>")
        print("  remove-array <uuid> <path> <index>")
        print("  copy <uuids_json>")
        print("  paste <target> <uuids_json> [keep_transform]")
        print("  cut <uuids_json>")
        print("  reset-transform <uuid>")
        print("  reset-component <uuid>")
        print("  restore-prefab <node_uuid> <asset_uuid>")
        print("  exec-component <uuid> <method> [args_json]")
        print("  exec-script <name> <method> [args_json]")
        print("  snapshot")
        print("  snapshot-abort")
        print("  undo-begin <node_uuid>")
        print("  undo-end <undo_id>")
        print("  undo-cancel <undo_id>")
        print("  soft-reload")
        print("  scene-ready")
        print("  scene-dirty")
        print("  scene-classes [extends]")
        print("  scene-components")
        print("  has-script <class_name>")
        print("  nodes-by-asset <asset_uuid>")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "reset-property":
            uuid = sys.argv[2]
            path = sys.argv[3]
            result = reset_node_property(uuid, path, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "move-array":
            uuid = sys.argv[2]
            path = sys.argv[3]
            target = int(sys.argv[4])
            offset = int(sys.argv[5])
            result = move_array_element(uuid, path, target, offset, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "remove-array":
            uuid = sys.argv[2]
            path = sys.argv[3]
            index = int(sys.argv[4])
            result = remove_array_element(uuid, path, index, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "copy":
            uuids = json.loads(sys.argv[2])
            result = copy_node(uuids, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "paste":
            target = sys.argv[2]
            uuids = json.loads(sys.argv[3])
            keep_transform = sys.argv[4].lower() == "true" if len(sys.argv) > 4 else False
            result = paste_node(target, uuids, keep_transform, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "cut":
            uuids = json.loads(sys.argv[2])
            result = cut_node(uuids, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "reset-transform":
            uuid = sys.argv[2]
            result = reset_node_transform(uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "reset-component":
            uuid = sys.argv[2]
            result = reset_component(uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "restore-prefab":
            node_uuid = sys.argv[2]
            asset_uuid = sys.argv[3]
            result = restore_prefab(node_uuid, asset_uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "exec-component":
            uuid = sys.argv[2]
            method = sys.argv[3]
            args = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None
            result = execute_component_method(uuid, method, args, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "exec-script":
            name = sys.argv[2]
            method = sys.argv[3]
            args = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None
            result = execute_scene_script(name, method, args, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "snapshot":
            result = scene_snapshot(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "snapshot-abort":
            result = scene_snapshot_abort(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "undo-begin":
            node_uuid = sys.argv[2]
            result = begin_undo_recording(node_uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "undo-end":
            undo_id = sys.argv[2]
            result = end_undo_recording(undo_id, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "undo-cancel":
            undo_id = sys.argv[2]
            result = cancel_undo_recording(undo_id, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "soft-reload":
            result = soft_reload_scene(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "scene-ready":
            result = query_scene_ready(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "scene-dirty":
            result = query_scene_dirty(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "scene-classes":
            extends = sys.argv[2] if len(sys.argv) > 2 else None
            result = query_scene_classes(extends, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "scene-components":
            result = query_scene_components(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "has-script":
            class_name = sys.argv[2]
            result = query_component_has_script(class_name, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "nodes-by-asset":
            asset_uuid = sys.argv[2]
            result = query_nodes_by_asset_uuid(asset_uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
