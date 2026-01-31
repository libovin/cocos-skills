#!/usr/bin/env python3
"""
場景操作工具
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.scene import (
    get_current,
    get_list,
    hierarchy,
    open_scene,
    save,
    save_as,
    close,
    create
)


def main():
    """主函數"""
    if len(sys.argv) < 2:
        print("用法: python scene.py <command> [args]")
        print("命令:")
        print("  get-current [host] [port]")
        print("  get-list [host] [port]")
        print("  hierarchy [includeComponents] [host] [port]")
        print("  open <scenePath> [host] [port]")
        print("  save [host] [port]")
        print("  save-as <path> [host] [port]")
        print("  close [host] [port]")
        print("  create <name> <path> [host] [port]")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    if len(sys.argv) > 2:
        host = sys.argv[2]
    if len(sys.argv) > 3:
        port = int(sys.argv[3])

    try:
        if cmd == "get-current":
            result = get_current(host, port)
        elif cmd == "get-list":
            result = get_list(host, port)
        elif cmd == "hierarchy":
            include_components = len(sys.argv) > 3 and sys.argv[3].lower() == "true"
            result = hierarchy(include_components, host, port)
        elif cmd == "open" and len(sys.argv) > 3:
            result = open_scene(sys.argv[2], host, port)
        elif cmd == "save":
            result = save(host, port)
        elif cmd == "save-as" and len(sys.argv) > 3:
            result = save_as(sys.argv[2], host, port)
        elif cmd == "close":
            result = close(host, port)
        elif cmd == "create" and len(sys.argv) > 4:
            result = create(sys.argv[2], sys.argv[3], host, port)
        else:
            print(f"未知命令或參數不足: {cmd}")
            sys.exit(1)

        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
