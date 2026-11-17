"""REQ-09–10 / AC-08: solo biblioteca estándar y módulos del núcleo."""
import ast
from pathlib import Path
import sys

import pytest
import app.validation as core

ROOT = Path(core.__file__).parent


def violations(path: Path, source: str) -> list[str]:
    issues: list[str] = []
    depth = len(path.relative_to(ROOT).parts)
    for node in ast.walk(ast.parse(source)):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name.split(".")[0] not in sys.stdlib_module_names:
                    issues.append(alias.name)
        if isinstance(node, ast.ImportFrom):
            if node.level:
                if node.level > depth:
                    issues.append("importación fuera del núcleo")
            elif not node.module or node.module.split(".")[0] not in sys.stdlib_module_names:
                issues.append(node.module or "importación desconocida")
        if isinstance(node, ast.Name) and node.id in ("eval", "exec", "__import__", "open"):
            issues.append(node.id)
        if isinstance(node, ast.Import) and any(alias.name.split(".")[0] in ("sqlite3", "http", "urllib", "subprocess") for alias in node.names):
            issues.append("persistencia o transporte")
    return issues


def test_core_boundaries_and_public_api() -> None:
    files = list(ROOT.rglob("*.py"))
    assert len(files) > 10
    for path in files:
        assert violations(path, path.read_text()) == [], str(path)
    assert callable(core.dispatch)
    assert core.make_result("correct", "CORRECT_DEFAULT") == {"status": "correct", "feedbackCode": "CORRECT_DEFAULT"}


@pytest.mark.parametrize("module", ["fastapi", "sympy", "react", "pixi", "mafs", "app.api", "jsonschema"])
def test_forbidden_imports_detected(module: str) -> None:
    assert violations(ROOT / "__init__.py", f"import {module}")


def test_escape_and_execution_detected() -> None:
    assert violations(ROOT / "__init__.py", "from ..api import routes")
    assert violations(ROOT / "__init__.py", "eval('1')")
