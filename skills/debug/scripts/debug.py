import sys
import json
from typing import Dict, Any, Optional
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "libs"))
from libs.client import get_client

def get_console_logs(
    limit: int = 100,
    filter: str = "all",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("debug_console_logs", {
        "limit": limit,
        "filter": filter
    })

def clear_console(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("debug_clear_console", {})

def execute_script(
    script: str,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("debug_execute_script", {
        "script": script
    })

def get_node_tree(
    root_uuid: Optional[str] = None,
    max_depth: int = 10,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {"maxDepth": max_depth}
    if root_uuid:
        args["rootUuid"] = root_uuid

    client = get_client(host, port)
    return client.execute("debug_node_tree", args)

def get_performance_stats(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("debug_performance_stats", {})

def validate_scene(
    check_missing_assets: bool = True,
    check_performance: bool = True,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("debug_validate_scene", {
        "checkMissingAssets": check_missing_assets,
        "checkPerformance": check_performance
    })

def get_editor_info(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("debug_editor_info", {})

def get_project_logs(
    lines: int = 100,
    filter_keyword: Optional[str] = None,
    log_level: str = "ALL",
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    args = {
        "lines": lines,
        "logLevel": log_level
    }
    if filter_keyword:
        args["filterKeyword"] = filter_keyword

    client = get_client(host, port)
    return client.execute("debug_project_logs", args)

def get_log_file_info(
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("debug_log_file_info", {})

def search_project_logs(
    pattern: str,
    max_results: int = 20,
    context_lines: int = 2,
    host: str = "127.0.0.1",
    port: int = 8080
) -> Dict[str, Any]:
    client = get_client(host, port)
    return client.execute("debug_search_logs", {
        "pattern": pattern,
        "maxResults": max_results,
        "contextLines": context_lines
    })

def main():
    if len(sys.argv) < 2:
        print("用法: python debug.py <command> [args]")
        print("命令:")
        print("  console-logs [limit] [filter]")
        print("  clear-console")
        print("  execute-script <script>")
        print("  node-tree [root_uuid] [max_depth]")
        print("  performance-stats")
        print("  validate-scene [check_missing_assets] [check_performance]")
        print("  editor-info")
        print("  project-logs [lines] [filter_keyword] [log_level]")
        print("  log-file-info")
        print("  search-logs <pattern> [max_results] [context_lines]")
        sys.exit(1)

    cmd = sys.argv[1]
    host = "127.0.0.1"
    port = 8080

    try:
        if cmd == "console-logs":
            limit = int(sys.argv[2]) if len(sys.argv) > 2 else 100
            filter_val = sys.argv[3] if len(sys.argv) > 3 else "all"
            result = get_console_logs(limit, filter_val, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "clear-console":
            result = clear_console(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "execute-script":
            script = sys.argv[2]
            result = execute_script(script, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "node-tree":
            root_uuid = sys.argv[2] if len(sys.argv) > 2 else None
            max_depth = int(sys.argv[3]) if len(sys.argv) > 3 else 10
            result = get_node_tree(root_uuid, max_depth, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "performance-stats":
            result = get_performance_stats(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "validate-scene":
            check_missing = sys.argv[2].lower() == "true" if len(sys.argv) > 2 else True
            check_perf = sys.argv[3].lower() == "true" if len(sys.argv) > 3 else True
            result = validate_scene(check_missing, check_perf, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "editor-info":
            result = get_editor_info(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "project-logs":
            lines = int(sys.argv[2]) if len(sys.argv) > 2 else 100
            filter_kw = sys.argv[3] if len(sys.argv) > 3 else None
            log_lvl = sys.argv[4] if len(sys.argv) > 4 else "ALL"
            result = get_project_logs(lines, filter_kw, log_lvl, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "log-file-info":
            result = get_log_file_info(host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif cmd == "search-logs":
            pattern = sys.argv[2]
            max_res = int(sys.argv[3]) if len(sys.argv) > 3 else 20
            ctx_lines = int(sys.argv[4]) if len(sys.argv) > 4 else 2
            result = search_project_logs(pattern, max_res, ctx_lines, host, port)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"未知命令: {cmd}")
            sys.exit(1)
    except Exception as e:
        print(f"錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
