#!/usr/bin/env python3
"""CLI: storage draft JSON -> HTML file."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from renderer import build_html_page


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate HTML from a storage draft JSON (GET /api/v1/storage/{project_id})",
    )
    parser.add_argument(
        "--draft",
        required=True,
        help="Path to JSON file (top-level array of elements)",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Path to write the generated HTML file",
    )
    parser.add_argument(
        "--title",
        default="Landing",
        help="HTML <title> (default: Landing)",
    )
    args = parser.parse_args()

    draft_path = Path(args.draft)
    output_path = Path(args.output)

    if not draft_path.is_file():
        print(f"Draft file not found: {draft_path}", file=sys.stderr)
        return 1

    try:
        draft_data = json.loads(draft_path.read_text(encoding="utf-8"))
        page = build_html_page(draft_data, title=args.title)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(page, encoding="utf-8")
    except (json.JSONDecodeError, ValueError, OSError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(f"HTML written to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
