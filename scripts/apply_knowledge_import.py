#!/usr/bin/env python3
"""Apply one isolated knowledge-import artifact to the shared knowledge base."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path, PurePosixPath
from typing import Any


ALLOWED_PREFIXES = (
    PurePosixPath("knowledge-base/sources/uploads"),
    PurePosixPath("knowledge-base/documents/uploads"),
    PurePosixPath("knowledge-base/reviews"),
)


def checked_relative_path(value: str) -> PurePosixPath:
    path = PurePosixPath(value)
    if path.is_absolute() or ".." in path.parts:
        raise ValueError(f"不安全的导入路径：{value}")
    if not any(path == prefix or prefix in path.parents for prefix in ALLOWED_PREFIXES):
        raise ValueError(f"导入路径不属于允许目录：{value}")
    return path


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def merge_entries(existing: list[dict[str, Any]], incoming: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged = list(existing)
    by_id = {str(entry.get("id")): entry for entry in existing}
    for entry in incoming:
        entry_id = str(entry.get("id") or "").strip()
        if not entry_id:
            raise ValueError("结构化知识缺少 id。")
        previous = by_id.get(entry_id)
        if previous is not None:
            if previous != entry:
                raise ValueError(f"知识 ID 冲突：{entry_id}")
            continue
        by_id[entry_id] = entry
        merged.append(entry)
    return merged


def apply_import(artifact_root: Path, output_root: Path, result_path: Path) -> dict[str, Any]:
    result = json.loads(result_path.read_text(encoding="utf-8"))
    managed_paths = [
        checked_relative_path(str(result["source_path"])),
        checked_relative_path(str(result["document_path"])),
        checked_relative_path(f"knowledge-base/reviews/{result['job_id']}.json"),
    ]

    for relative in managed_paths:
        source = artifact_root.joinpath(*relative.parts)
        target = output_root.joinpath(*relative.parts)
        if not source.is_file():
            raise FileNotFoundError(f"导入产物缺少文件：{relative.as_posix()}")
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)

    jsonl_path = output_root / "knowledge-base" / "import" / "knowledge.jsonl"
    entries = merge_entries(load_jsonl(jsonl_path), list(result.get("entries") or []))
    jsonl_path.parent.mkdir(parents=True, exist_ok=True)
    jsonl_path.write_text(
        "".join(json.dumps(entry, ensure_ascii=False, separators=(",", ":")) + "\n" for entry in entries),
        encoding="utf-8",
    )
    return result


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--artifact-root", required=True)
    parser.add_argument("--output-root", required=True)
    parser.add_argument("--result", required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    result = apply_import(
        Path(args.artifact_root).resolve(),
        Path(args.output_root).resolve(),
        Path(args.result).resolve(),
    )
    print(json.dumps({
        "job_id": result["job_id"],
        "entry_count": len(result.get("entries") or []),
        "document_path": result["document_path"],
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
