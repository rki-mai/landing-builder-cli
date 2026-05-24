"""
Render HTML from a storage draft snapshot.

Input: JSON array returned by GET /api/v1/storage/{project_id}
(each item is the latest state of an element after mutation collapse).
"""

from __future__ import annotations

import html
import re
from typing import Any

PAGE_STYLES = """
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      margin: 0;
      padding: 20px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    p { margin: 0 0 16px 0; }
    img { max-width: 100%; height: auto; display: block; }
    a { color: #007bff; }
    a[role="button"] {
      display: inline-block;
      text-decoration: none;
      cursor: pointer;
    }
"""


def camel_to_kebab(name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()


def styles_attr(element: dict[str, Any]) -> str:
    raw = element.get("styles") or element.get("style") or {}
    if not isinstance(raw, dict) or not raw:
        return ""
    parts: list[str] = []
    for key, value in raw.items():
        if value is None:
            continue
        parts.append(f"{camel_to_kebab(str(key))}: {value}")
    if not parts:
        return ""
    return f' style="{"; ".join(parts)}"'


def _read_parent_id(item: dict[str, Any]) -> tuple[str | None, int]:
    parent = item.get("parentId", item.get("parent_id"))
    if parent is None or parent == "":
        parent_id = None
    else:
        parent_id = str(parent)
    index = int(item.get("index", 0) or 0)
    return parent_id, index


def parse_storage_draft(data: Any) -> tuple[list[dict[str, Any]], list[str]]:
    if not isinstance(data, list):
        raise ValueError(
            "Expected a JSON array (storage draft snapshot from GET /api/v1/storage/{project_id})"
        )

    elements: list[dict[str, Any]] = []
    placements: list[tuple[str | None, int, str]] = []

    for item in data:
        if not isinstance(item, dict):
            continue
        if item.get("deleted"):
            continue

        eid = item.get("id")
        kind = item.get("element")
        if not eid or not kind:
            raise ValueError("Each element must have 'id' and 'element' fields")

        parent_id, index = _read_parent_id(item)
        el = {
            k: v
            for k, v in item.items()
            if k not in {"parentId", "parent_id", "index", "deleted", "_id"}
        }
        el.setdefault("children", [])
        elements.append(el)
        placements.append((parent_id, index, str(eid)))

    return _attach_children(elements, placements)


def _attach_children(
    elements: list[dict[str, Any]],
    placements: list[tuple[str | None, int, str]],
) -> tuple[list[dict[str, Any]], list[str]]:
    by_id = {str(el["id"]): el for el in elements}
    root_pairs: list[tuple[int, str]] = []

    for parent_id, index, eid in placements:
        if parent_id in (None, "root"):
            root_pairs.append((index, eid))
        elif parent_id not in by_id:
            root_pairs.append((index, eid))
        else:
            by_id[parent_id].setdefault("_child_pairs", []).append((index, eid))

    for el in by_id.values():
        pairs = el.pop("_child_pairs", [])
        pairs.sort(key=lambda x: x[0])
        el["children"] = [cid for _, cid in pairs]

    root_pairs.sort(key=lambda x: x[0])
    root_ids = [cid for _, cid in root_pairs]

    if not root_ids:
        referenced: set[str] = set()
        for el in by_id.values():
            for child_id in el.get("children") or []:
                referenced.add(str(child_id))
        root_ids = [eid for eid in by_id if eid not in referenced]

    return list(by_id.values()), root_ids


def render_elements(elements: list[dict[str, Any]], element_ids: list[str]) -> str:
    by_id = {str(el["id"]): el for el in elements}
    return "".join(
        render_element(by_id[eid], by_id) for eid in element_ids if eid in by_id
    )


def render_element(element: dict[str, Any], by_id: dict[str, dict[str, Any]]) -> str:
    kind = str(element.get("element", ""))
    children_ids = [str(c) for c in (element.get("children") or [])]
    inner = render_elements(list(by_id.values()), children_ids)

    style = styles_attr(element)
    eid = html.escape(str(element.get("id", "")))
    id_attr = f' id="{eid}"' if eid else ""

    if kind == "text":
        return f"<p{id_attr}{style}>{html.escape(str(element.get('value', '')))}</p>"

    if kind == "container":
        return f"<div{id_attr}{style}>{inner}</div>"

    if kind == "link":
        href = html.escape(str(element.get("src", "#")))
        label = html.escape(str(element.get("value", "")))
        return f'<a{id_attr} href="{href}"{style}>{label}{inner}</a>'

    if kind == "image":
        src = html.escape(str(element.get("value") or element.get("src", "")))
        alt = html.escape(str(element.get("alt", "")))
        return f'<img{id_attr} src="{src}" alt="{alt}"{style} />'

    if kind == "button":
        label = html.escape(str(element.get("value", "")))
        target = element.get("src")
        if target:
            return (
                f'<a{id_attr} href="{html.escape(str(target))}" role="button"{style}>'
                f"{label}</a>"
            )
        return f"<button{id_attr}{style}>{label}</button>"

    safe_kind = html.escape(kind)
    return (
        f'<div{id_attr}{style} data-unknown-element="{safe_kind}">'
        f"<!-- unsupported: {safe_kind} -->"
        f"</div>"
    )


def build_html_page(draft: Any, *, title: str = "Landing") -> str:
    elements, root_ids = parse_storage_draft(draft)
    body = render_elements(elements, root_ids)
    safe_title = html.escape(title)
    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{safe_title}</title>
  <style>{PAGE_STYLES}</style>
</head>
<body>
{body}
</body>
</html>
"""
