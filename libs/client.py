"""
Cocos Creator HTTP 客戶端
統一 HTTP 通信模塊，供所有 Skill 調用
"""

import json
import socket
from typing import Any, Dict, List, Optional
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


class CocosClient:
    """HTTP 客戶端用於與 Cocos Creator HTTP 伺服器通信"""

    def __init__(
        self,
        host: str = "127.0.0.1",
        port: int = 8080,
        timeout: int = 30
    ):
        self.base_url = f"http://{host}:{port}"
        self.timeout = timeout

    def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """發送 HTTP 請求"""
        url = f"{self.base_url}{endpoint}"

        try:
            if method.upper() == "GET":
                req = Request(url)
            else:
                req = Request(url, data=json.dumps(data).encode() if data else b"")
                req.add_header("Content-Type", "application/json")

            with urlopen(req, timeout=self.timeout) as response:
                return json.loads(response.read().decode())

        except HTTPError as e:
            return {
                "success": False,
                "error": f"HTTP {e.code}: {e.reason}",
                "data": None
            }
        except URLError as e:
            return {
                "success": False,
                "error": f"連接失敗: {e.reason}",
                "data": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": None
            }

    def health_check(self) -> Dict[str, Any]:
        """健康檢查"""
        return self._request("GET", "/api/health")

    def get_status(self) -> Dict[str, Any]:
        """獲取伺服器狀態"""
        return self._request("GET", "/api/status")

    def get_tools(self) -> Dict[str, Any]:
        """獲取可用工具列表"""
        return self._request("GET", "/api/tools")

    def query_ip_list(self) -> Dict[str, Any]:
        """查詢伺服器 IP 列表"""
        return self._request("GET", "/api/server/ip-list")

    def query_sorted_ip_list(self) -> Dict[str, Any]:
        """查詢排序後的伺服器 IP 列表"""
        return self._request("GET", "/api/server/sorted-ip-list")

    def query_port(self) -> Dict[str, Any]:
        """查詢伺服器埠號"""
        return self._request("GET", "/api/server/port")

    def get_network_interfaces(self) -> Dict[str, Any]:
        """獲取網絡接口信息"""
        interfaces = []
        try:
            hostname = socket.gethostname()
            host_ips = socket.getaddrinfo(hostname, None, socket.AF_INET)
            for ip_info in host_ips:
                interfaces.append({
                    "ip": ip_info[4][0],
                    "family": "IPv4",
                    "hostname": hostname
                })
        except Exception:
            pass

        return {
            "success": True,
            "data": {
                "interfaces": interfaces,
                "message": "網絡接口信息獲取成功"
            }
        }

    def execute(self, tool_name: str, args: Dict[str, Any] = None) -> Dict[str, Any]:
        """執行工具調用"""
        return self._request(
            "POST",
            "/api/execute",
            {"name": tool_name, "parameters": args or {}}
        )


def get_client(host: str = "127.0.0.1", port: int = 8080) -> CocosClient:
    """獲取客戶端實例"""
    return CocosClient(host=host, port=port)


def health_check(host: str = "127.0.0.1", port: int = 8080) -> Dict[str, Any]:
    """健康檢查"""
    client = get_client(host, port)
    return client.health_check()


def get_server_status(host: str = "127.0.0.1", port: int = 8080) -> Dict[str, Any]:
    """獲取伺服器狀態"""
    client = get_client(host, port)
    return client.get_status()


def get_tools_list(host: str = "127.0.0.1", port: int = 8080) -> Dict[str, Any]:
    """獲取工具列表"""
    client = get_client(host, port)
    return client.get_tools()


def query_ip_list(host: str = "127.0.0.1", port: int = 8080) -> Dict[str, Any]:
    """查詢伺服器 IP 列表"""
    client = get_client(host, port)
    return client.query_ip_list()


def query_sorted_ip_list(host: str = "127.0.0.1", port: int = 8080) -> Dict[str, Any]:
    """查詢排序後的伺服器 IP 列表"""
    client = get_client(host, port)
    return client.query_sorted_ip_list()


def query_port(host: str = "127.0.0.1", port: int = 8080) -> Dict[str, Any]:
    """查詢伺服器埠號"""
    client = get_client(host, port)
    return client.query_port()


def get_network_interfaces(host: str = "127.0.0.1", port: int = 8080) -> Dict[str, Any]:
    """獲取網絡接口信息"""
    client = get_client(host, port)
    return client.get_network_interfaces()


def execute_tool(
    tool_name: str,
    args: Dict[str, Any] = None,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    """執行工具"""
    client = get_client(host, port)
    return client.execute(tool_name, args)
