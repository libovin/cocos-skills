"""
Cocos Creator HTTP 客户端
统一 HTTP 通信模块，供所有 Skill 调用
通用执行器 API - 直接调用 Editor.Message.request
从配置文件读取服务器地址
"""

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Set
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


# ============================================================================
# 已知的模块和操作列表 (用于快速验证)
# ============================================================================

VALID_MODULES: Dict[str, Set[str]] = {
    # Scene module - 53 actions (与 @cocos-http VALID_MODULES 同步)
    "scene": {
        "open-scene",
        "save-scene",
        "save-as-scene",
        "close-scene",
        "set-property",
        "reset-property",
        "move-array-element",
        "remove-array-element",
        "copy-node",
        "duplicate-node",
        "paste-node",
        "cut-node",
        "set-parent",
        "create-node",
        "remove-node",
        "reset-node",
        "reset-component",
        "restore-prefab",
        "create-component",
        "remove-component",
        "execute-component-method",
        "execute-scene-script",
        "snapshot",
        "snapshot-abort",
        "soft-reload",
        "change-gizmo-tool",
        "query-gizmo-tool-name",
        "change-gizmo-pivot",
        "query-gizmo-pivot",
        "change-gizmo-coordinate",
        "query-gizmo-coordinate",
        "change-is2D",
        "query-is2D",
        "set-grid-visible",
        "query-is-grid-visible",
        "set-icon-gizmo-3d",
        "query-is-icon-gizmo-3d",
        "set-icon-gizmo-size",
        "query-icon-gizmo-size",
        "focus-camera",
        "align-with-view",
        "align-view-with-node",
        "query-is-ready",
        "query-node",
        "query-component",
        "query-node-tree",
        "query-nodes-by-asset-uuid",
        "query-dirty",
        "query-classes",
        "query-components",
        "query-component-has-script",
        "query-scene-bounds",
        "is-native",
    },
    # Asset DB module - 20 actions (与 @cocos-http VALID_MODULES 同步)
    "asset-db": {
        "query-ready",
        "create-asset",
        "import-asset",
        "copy-asset",
        "move-asset",
        "delete-asset",
        "open-asset",
        "save-asset",
        "save-asset-meta",
        "reimport-asset",
        "refresh-asset",
        "query-asset-info",
        "query-missing-asset-info",
        "query-asset-meta",
        "query-asset-users",
        "query-asset-dependencies",
        "query-path",
        "query-url",
        "query-uuid",
        "query-assets",
        "generate-available-url",
    },
    # Project module - 3 actions (与 @cocos-http VALID_MODULES 同步)
    "project": {
        "open-settings",
        "query-config",
        "set-config",
    },
    # Builder module - 2 actions (与 @cocos-http VALID_MODULES 同步)
    "builder": {
        "open",
        "query-worker-ready",
    },
    # Engine module - 2 actions (与 @cocos-http VALID_MODULES 同步)
    "engine": {
        "query-info",
        "query-engine-info",
    },
    # Information module - 4 actions (与 @cocos-http VALID_MODULES 同步)
    "information": {
        "query-information",
        "open-information-dialog",
        "has-dialog",
        "close-dialog",
    },
    # Preferences module - 3 actions (与 @cocos-http VALID_MODULES 同步)
    "preferences": {
        "open-settings",
        "query-config",
        "set-config",
    },
    # Program module - 3 actions (与 @cocos-http VALID_MODULES 同步)
    "program": {
        "query-program-info",
        "open-program",
        "open-url",
    },
    # Programming module - 2 actions (与 @cocos-http VALID_MODULES 同步)
    "programming": {
        "query-shared-settings",
        "query-sorted-plugins",
    },
    # Server module - 2 actions (与 @cocos-http VALID_MODULES 同步)
    "server": {
        "query-ip-list",
        "query-port",
    },
    # Device module - 1 action (与 @cocos-http VALID_MODULES 同步)
    "device": {
        "query",
    },
    # Extension module - 1 action (与 @cocos-http VALID_MODULES 同步)
    "extension": {
        "create-extension-template",
    },
}


