# Server API 參考

Cocos Creator HTTP 伺服器管理的完整 API 參考。

## API 列表

| API | 功能 | HTTP 方法 |
|-----|------|----------|
| health | 健康檢查 | GET |
| get_status | 獲取伺服器狀態 | GET |
| get_tools | 獲取可用工具列表 | GET |
| server_get_ip_list | 查詢 IP 列表 | GET |
| server_get_sorted_ip_list | 查詢排序後的 IP 列表 | GET |
| server_get_port | 查詢伺服器埠號 | GET |
| server_get_network_interfaces | 獲取網絡接口 | GET |

---

## health

檢查 Cocos Creator HTTP 伺服器是否正常運行。

### 請求

```python
from libs.client import health_check

health_check()
# 或指定 host 和 port
health_check(host="192.168.1.100", port=8080)
```

### 響應

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### 錯誤處理

- 連線失敗: `{"success": false, "error": "連接失敗: ..."}`
- 伺服器錯誤: `{"success": false, "error": "HTTP 500: ..."}`

---

## get_status

獲取 Cocos Creator HTTP 伺服器的當前狀態資訊。

### 請求

```python
from libs.client import get_server_status

get_server_status()
```

### 響應

```json
{
  "success": true,
  "data": {
    "version": "3.x",
    "editorVersion": "3.8.0",
    "platform": "editor",
    "features": [
      "scene",
      "node",
      "prefab",
      "component"
    ]
  }
}
```

### 響應欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| version | string | 伺服器版本 |
| editorVersion | string | Cocos Creator 編輯器版本 |
| platform | string | 運作平台 (editor / runtime) |
| features | array | 可用的功能模組列表 |

---

## get_tools

列出 Cocos Creator HTTP 伺服器所有可用的 API 工具。

### 請求

```python
from libs.client import get_tools_list

get_tools_list()
```

### 響應

```json
{
  "success": true,
  "data": {
    "tools": [
      {
        "name": "scene_get_current",
        "description": "Get current scene info"
      },
      {
        "name": "node_create",
        "description": "Create a new node"
      },
      {
        "name": "prefab_instantiate",
        "description": "Instantiate a prefab"
      }
    ]
  }
}
```

### 可用工具分類

- **scene_***: 場景操作相關
- **node_***: 節點操作相關
- **prefab_***: 預製體操作相關
- **component_***: 組件操作相關
- **asset_***: 資源操作相關

---

## server_get_ip_list

查詢伺服器可用的 IP 地址。

### 請求

```python
from libs.client import query_ip_list

query_ip_list()
```

### 響應

```json
{
  "success": true,
  "data": {
    "ips": [
      "127.0.0.1",
      "192.168.1.100",
      "10.0.0.5"
    ]
  }
}
```

---

## server_get_sorted_ip_list

獲取排序後的 IP 地址列表（優先本地回環地址）。

### 請求

```python
from libs.client import query_sorted_ip_list

query_sorted_ip_list()
```

### 響應

```json
{
  "success": true,
  "data": {
    "ips": [
      "127.0.0.1",
      "10.0.0.5",
      "192.168.1.100"
    ]
  }
}
```

---

## server_get_port

查詢伺服器當前監聽的埠號。

### 請求

```python
from libs.client import query_port

query_port()
```

### 響應

```json
{
  "success": true,
  "data": {
    "port": 8080
  }
}
```

---

## server_get_network_interfaces

獲取本地系統的網絡接口信息。

### 請求

```python
from libs.client import get_network_interfaces

get_network_interfaces()
```

### 響應

```json
{
  "success": true,
  "data": {
    "interfaces": [
      {
        "ip": "127.0.0.1",
        "family": "IPv4",
        "hostname": "localhost"
      },
      {
        "ip": "192.168.1.100",
        "family": "IPv4",
        "hostname": "DESKTOP-XXX"
      }
    ]
  }
}
```

---

## 連線參數

| 參數 | 類型 | 說明 | 預設值 |
|------|------|------|--------|
| host | string | 伺服器地址 | 127.0.0.1 |
| port | integer | 埠號 | 8080 |

---

## 錯誤處理策略

所有工具返回統一的錯誤格式：

```json
{
  "success": false,
  "error": "錯誤訊息",
  "data": null
}
```

### 常見錯誤

| 錯誤 | 原因 | 解決方案 |
|------|------|----------|
| Connection refused | 伺服器未啟動或埠號錯誤 | 啟動 Cocos Creator |
| HTTP 500 | 伺服器內部錯誤 | 檢查編輯器日誌 |
| Timeout | 伺服器響應超時 | 重試或檢查網絡 |

---

## 使用範例

```python
# 診斷連線問題
if health_check()["success"]:
    print("伺服器正常")
else:
    print("伺服器異常，請檢查")

# 獲取伺服器信息
status = get_server_status()
print(f"編輯器版本: {status['data']['editorVersion']}")

# 列出所有可用工具
tools = get_tools_list()
for tool in tools["data"]["tools"]:
    print(f"- {tool['name']}: {tool['description']}")

# 自動選擇最佳連接
ips = query_sorted_ip_list()["data"]["ips"]
for ip in ips:
    if health_check(host=ip)["success"]:
        print(f"使用 IP: {ip}")
        break
```
