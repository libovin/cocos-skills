#!/usr/bin/env python3
"""
節點操作工具
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.node import (
    create_node,
    get_info,
    find,
    get_all,
    set_property,
    set_transform,
    delete_node,
    move,
    duplicate,
    detect_type
)


def main():
    """主函數"""
    if len(sys.argv) < 2:
        print("用法: python node.py <command> [args]")
        print("命令:")
        print("  create <name> [parentUuid] [position] [rotation] [scale] [host] [port]")
        print("  get-info <uuid> [host] [port]")
        print("  find <pattern> [exactMatch] [host] [port]")
        print("  all [host] [port]")
        print("  set-property <uuid> <property> <value> [host] [port]")
        print("  set-transform <uuid> [position] [rotation] [scale] [space] [host] [port]")
        print("  delete <uuid> [host] [port]")
        print("  move <nodeUuid> <newParentUuid> [host] [port]")
        print("  duplicate <uuid> [includeChildren] [host] [port]")
        print("  detect-type <uuid> [host] [port]")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "create" and len(sys.argv) > 2:
            name = sys.argv[2]
            parent_uuid = sys.argv[3] if len(sys.argv) > 3 else None
            position = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None
            rotation = json.loads(sys.argv[5]) if len(sys.argv) > 5 else None
            scale = json.loads(sys.argv[6]) if len(sys.argv) > 6 else None
            if len(sys.argv) > 7:
                host = sys.argv[7]
            if len(sys.argv) > 8:
                port = int(sys.argv[8])
            result = create_node(name, parent_uuid, position, rotation, scale, host, port)

        elif cmd == "get-info" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = get_info(sys.argv[2], host, port)

        elif cmd == "find" and len(sys.argv) > 2:
            pattern = sys.argv[2]
            exact = len(sys.argv) > 3 and sys.argv[3].lower() == "true"
            if len(sys.argv) > 4:
                host = sys.argv[4]
            if len(sys.argv) > 5:
                port = int(sys.argv[5])
            result = find(pattern, exact, host, port)

        elif cmd == "all":
            if len(sys.argv) > 2:
                host = sys.argv[2]
            if len(sys.argv) > 3:
                port = int(sys.argv[3])
            result = get_all(host, port)

        elif cmd == "set-property" and len(sys.argv) > 4:
            uuid = sys.argv[2]
            prop = sys.argv[3]
            value = sys.argv[4]
            if len(sys.argv) > 5:
                host = sys.argv[5]
            if len(sys.argv) > 6:
                port = int(sys.argv[6])
            result = set_property(uuid, prop, value, host, port)

        elif cmd == "set-transform" and len(sys.argv) > 2:
            uuid = sys.argv[2]
            position = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None
            rotation = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None
            scale = json.loads(sys.argv[5]) if len(sys.argv) > 5 else None
            space = sys.argv[6] if len(sys.argv) > 6 else "world"
            if len(sys.argv) > 7:
                host = sys.argv[7]
            if len(sys.argv) > 8:
                port = int(sys.argv[8])
            result = set_transform(uuid, position, rotation, scale, space, host, port)

        elif cmd == "delete" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = delete_node(sys.argv[2], host, port)

        elif cmd == "move" and len(sys.argv) > 3:
            if len(sys.argv) > 4:
                host = sys.argv[4]
            if len(sys.argv) > 5:
                port = int(sys.argv[5])
            result = move(sys.argv[2], sys.argv[3], host, port)

        elif cmd == "duplicate" and len(sys.argv) > 2:
            include_children = len(sys.argv) > 3 and sys.argv[3].lower() != "false"
            if len(sys.argv) > 4:
                host = sys.argv[4]
            if len(sys.argv) > 5:
                port = int(sys.argv[5])
            result = duplicate(sys.argv[2], include_children, host, port)

        elif cmd == "detect-type" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = detect_type(sys.argv[2], host, port)

        else:
            print(f"未知命令或參數不足: {cmd}")
            sys.exit(1)

        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
