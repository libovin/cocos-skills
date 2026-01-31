import sys
import json
from typing import Dict, Any
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client

def open_preferences_settings(
    tab: Optional[str] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {}
    if tab:
        args["tab"] = tab

    client = get_client(host, port)
    return client.execute("prefs_open_settings", args)

def query_preferences_config(
    name: str,
    path: Optional[str] = None,
    type: str = "global",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {"name": name, "type": type}
    if path:
        args["path"] = path

    client = get_client(host, port)
    return client.execute("prefs_query_config", args)

def set_preferences_config(
    name: str,
    path: str,
    value: any,
    type: str = "global",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("prefs_set_config", {
        "name": name,
        "path": path,
        "value": value,
        "type": type
    })

def get_all_preferences(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("prefs_get_all", {})

def reset_preferences(
    name: Optional[str] = None,
    type: str = "global",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {"type": type}
    if name:
        args["name"] = name

    client = get_client(host, port)
    return client.execute("prefs_reset", args)

def export_preferences(
    export_path: Optional[str] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {}
    if export_path:
        args["exportPath"] = export_path

    client = get_client(host, port)
    return client.execute("prefs_export", args)

def import_preferences(
    import_path: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("prefs_import", {
        "importPath": import_path
    })

def main():
    if len(sys.argv) < 2:
        print("用法: python preferences.py <command> [args]")
        print("命令:")
        print("  open-settings [tab]")
        print("  query-config <name> [path] [type]")
        print("  set-config <name> <path> <value> [type]")
        print("  get-all")
        print("  reset [name] [type]")
        print("  export [export_path]")
        print("  import <import_path>")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "open-settings":
            tab = sys.argv[2] if len(sys.argv) > 2 else None
            result = open_preferences_settings(tab, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "query-config":
            name = sys.argv[2]
            path = sys.argv[3] if len(sys.argv) > 3 else None
            type_val = sys.argv[4] if len(sys.argv) > 4 else "global"
            result = query_preferences_config(name, path, type_val, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "set-config":
            name = sys.argv[2]
            path = sys.argv[3]
            value = sys.argv[4]
            type_val = sys.argv[5] if len(sys.argv) > 5 else "global"
            result = set_preferences_config(name, path, value, type_val, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "get-all":
            result = get_all_preferences(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "reset":
            name = sys.argv[2] if len(sys.argv) > 2 else None
            type_val = sys.argv[3] if len(sys.argv) > 3 else "global"
            result = reset_preferences(name, type_val, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "export":
            export_path = sys.argv[2] if len(sys.argv) > 2 else None
            result = export_preferences(export_path, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "import":
            import_path = sys.argv[2]
            result = import_preferences(import_path, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
