import sys
import json
from typing import Dict, Any, Optional
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client

def change_gizmo_tool(
    name: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_gizmo_tool", {"name": name})

def query_gizmo_tool_name(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_gizmo_tool_name", {})

def change_gizmo_pivot(
    name: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_gizmo_pivot", {"name": name})

def query_gizmo_pivot(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_gizmo_pivot_name", {})

def query_gizmo_view_mode(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_gizmo_view_mode", {})

def change_gizmo_coordinate(
    type: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_gizmo_coordinate", {"type": type})

def query_gizmo_coordinate(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_gizmo_coordinate_name", {})

def change_view_mode_2d_3d(
    is2D: bool,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_2d_3d", {"is2D": is2D})

def query_view_mode_2d_3d(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_2d_3d_name", {})

def set_grid_visible(
    visible: bool,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_grid_visible", {"visible": visible})

def query_grid_visible(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_grid_visible_name", {})

def set_icon_gizmo_3d(
    is3D: bool,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_icon_gizmo_3d", {"is3D": is3D})

def query_icon_gizmo_3d(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_icon_gizmo_3d_name", {})

def set_icon_gizmo_size(
    size: int,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_icon_gizmo_size", {"size": size})

def query_icon_gizmo_size(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_icon_gizmo_size_name", {})

def focus_camera_on_nodes(
    uuids: Optional[List[str]],
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_focus_camera", {"uuids": uuids})

def align_camera_with_view(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_align_camera", {})

def align_view_with_node(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_align_view", {})

def get_scene_view_status(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_status", {})

def reset_scene_view(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("scene_view_reset", {})

def main():
    if len(sys.argv) < 2:
        print("用法: python scene_view.py <command> [args]")
        print("命令:")
        print("  gizmo-tool <name>")
        print("  gizmo-tool-name")
        print("  gizmo-pivot <name>")
        print("  gizmo-pivot-name")
        print("  gizmo-view-mode")
        print("  gizmo-coordinate <type>")
        print("  gizmo-coordinate-name")
        print("  view-mode-2d-3d <is2D>")
        print("  view-mode-2d-3d-name")
        print("  grid-visible <visible>")
        print("  grid-visible-name")
        print("  icon-gizmo-3d <is3D>")
        print("  icon-gizmo-3d-name")
        print("  icon-gizmo-size <size>")
        print("  icon-gizmo-size-name")
        print("  focus-camera [uuids_json|null]")
        print("  align-camera")
        print("  align-view")
        print("  status")
        print("  reset")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "gizmo-tool":
            name = sys.argv[2]
            result = change_gizmo_tool(name, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "gizmo-tool-name":
            result = query_gizmo_tool_name(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "gizmo-pivot":
            name = sys.argv[2]
            result = change_gizmo_pivot(name, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "gizmo-pivot-name":
            result = query_gizmo_pivot(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "gizmo-view-mode":
            result = query_gizmo_view_mode(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "gizmo-coordinate":
            type_val = sys.argv[2]
            result = change_gizmo_coordinate(type_val, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "gizmo-coordinate-name":
            result = query_gizmo_coordinate(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "view-mode-2d-3d":
            is2d = sys.argv[2].lower() == "true"
            result = change_view_mode_2d_3d(is2d, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "view-mode-2d-3d-name":
            result = query_view_mode_2d_3d(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "grid-visible":
            visible = sys.argv[2].lower() == "true"
            result = set_grid_visible(visible, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "grid-visible-name":
            result = query_grid_visible(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "icon-gizmo-3d":
            is3d = sys.argv[2].lower() == "true"
            result = set_icon_gizmo_3d(is3d, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "icon-gizmo-3d-name":
            result = query_icon_gizmo_3d(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "icon-gizmo-size":
            size = int(sys.argv[2])
            result = set_icon_gizmo_size(size, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "icon-gizmo-size-name":
            result = query_icon_gizmo_size(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "focus-camera":
            uuids = None if len(sys.argv) <= 2 or sys.argv[2] == "null" else json.loads(sys.argv[2])
            result = focus_camera_on_nodes(uuids, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "align-camera":
            result = align_camera_with_view(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "align-view":
            result = align_view_with_node(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "status":
            result = get_scene_view_status(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "reset":
            result = reset_scene_view(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