class CocosClient:
    """HTTP 客户端用于与 Cocos Creator HTTP 服务器通信"""

    def __init__(self, timeout: int = 30, validate: bool = True):
        # 从配置文件读取服务器地址
        self.base_url = self._load_server_url_from_config()

        if self.base_url:
            # 从配置文件 URL 解析 host 和 port
            url_parts = self.base_url.replace('http://', '').split(':')
            if len(url_parts) == 2:
                self.host = url_parts[0]
                self.port = int(url_parts[1])
            else:
                self.host = url_parts[0]
                self.port = 54321
        else:
            # 使用默认值
            self.host = "127.0.0.1"
            self.port = 54321
            self.base_url = f"http://{self.host}:{self.port}"

        self.timeout = timeout
        self.validate = validate
        self._cached_modules: Optional[Dict[str, Set[str]]] = None

    def _load_server_url_from_config(self) -> Optional[str]:
        """从全局配置文件加载服务器 URL"""
        try:
            home = Path.home()
            config_dir = home / '.cocos-http'
            config_path = config_dir / 'cocos-http.json'

            if not config_path.exists():
                return None

            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)

            project_name = self._get_current_project_name()

            if project_name and 'projects' in config:
                project_config = config['projects'].get(project_name)
                if project_config and 'serverUrl' in project_config:
                    return project_config['serverUrl']

            if 'currentProject' in config and 'projects' in config:
                current_project = config['currentProject']
                project_config = config['projects'].get(current_project)
                if project_config and 'serverUrl' in project_config:
                    return project_config['serverUrl']

        except Exception:
            pass

        return None

    def _get_current_project_name(self) -> Optional[str]:
        """获取当前项目名称"""
        try:
            project_path = os.environ.get('COCOS_PROJECT_PATH')
            if not project_path:
                current_path = Path.cwd()
                for _ in range(5):
                    if (current_path / 'settings').exists() or (current_path / 'assets').exists():
                        project_path = str(current_path)
                        break
                    current_path = current_path.parent

            if project_path:
                return Path(project_path).name
        except Exception:
            pass

        return None

    # ========================================================================
    # 模块和操作验证
    # ========================================================================

    def _validate_module_action(self, module: str, action: str) -> None:
        """
        验证模块和操作是否有效

        Args:
            module: 模块名称
            action: 操作名称

        Raises:
            ValueError: 如果模块或操作无效
        """
        if not self.validate:
            return

        # 首先检查本地已知列表
        if module in VALID_MODULES:
            if action in VALID_MODULES[module]:
                return  # 验证通过
            # 如果模块已知但操作未知，可能是新操作，尝试从服务器验证
        else:
            # 模块未知，尝试从服务器验证
            pass

        # 从服务器获取可用的模块和操作
        available = self._get_available_modules()
        if module not in available:
            raise ValueError(
                f"无效的模块: '{module}'. "
                f"可用的模块: {', '.join(sorted(available.keys()))}"
            )

        if action not in available[module]:
            raise ValueError(
                f"无效的操作: '{action}' (模块: '{module}'). "
                f"可用的操作: {', '.join(sorted(available[module]))}"
            )

    def _get_available_modules(self) -> Dict[str, Set[str]]:
        """
        从服务器获取可用的模块和操作列表

        Returns:
            字典，key 是模块名，value 是操作集合
        """
        if self._cached_modules is not None:
            return self._cached_modules

        try:
            # 获取模块列表
            result = self._request("GET", "/api/modules")
            if result.get("success"):
                modules = result.get("data", [])
                self._cached_modules = {}

                for module_name in modules:
                    # 获取每个模块的操作列表
                    actions_result = self._request("GET", f"/api/modules/{module_name}/actions")
                    if actions_result.get("success"):
                        actions = actions_result.get("data", [])
                        self._cached_modules[module_name] = set(actions)
                    else:
                        self._cached_modules[module_name] = set()

                return self._cached_modules
        except Exception:
            pass

        # 如果无法从服务器获取，返回本地已知列表
        return VALID_MODULES

    def invalidate_cache(self) -> None:
        """清除模块和操作缓存"""
        self._cached_modules = None

    # ========================================================================
    # HTTP 请求
    # ========================================================================

    def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """发送 HTTP 请求"""
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
                "error": f"连接失败: {e.reason}",
                "data": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": None
            }

    # ========================================================================
    # 服务器状态接口
    # ========================================================================

    def health_check(self) -> Dict[str, Any]:
        """健康检查 - GET /api/server/health"""
        return self._request("GET", "/api/server/health")

    def get_status(self) -> Dict[str, Any]:
        """获取服务器状态 - GET /api/server/status"""
        return self._request("GET", "/api/server/status")

    # ========================================================================
    # 模块和操作查询接口
    # ========================================================================

    def get_modules(self) -> Dict[str, Any]:
        """获取所有可用模块列表 - GET /api/modules"""
        return self._request("GET", "/api/modules")

    def get_module_actions(self, module: str) -> Dict[str, Any]:
        """获取指定模块的所有操作 - GET /api/modules/{module}/actions"""
        return self._request("GET", f"/api/modules/{module}/actions")

    # ========================================================================
    # 通用执行器
    # ========================================================================

    def execute(
        self,
        module: str,
        action: str,
        params: List[Any] = None,
        validate: bool = None
    ) -> Dict[str, Any]:
        if validate is None:
            validate = self.validate

        if validate:
            self._validate_module_action(module, action)

        return self._request(
            "POST",
            f"/api/{module}/{action}",
            {"params": params or []}
        )


