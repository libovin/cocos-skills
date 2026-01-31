import sys
import json
from typing import Dict, Any, Optional
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client

def run_project(
    platform: str = "browser",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_run", {"platform": platform})

def build_project(
    platform: str,
    debug: bool = True,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_build", {"platform": platform, "debug": debug})

def get_project_info(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_info", {})

def get_project_settings(
    category: str = "general",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_settings", {"category": category})

def refresh_assets(
    folder: Optional[str] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {}
    if folder:
        args["folder"] = folder

    client = get_client(host, port)
    return client.execute("project_refresh_assets", args)

def import_asset(
    source_path: str,
    target_folder: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_import_asset", {
        "sourcePath": source_path,
        "targetFolder": target_folder
    })

def get_asset_info(
    asset_path: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_asset_info", {"assetPath": asset_path})

def get_assets(
    type: str = "all",
    folder: str = "db://assets",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_assets", {"type": type, "folder": folder})

def get_build_settings(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_build_settings", {})

def open_build_panel(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_open_build_panel", {})

def check_builder_status(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_builder_status", {})

def start_preview_server(
    port: int = 7456,
    host: str = "127.0.0.1",
    port_param: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port_param)
    return client.execute("project_start_preview", {"port": port})

def stop_preview_server(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_stop_preview", {})

def create_asset(
    url: str,
    content: Optional[str] = None,
    overwrite: bool = False,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {"url": url, "overwrite": overwrite}
    if content is not None:
        args["content"] = content

    client = get_client(host, port)
    return client.execute("project_create_asset", args)

def copy_asset(
    source: str,
    target: str,
    overwrite: bool = False,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_copy_asset", {
        "source": source,
        "target": target,
        "overwrite": overwrite
    })

def move_asset(
    source: str,
    target: str,
    overwrite: bool = False,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_move_asset", {
        "source": source,
        "target": target,
        "overwrite": overwrite
    })

def delete_asset(
    url: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_delete_asset", {"url": url})

def save_asset(
    url: str,
    content: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_save_asset", {"url": url, "content": content})

def reimport_asset(
    url: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_reimport_asset", {"url": url})

def query_asset_path(
    url: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_asset_path", {"url": url})

def query_asset_uuid(
    url: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_asset_uuid", {"url": url})

def query_asset_url(
    uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_asset_url", {"uuid": uuid})

def find_asset_by_name(
    name: str,
    exact_match: bool = False,
    asset_type: str = "all",
    folder: str = "db://assets",
    max_results: int = 20,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_find_asset", {
        "name": name,
        "exactMatch": exact_match,
        "assetType": asset_type,
        "folder": folder,
        "maxResults": max_results
    })

def get_asset_details(
    asset_path: str,
    include_sub_assets: bool = True,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("project_asset_details", {
        "assetPath": asset_path,
        "includeSubAssets": include_sub_assets
    })

def main():
    if len(sys.argv) < 2:
        print("用法: python project.py <command> [args]")
        print("命令:")
        print("  run [platform]")
        print("  build <platform> [debug]")
        print("  info")
        print("  settings [category]")
        print("  refresh-assets [folder]")
        print("  import-asset <source_path> <target_folder>")
        print("  asset-info <asset_path>")
        print("  assets [type] [folder]")
        print("  build-settings")
        print("  open-build-panel")
        print("  builder-status")
        print("  start-preview [port]")
        print("  stop-preview")
        print("  create-asset <url> [content] [overwrite]")
        print("  copy-asset <source> <target> [overwrite]")
        print("  move-asset <source> <target> [overwrite]")
        print("  delete-asset <url>")
        print("  save-asset <url> <content>")
        print("  reimport-asset <url>")
        print("  asset-path <url>")
        print("  asset-uuid <url>")
        print("  asset-url <uuid>")
        print("  find-asset <name> [exact_match] [asset_type] [folder] [max_results]")
        print("  asset-details <asset_path> [include_sub_assets]")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "run":
            platform = sys.argv[2] if len(sys.argv) > 2 else "browser"
            result = run_project(platform, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "build":
            platform = sys.argv[2]
            debug = sys.argv[3].lower() == "true" if len(sys.argv) > 3 else True
            result = build_project(platform, debug, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "info":
            result = get_project_info(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "settings":
            category = sys.argv[2] if len(sys.argv) > 2 else "general"
            result = get_project_settings(category, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "refresh-assets":
            folder = sys.argv[2] if len(sys.argv) > 2 else None
            result = refresh_assets(folder, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "import-asset":
            source_path = sys.argv[2]
            target_folder = sys.argv[3]
            result = import_asset(source_path, target_folder, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "asset-info":
            asset_path = sys.argv[2]
            result = get_asset_info(asset_path, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "assets":
            asset_type = sys.argv[2] if len(sys.argv) > 2 else "all"
            folder = sys.argv[3] if len(sys.argv) > 3 else "db://assets"
            result = get_assets(asset_type, folder, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "build-settings":
            result = get_build_settings(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "open-build-panel":
            result = open_build_panel(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "builder-status":
            result = check_builder_status(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "start-preview":
            preview_port = int(sys.argv[2]) if len(sys.argv) > 2 else 7456
            result = start_preview_server(preview_port, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "stop-preview":
            result = stop_preview_server(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "create-asset":
            url = sys.argv[2]
            content = sys.argv[3] if len(sys.argv) > 3 else None
            overwrite = sys.argv[4].lower() == "true" if len(sys.argv) > 4 else False
            result = create_asset(url, content, overwrite, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "copy-asset":
            source = sys.argv[2]
            target = sys.argv[3]
            overwrite = sys.argv[4].lower() == "true" if len(sys.argv) > 4 else False
            result = copy_asset(source, target, overwrite, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "move-asset":
            source = sys.argv[2]
            target = sys.argv[3]
            overwrite = sys.argv[4].lower() == "true" if len(sys.argv) > 4 else False
            result = move_asset(source, target, overwrite, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "delete-asset":
            url = sys.argv[2]
            result = delete_asset(url, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "save-asset":
            url = sys.argv[2]
            content = sys.argv[3]
            result = save_asset(url, content, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "reimport-asset":
            url = sys.argv[2]
            result = reimport_asset(url, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "asset-path":
            url = sys.argv[2]
            result = query_asset_path(url, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "asset-uuid":
            url = sys.argv[2]
            result = query_asset_uuid(url, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "asset-url":
            uuid = sys.argv[2]
            result = query_asset_url(uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "find-asset":
            name = sys.argv[2]
            exact_match = sys.argv[3].lower() == "true" if len(sys.argv) > 3 else False
            asset_type = sys.argv[4] if len(sys.argv) > 4 else "all"
            folder = sys.argv[5] if len(sys.argv) > 5 else "db://assets"
            max_results = int(sys.argv[6]) if len(sys.argv) > 6 else 20
            result = find_asset_by_name(name, exact_match, asset_type, folder, max_results, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "asset-details":
            asset_path = sys.argv[2]
            include_sub = sys.argv[3].lower() == "true" if len(sys.argv) > 3 else True
            result = get_asset_details(asset_path, include_sub, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
