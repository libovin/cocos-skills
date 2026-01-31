#!/usr/bin/env python3
"""
預製體操作工具
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.prefab import (
    get_list,
    load,
    get_info,
    instantiate,
    create,
    update,
    apply,
    revert,
    unlink,
    validate,
    duplicate,
    restore
)


def main():
    """主函數"""
    if len(sys.argv) < 2:
        print("用法: python prefab.py <command> [args]")
        print("命令:")
        print("  list [folder] [host] [port]")
        print("  load <path> [host] [port]")
        print("  info <path> [host] [port]")
        print("  instantiate <path> [parentUuid] [position] [name] [host] [port]")
        print("  create <nodeUuid> <path> [name] [host] [port]")
        print("  update <path> <nodeUuid> [host] [port]")
        print("  apply <nodeUuid> [host] [port]")
        print("  revert <nodeUuid> [host] [port]")
        print("  unlink <nodeUuid> [host] [port]")
        print("  validate <path> [host] [port]")
        print("  duplicate <sourcePath> <targetPath> [newName] [host] [port]")
        print("  restore <nodeUuid> <assetUuid> [host] [port]")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "list":
            folder = sys.argv[2] if len(sys.argv) > 2 else "db://assets"
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = get_list(folder, host, port)

        elif cmd == "load" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = load(sys.argv[2], host, port)

        elif cmd == "info" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = get_info(sys.argv[2], host, port)

        elif cmd == "instantiate" and len(sys.argv) > 2:
            path = sys.argv[2]
            parent_uuid = sys.argv[3] if len(sys.argv) > 3 else None
            position = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None
            name = sys.argv[5] if len(sys.argv) > 5 else None
            if len(sys.argv) > 6:
                host = sys.argv[6]
            if len(sys.argv) > 7:
                port = int(sys.argv[7])
            result = instantiate(path, parent_uuid, position, name, host, port)

        elif cmd == "create" and len(sys.argv) > 3:
            node_uuid = sys.argv[2]
            path = sys.argv[3]
            prefab_name = sys.argv[4] if len(sys.argv) > 4 else None
            if len(sys.argv) > 5:
                host = sys.argv[5]
            if len(sys.argv) > 6:
                port = int(sys.argv[6])
            result = create(node_uuid, path, prefab_name, host, port)

        elif cmd == "update" and len(sys.argv) > 3:
            path = sys.argv[2]
            node_uuid = sys.argv[3]
            if len(sys.argv) > 4:
                host = sys.argv[4]
            if len(sys.argv) > 5:
                port = int(sys.argv[5])
            result = update(path, node_uuid, host, port)

        elif cmd == "apply" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = apply(sys.argv[2], host, port)

        elif cmd == "revert" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = revert(sys.argv[2], host, port)

        elif cmd == "unlink" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = unlink(sys.argv[2], host, port)

        elif cmd == "validate" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = validate(sys.argv[2], host, port)

        elif cmd == "duplicate" and len(sys.argv) > 3:
            source = sys.argv[2]
            target = sys.argv[3]
            new_name = sys.argv[4] if len(sys.argv) > 4 else None
            if len(sys.argv) > 5:
                host = sys.argv[5]
            if len(sys.argv) > 6:
                port = int(sys.argv[6])
            result = duplicate(source, target, new_name, host, port)

        elif cmd == "restore" and len(sys.argv) > 3:
            node_uuid = sys.argv[2]
            asset_uuid = sys.argv[3]
            if len(sys.argv) > 4:
                host = sys.argv[4]
            if len(sys.argv) > 5:
                port = int(sys.argv[5])
            result = restore(node_uuid, asset_uuid, host, port)

        else:
            print(f"未知命令或參數不足: {cmd}")
            sys.exit(1)

        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
