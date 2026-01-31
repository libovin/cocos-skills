import sys
import json
from typing import Dict, Any, Optional, List
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client

def get_reference_image_screen_position(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_screen_position", {})

def get_reference_image_viewport(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_viewport_get", {})

def set_reference_image_viewport(
    x: Optional[int] = None,
    y: Optional[int] = None,
    width: Optional[int] = None,
    height: Optional[int] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    args = {}
    if x is not None:
        args["x"] = x
    if y is not None:
        args["y"] = y
    if width is not None:
        args["width"] = width
    if height is not None:
        args["height"] = height
    return client.execute("reference_image_viewport_set", args)

def set_reference_image_visible(
    visible: bool,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_visible_set", {"visible": visible})

def get_reference_image_visible(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_visible_get", {})

def get_reference_image_camera_offset(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_camera_offset_get", {})

def set_reference_image_camera_offset(
    x: int,
    y: int,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_camera_offset_set", {"x": x, "y": y})

def get_reference_image_nodes(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_nodes_get", {})

def set_reference_image_nodes(
    uuids: List[str],
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_nodes_set", {"uuids": uuids})

def get_reference_image_position(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_position_get", {})

def set_reference_image_position(
    x: int,
    y: int,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_position_set", {"x": x, "y": y})

def get_reference_image_locked(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_locked_get", {})

def set_reference_image_locked(
    locked: bool,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("reference_image_locked_set", {"locked": locked})

def main():
    if len(sys.argv) < 2:
        print("用法: python reference_image.py <command> [args]")
        print("命令:")
        print("  screen-position")
        print("  viewport-get")
        print("  viewport-set [x] [y] [width] [height]")
        print("  visible-set <true|false>")
        print("  visible-get")
        print("  camera-offset-get")
        print("  camera-offset-set <x> <y>")
        print("  nodes-get")
        print("  nodes-set <uuids_json>")
        print("  position-get")
        print("  position-set <x> <y>")
        print("  locked-get")
        print("  locked-set <true|false>")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "screen-position":
            result = get_reference_image_screen_position(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "viewport-get":
            result = get_reference_image_viewport(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "viewport-set":
            x = int(sys.argv[2]) if len(sys.argv) > 2 else None
            y = int(sys.argv[3]) if len(sys.argv) > 3 else None
            width = int(sys.argv[4]) if len(sys.argv) > 4 else None
            height = int(sys.argv[5]) if len(sys.argv) > 5 else None
            result = set_reference_image_viewport(x, y, width, height, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "visible-set":
            visible = sys.argv[2].lower() == "true"
            result = set_reference_image_visible(visible, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "visible-get":
            result = get_reference_image_visible(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "camera-offset-get":
            result = get_reference_image_camera_offset(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "camera-offset-set":
            x = int(sys.argv[2])
            y = int(sys.argv[3])
            result = set_reference_image_camera_offset(x, y, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "nodes-get":
            result = get_reference_image_nodes(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "nodes-set":
            uuids = json.loads(sys.argv[2])
            result = set_reference_image_nodes(uuids, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "position-get":
            result = get_reference_image_position(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "position-set":
            x = int(sys.argv[2])
            y = int(sys.argv[3])
            result = set_reference_image_position(x, y, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "locked-get":
            result = get_reference_image_locked(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "locked-set":
            locked = sys.argv[2].lower() == "true"
            result = set_reference_image_locked(locked, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
