import sys
import json
from typing import Dict, Any, Optional
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client

def get_broadcast_log(
    limit: int = 50,
    message_type: Optional[str] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {"limit": limit}
    if message_type:
        args["messageType"] = message_type

    client = get_client(host, port)
    return client.execute("broadcast_get_log", args)

def listen_broadcast(
    message_type: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("broadcast_listen", {
        "messageType": message_type
    })

def stop_listening(
    message_type: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("broadcast_stop_listening", {
        "messageType": message_type
    })

def clear_broadcast_log(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("broadcast_clear_log", {})

def get_active_listeners(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("broadcast_get_listeners", {})

def main():
    if len(sys.argv) < 2:
        print("用法: python broadcast.py <command> [args]")
        print("命令:")
        print("  get-log [limit] [message_type]")
        print("  listen <message_type>")
        print("  stop-listening <message_type>")
        print("  clear-log")
        print("  get-listeners")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "get-log":
            limit = int(sys.argv[2]) if len(sys.argv) > 2 else 50
            message_type = sys.argv[3] if len(sys.argv) > 3 else None
            result = get_broadcast_log(limit, message_type, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "listen":
            message_type = sys.argv[2]
            result = listen_broadcast(message_type, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "stop-listening":
            message_type = sys.argv[2]
            result = stop_listening(message_type, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "clear-log":
            result = clear_broadcast_log(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "get-listeners":
            result = get_active_listeners(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