# ============================================================================
# 全局便捷函數
# ============================================================================

_client_cache: Optional[CocosClient] = None


def get_client() -> CocosClient:
    """获取客户端实例（单例模式）"""
    global _client_cache
    if _client_cache is None:
        _client_cache = CocosClient()
    return _client_cache


def health_check() -> Dict[str, Any]:
    """健康检查"""
    client = get_client()
    return client.health_check()


def get_status() -> Dict[str, Any]:
    """获取服务器状态"""
    client = get_client()
    return client.get_status()


def get_modules() -> Dict[str, Any]:
    """获取所有可用模块"""
    client = get_client()
    return client.get_modules()


def get_module_actions(module: str) -> Dict[str, Any]:
    """获取指定模块的所有操作"""
    client = get_client()
    return client.get_module_actions(module)


def execute(
    module: str,
    action: str,
    params: List[Any] = None
) -> Dict[str, Any]:
    """执行 API 调用"""
    client = get_client()
    return client.execute(module, action, params)


def validate_module_action(module: str, action: str) -> bool:
    """
    验证模块和操作是否有效

    Args:
        module: 模块名称
        action: 操作名称

    Returns:
        True if 有效，False if 无效
    """
    client = get_client()
    try:
        client._validate_module_action(module, action)
        return True
    except ValueError:
        return False


def get_VALID_MODULES() -> Dict[str, Set[str]]:
    """
    获取本地已知的模块和操作列表

    Returns:
        字典，key 是模块名，value 是操作集合
    """
    return VALID_MODULES.copy()


def list_all_modules() -> List[str]:
    """
    列出所有已知的模块名称

    Returns:
        模块名称列表
    """
    return sorted(VALID_MODULES.keys())


def list_module_actions(module: str) -> List[str]:
    """
    列出指定模块的所有已知操作

    Args:
        module: 模块名称

    Returns:
        操作名称列表
    """
    return sorted(VALID_MODULES.get(module, set()))


def is_module_known(module: str) -> bool:
    """
    检查模块是否已知

    Args:
        module: 模块名称

    Returns:
        True if 模块已知，False if 未知
    """
    return module in VALID_MODULES


def is_action_known(module: str, action: str) -> bool:
    """
    检查操作是否已知

    Args:
        module: 模块名称
        action: 操作名称

    Returns:
        True if 操作已知，False if 未知
    """
    return action in VALID_MODULES.get(module, set())
