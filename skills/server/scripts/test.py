#!/usr/bin/env python3
"""
Cocos HTTP 伺服器連線測試
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "libs"))
from libs.client import CocosClient


def test_connection(host: str = "127.0.0.1", port: int = 8080):
    """測試連接"""
    print(f"🔌 測試連接: {host}:{port}")
    print("-" * 50)
    
    client = CocosClient(host, port)
    
    result = client.execute("server_health", {})
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    return result.get("success")


if __name__ == "__main__":
    host = "127.0.0.1"
    port = 8080
    
    if len(sys.argv) > 1:
        host = sys.argv[1]
    if len(sys.argv) > 2:
        port = int(sys.argv[2])
    
    if not test_connection(host, port):
        sys.exit(1)
