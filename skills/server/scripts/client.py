#!/usr/bin/env python3
"""
HTTP 客戶端工具
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import (
    health_check,
    get_server_status,
    get_tools_list,
    query_ip_list,
    query_sorted_ip_list,
    query_port,
    get_network_interfaces
)


def main():
    """主函數"""
    if len(sys.argv) < 2:
        print("用法: python client.py <command> [args]")
        print("命令:")
        print("  health [host] [port]")
        print("  status [host] [port]")
        print("  tools [host] [port]")
        print("  ip-list [host] [port]")
        print("  sorted-ip-list [host] [port]")
        print("  port [host] [port]")
        print("  network-interfaces [host] [port]")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    if len(sys.argv) > 2:
        host = sys.argv[2]
    if len(sys.argv) > 3:
        port = int(sys.argv[3])

    try:
        if cmd == "health":
            result = health_check(host, port)
        elif cmd == "status":
            result = get_server_status(host, port)
        elif cmd == "tools":
            result = get_tools_list(host, port)
        elif cmd == "ip-list":
            result = query_ip_list(host, port)
        elif cmd == "sorted-ip-list":
            result = query_sorted_ip_list(host, port)
        elif cmd == "port":
            result = query_port(host, port)
        elif cmd == "network-interfaces":
            result = get_network_interfaces(host, port)
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)

        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
