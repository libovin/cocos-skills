#!/usr/bin/env python3
"""
組件操作工具
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.component import (
    add,
    remove,
    list_components,
    get_info,
    set_property,
    attach_script,
    get_types,
    get_available
)


def main():
    """主函數"""
    if len(sys.argv) < 2:
        print("用法: python component.py <command> [args]")
        print("命令:")
        print("  add <uuid> [type] [script] [host] [port]")
        print("  remove <uuid> <componentUuid> [host] [port]")
        print("  list <uuid> [host] [port]")
        print("  info <uuid> <componentUuid> [host] [port]")
        print("  set-property <uuid> <compUuid> <prop> [value] [host] [port]")
        print("  attach-script <uuid> <scriptPath> [host] [port]")
        print("  types [host] [port]")
        print("  available [category] [host] [port]")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "add" and len(sys.argv) > 2:
            uuid = sys.argv[2]
            comp_type = sys.argv[3] if len(sys.argv) > 3 else None
            script = sys.argv[4] if len(sys.argv) > 4 else None
            if len(sys.argv) > 5:
                host = sys.argv[5]
            if len(sys.argv) > 6:
                port = int(sys.argv[6])
            result = add(uuid, comp_type, script, host, port)

        elif cmd == "remove" and len(sys.argv) > 3:
            if len(sys.argv) > 4:
                host = sys.argv[4]
            if len(sys.argv) > 5:
                port = int(sys.argv[5])
            result = remove(sys.argv[2], sys.argv[3], host, port)

        elif cmd == "list" and len(sys.argv) > 2:
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = list_components(sys.argv[2], host, port)

        elif cmd == "info" and len(sys.argv) > 3:
            if len(sys.argv) > 4:
                host = sys.argv[4]
            if len(sys.argv) > 5:
                port = int(sys.argv[5])
            result = get_info(sys.argv[2], sys.argv[3], host, port)

        elif cmd == "set-property" and len(sys.argv) > 4:
            uuid = sys.argv[2]
            comp_uuid = sys.argv[3]
            prop = sys.argv[4]
            value = sys.argv[5] if len(sys.argv) > 5 else None
            if len(sys.argv) > 6:
                host = sys.argv[6]
            if len(sys.argv) > 7:
                port = int(sys.argv[7])
            result = set_property(uuid, comp_uuid, prop, value, host, port)

        elif cmd == "attach-script" and len(sys.argv) > 3:
            if len(sys.argv) > 4:
                host = sys.argv[4]
            if len(sys.argv) > 5:
                port = int(sys.argv[5])
            result = attach_script(sys.argv[2], sys.argv[3], host, port)

        elif cmd == "types":
            if len(sys.argv) > 2:
                host = sys.argv[2]
            if len(sys.argv) > 3:
                port = int(sys.argv[3])
            result = get_types(host, port)

        elif cmd == "available":
            category = sys.argv[2] if len(sys.argv) > 2 else "all"
            if len(sys.argv) > 3:
                host = sys.argv[3]
            if len(sys.argv) > 4:
                port = int(sys.argv[4])
            result = get_available(category, host, port)

        else:
            print(f"未知命令或參數不足: {cmd}")
            sys.exit(1)

        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
