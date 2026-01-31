import sys
import json
from typing import Dict, Any
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client

def validate_asset(
    uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("validation_asset", {"uuid": uuid})

def validate_asset_references(
    uuid: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("validation_references", {"uuid": uuid})

def find_duplicate_assets(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("validation_duplicates", {})

def main():
    if len(sys.argv) < 2:
        print("用法: python validation.py <command> [args]")
        print("命令:")
        print("  asset <uuid>")
        print("  references <uuid>")
        print("  duplicates")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "asset":
            uuid = sys.argv[2]
            result = validate_asset(uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "references":
            uuid = sys.argv[2]
            result = validate_asset_references(uuid, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "duplicates":
            result = find_duplicate_assets(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
