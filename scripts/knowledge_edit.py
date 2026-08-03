from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import re
import sys
from pathlib import Path
from typing import Any


CONFIDENCE_VALUES = {"high", "medium_high", "medium", "low_medium"}
MAX_TEXT_LENGTH = 12_000


def decode_payload(value: str) -> dict[str, Any]:
    padding = "=" * (-len(value) % 4)
    try:
        decoded = base64.urlsafe_b64decode(value + padding).decode("utf-8")
        payload = json.loads(decoded)
    except (ValueError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ValueError("编辑请求不是有效的 Base64URL JSON。") from error
    if not isinstance(payload, dict):
        raise ValueError("编辑请求必须是 JSON 对象。")
    return payload


def clean_text(value: Any, limit: int) -> str:
    return str(value or "").replace("\x00", "").strip()[:limit]


def validate_payload(payload: dict[str, Any]) -> dict[str, Any]:
    info_id = clean_text(payload.get("info_id"), 160)
    editor = clean_text(payload.get("editor"), 120)
    title = clean_text(payload.get("title"), 160)
    text = clean_text(payload.get("text"), MAX_TEXT_LENGTH)
    source_url = clean_text(payload.get("source_url"), 1200)
    source_type = clean_text(payload.get("source_type"), 80) or "user_upload"
    confidence = clean_text(payload.get("confidence"), 40)
    raw_tags = payload.get("tags", [])

    if not re.fullmatch(r"[\w.-]{1,160}", info_id, flags=re.UNICODE):
        raise ValueError("InfoID 格式无效。")
    if not editor:
        raise ValueError("缺少编辑者身份。")
    if not title:
        raise ValueError("标题不能为空。")
    if len(text) < 20:
        raise ValueError("知识正文至少需要 20 个字符。")
    if not source_url:
        raise ValueError("来源 URL 或来源说明不能为空。")
    if confidence not in CONFIDENCE_VALUES:
        raise ValueError("可信度取值无效。")
    if not isinstance(raw_tags, list):
        raise ValueError("标签必须是数组。")
    tags = list(dict.fromkeys(clean_text(tag, 40) for tag in raw_tags if clean_text(tag, 40)))[:12]
    if not tags:
        raise ValueError("至少需要一个检索标签。")

    return {
        "info_id": info_id,
        "editor": editor,
        "title": title,
        "text": text,
        "source_url": source_url,
        "source_type": source_type,
        "confidence": confidence,
        "tags": tags,
    }


def read_entries(path: Path) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            entry = json.loads(line)
        except json.JSONDecodeError as error:
            raise ValueError(f"knowledge.jsonl 第 {line_number} 行不是有效 JSON。") from error
        if not isinstance(entry, dict):
            raise ValueError(f"knowledge.jsonl 第 {line_number} 行必须是 JSON 对象。")
        entries.append(entry)
    return entries


def apply_edit(output_root: Path, payload: dict[str, Any], now: str | None = None) -> dict[str, Any]:
    request = validate_payload(payload)
    jsonl_path = output_root / "knowledge-base" / "import" / "knowledge.jsonl"
    entries = read_entries(jsonl_path)
    matches = [index for index, entry in enumerate(entries) if str(entry.get("id", "")) == request["info_id"]]
    if len(matches) != 1:
        raise ValueError("目标知识条目不存在或 InfoID 不唯一。")

    index = matches[0]
    before = dict(entries[index])
    edited_at = now or dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    try:
        revision = max(1, int(before.get("revision", 1))) + 1
    except (TypeError, ValueError):
        revision = 2

    after = dict(before)
    for field in ("title", "text", "source_url", "source_type", "confidence", "tags"):
        after[field] = request[field]
    after.update({
        "last_edited_by": request["editor"],
        "last_edited_at": edited_at,
        "revision": revision,
    })
    entries[index] = after

    jsonl_path.write_text(
        "".join(json.dumps(entry, ensure_ascii=False, separators=(",", ":")) + "\n" for entry in entries),
        encoding="utf-8",
    )

    changed_fields = [
        field for field in ("title", "text", "source_url", "source_type", "confidence", "tags")
        if before.get(field) != after.get(field)
    ]
    audit_dir = output_root / "knowledge-base" / "edits"
    audit_dir.mkdir(parents=True, exist_ok=True)
    audit_path = audit_dir / f"{request['info_id']}.jsonl"
    audit_record = {
        "info_id": request["info_id"],
        "revision": revision,
        "edited_by": request["editor"],
        "edited_at": edited_at,
        "changed_fields": changed_fields,
        "before": {field: before.get(field) for field in changed_fields},
        "after": {field: after.get(field) for field in changed_fields},
    }
    with audit_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(audit_record, ensure_ascii=False, separators=(",", ":")) + "\n")

    return {
        "info_id": request["info_id"],
        "editor": request["editor"],
        "revision": revision,
        "changed_fields": changed_fields,
        "audit_path": audit_path.relative_to(output_root).as_posix(),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--payload", required=True)
    parser.add_argument("--output-root", required=True)
    args = parser.parse_args()
    result = apply_edit(Path(args.output_root).resolve(), decode_payload(args.payload))
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"knowledge edit failed: {error}", file=sys.stderr)
        raise
