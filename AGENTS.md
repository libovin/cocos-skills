# AGENTS.md - Cocos Creator Skill Development Guide

This document guides agentic coding assistants working on the cocos-skill project, which provides HTTP-based automation for Cocos Creator Editor operations.

## Build/Lint/Test Commands

**Note**: This project is a Python 3.8+ library with no package.json, pyproject.toml, or automated test framework. Code is used directly by importing modules.

### Running Manual Tests
```bash
# Test client connection (requires Cocos Creator HTTP server running)
python scripts/client.py

# Test prefab helper utilities
python scripts/prefab_helper.py
```

### Linting
No automated linting configured. Follow the code style guidelines below.

## Code Style Guidelines

### Language and Environment
- **Python Version**: 3.8+
- **Dependencies**: Standard library only (json, os, pathlib, urllib, typing)
- **Encoding**: UTF-8 for all files

### Imports
```python
# Group 1: Standard library imports
import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Set
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

# Group 2: Local/relative imports (with blank line separator)
from client import execute
```

- Order: Standard library → third-party (if any) → local imports
- Blank line between groups
- Use absolute imports from `scripts/` directory
- Type hints from `typing` module always imported

### Type Hints
- **Always include** type hints for function signatures
- Use `typing` module types: `Any`, `Dict`, `List`, `Optional`, `Set`, `Tuple`
- Return type hints required for all functions
```python
def execute(module: str, action: str, params: List[Any] = None) -> Dict[str, Any]:
    client = get_client()
    return client.execute(module, action, params)
```

### Naming Conventions
- **Classes**: PascalCase (`CocosClient`, `PrefabBuilder`)
- **Functions/Methods**: snake_case (`health_check`, `get_status`, `_validate_module_action`)
- **Constants**: UPPER_CASE with underscores (`VALID_MODULES`, `LAYER_UI`)
- **Variables**: snake_case (`base_url`, `node_name`, `comp_index`)
- **Private members**: Leading underscore (`_load_server_url_from_config`, `_client_cache`)

### Error Handling
- Wrap HTTP operations in try-except
- Return standardized dict response format:
```python
{
    "success": False,
    "error": "error message",
    "data": None
}
```
- Specific error types: `HTTPError`, `URLError`, generic `Exception` fallback
- Do NOT raise exceptions; return error dict instead
- Use silent error handling with bare `except Exception: pass` where appropriate

### Documentation
- **Docstrings**: Use Google-style docstrings in Chinese
- Triple double quotes `"""` for docstrings
- Include Args, Returns, Raises sections where applicable
```python
def _validate_module_action(self, module: str, action: str) -> None:
    """
    验证模块和操作是否有效

    Args:
        module: 模块名称
        action: 操作名称

    Raises:
        ValueError: 如果模块或操作无效
    """
```

### Code Organization
- **Module-level constants** at file top after imports
- **Classes** with clear separation of concerns
- **Method groups** separated by comment sections: `# ========= Section Name ==========`
- **Private methods** prefixed with underscore
- **Public API** methods exposed at module level (singleton pattern)

### Class Structure
```python
class ClassName:
    """Docstring describing class purpose"""

    # Class constants (UPPER_CASE)
    CONSTANT_NAME = value

    def __init__(self, param: type, param2: Optional[type] = None):
        """Docstring"""
        self.param = param
        self.param2 = param2 or default_value

    def public_method(self) -> ReturnType:
        """Docstring"""
        pass

    def _private_method(self) -> ReturnType:
        """Docstring"""
        pass
```

### API Response Format
All HTTP API calls must return dict with:
```python
{
    "success": True/False,
    "data": {...},  # or None
    "error": None  # or error message string
}
```

### Constants and Configuration
- Module-level constants defined in uppercase
- Use `Dict[str, Set[str]]` for module/action validation lists
- Boolean options default to `None` with optional overrides
- Cache mutable module-level variables with `Optional[T] = None`

### Comments
- Section dividers: `# ========================================================================`
- Inline comments: `# comment` on same line or above
- Keep comments concise and in Chinese (matching docstrings)
- Comment complex logic, not obvious code

### File Organization
- `scripts/client.py`: Main HTTP client and global functions
- `scripts/prefab_helper.py`: Prefab building utilities
- `skills/{module}/SKILL.md`: Module documentation in YAML frontmatter + Markdown
- No `__init__.py` files (scripts imported as standalone modules)

### HTTP Communication
- Use `urllib.request.Request` and `urlopen` from standard library
- Set `Content-Type: application/json` header for POST requests
- JSON encode data: `json.dumps(data).encode()`
- Default timeout: 30 seconds
- Return parsed JSON: `json.loads(response.read().decode())`

### Data Structures
- Use `List[Dict[str, Any]]` for prefab/scene data arrays
- UUID references: `{"__id__": index}` for intra-file references
- Asset paths: Use `db://assets/...` format for Cocos Creator URLs
- Use `__type__` field for Cocos Creator object type identification

### Testing
- Manual testing through direct script execution
- Main block test code in `if __name__ == "__main__":`
- Example usage in module docstrings
