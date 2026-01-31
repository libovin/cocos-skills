import sys
import json
from typing import Dict, Any, Optional, List
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client, CocosClient

def save_asset_meta(
    url_or_uuid: str,
    content: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_save_meta", {
        "urlOrUUID": url_or_uuid,
        "content": content
    })

def generate_available_url(
    url: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_generate_available_url", {
        "url": url
    })

def query_asset_db_ready(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_query_db_ready", {})

def open_asset_external(
    url_or_uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_open_external", {
        "urlOrUUID": url_or_uuid
    })

def batch_import_assets(
    source_directory: str,
    target_directory: str,
    file_filter: Optional[List[str]] = None,
    recursive: bool = False,
    overwrite: bool = False,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {
        "sourceDirectory": source_directory,
        "targetDirectory": target_directory,
        "recursive": recursive,
        "overwrite": overwrite
    }
    if file_filter:
        args["fileFilter"] = file_filter

    client = get_client(host, port)
    return client.execute("asset_batch_import", args)

def batch_delete_assets(
    urls: List[str],
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_batch_delete", {
        "urls": urls
    })

def validate_asset_references(
    directory: str = "db://assets",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_validate_references", {
        "directory": directory
    })

def get_asset_dependencies(
    url_or_uuid: str,
    direction: str = "dependencies",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_dependencies", {
        "urlOrUUID": url_or_uuid,
        "direction": direction
    })

def get_unused_assets(
    directory: str = "db://assets",
    exclude_directories: Optional[List[str]] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {
        "directory": directory
    }
    if exclude_directories:
        args["excludeDirectories"] = exclude_directories

    client = get_client(host, port)
    return client.execute("asset_unused", args)

def compress_textures(
    directory: str = "db://assets",
    format: str = "auto",
    quality: float = 0.8,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_compress_textures", {
        "directory": directory,
        "format": format,
        "quality": quality
    })

def export_asset_manifest(
    directory: str = "db://assets",
    format: str = "json",
    include_metadata: bool = True,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("asset_export_manifest", {
        "directory": directory,
        "format": format,
        "includeMetadata": include_metadata
    })

def main():
    if len(sys.argv) < 2:
        print("用法: python asset.py <command> [args]")
        print("命令:")
        print("  save-meta <url_or_uuid> <content>")
        print("  generate-url <url>")
        print("  db-ready")
        print("  open-external <url_or_uuid>")
        print("  batch-import <source_dir> <target_dir> [file_filter] [recursive] [overwrite]")
        print("  batch-delete <urls_json>")
        print("  validate-references [directory]")
        print("  dependencies <url_or_uuid> [direction]")
        print("  unused [directory]")
        print("  compress-textures [directory] [format] [quality]")
        print("  export-manifest [directory] [format] [include_metadata]")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "save-meta":
            url_or_uuid = sys.argv[2]
            content = sys.argv[3]
            result = save_asset_meta(url_or_uuid, content, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "generate-url":
            url = sys.argv[2]
            result = generate_available_url(url, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "db-ready":
            result = query_asset_db_ready(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "open-external":
            url_or_uuid = sys.argv[2]
            result = open_asset_external(url_or_uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "batch-import":
            source_dir = sys.argv[2]
            target_dir = sys.argv[3]
            file_filter = sys.argv[4].split(",") if len(sys.argv) > 4 and sys.argv[4] else None
            recursive = sys.argv[5].lower() == "true" if len(sys.argv) > 5 else False
            overwrite = sys.argv[6].lower() == "true" if len(sys.argv) > 6 else False
            result = batch_import_assets(source_dir, target_dir, file_filter, recursive, overwrite, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "batch-delete":
            urls = json.loads(sys.argv[2])
            result = batch_delete_assets(urls, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "validate-references":
            directory = sys.argv[2] if len(sys.argv) > 2 else "db://assets"
            result = validate_asset_references(directory, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "dependencies":
            url_or_uuid = sys.argv[2]
            direction = sys.argv[3] if len(sys.argv) > 3 else "dependencies"
            result = get_asset_dependencies(url_or_uuid, direction, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "unused":
            directory = sys.argv[2] if len(sys.argv) > 2 else "db://assets"
            result = get_unused_assets(directory, host=host, port=port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "compress-textures":
            directory = sys.argv[2] if len(sys.argv) > 2 else "db://assets"
            format = sys.argv[3] if len(sys.argv) > 3 else "auto"
            quality = float(sys.argv[4]) if len(sys.argv) > 4 else 0.8
            result = compress_textures(directory, format, quality, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "export-manifest":
            directory = sys.argv[2] if len(sys.argv) > 2 else "db://assets"
            format = sys.argv[3] if len(sys.argv) > 3 else "json"
            include_metadata = sys.argv[4].lower() == "true" if len(sys.argv) > 4 else True
            result = export_asset_manifest(directory, format, include_metadata, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
