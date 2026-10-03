import base64
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("knowledge_edit.py")
SPEC = importlib.util.spec_from_file_location("knowledge_edit", MODULE_PATH)
knowledge_edit = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(knowledge_edit)


class KnowledgeEditTests(unittest.TestCase):
    def write_delete_fixture(self, root, entries=None):
        entries = entries if entries is not None else [
            {"id": "item-1", "title": "目标知识", "text": "原始正文", "revision": 2, "uploaded_by": "原作者", "tags": ["产品"]},
            {"id": "item-2", "title": "保留知识", "text": "其他内容", "revision": 1},
        ]
        path = root / "knowledge-base" / "import" / "knowledge.jsonl"
        path.parent.mkdir(parents=True)
        path.write_text("".join(json.dumps(entry, ensure_ascii=False) + "\n" for entry in entries), encoding="utf-8")
        return path, entries

    def test_delete_only_target_and_preserve_complete_audit(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            jsonl, entries = self.write_delete_fixture(root)
            result = knowledge_edit.apply_delete(root, {
                "info_id": "item-1", "editor": "测试编辑者", "expected_revision": 2,
            }, now="2026-10-03T08:00:00+00:00")
            self.assertEqual(knowledge_edit.read_entries(jsonl), [entries[1]])
            self.assertEqual(result["action"], "delete")
            self.assertEqual(result["revision"], 3)
            audit = json.loads((root / result["audit_path"]).read_text(encoding="utf-8"))
            self.assertEqual(audit["before"], entries[0])
            self.assertIsNone(audit["after"])
            self.assertEqual(audit["action"], "delete")
            self.assertEqual(audit["edited_by"], "测试编辑者")
            self.assertEqual(audit["edited_at"], "2026-10-03T08:00:00+00:00")

    def test_cli_delete_action_uses_workflow_payload(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            jsonl, entries = self.write_delete_fixture(root)
            payload = {"action": "delete", "info_id": "item-1", "editor": "测试", "expected_revision": 2}
            encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
            process = subprocess.run(
                [sys.executable, str(MODULE_PATH), "--payload", encoded, "--output-root", str(root)],
                capture_output=True, text=True, check=True,
            )
            self.assertEqual(json.loads(process.stdout)["action"], "delete")
            self.assertEqual(knowledge_edit.read_entries(jsonl), [entries[1]])

    def test_delete_rejects_stale_revision_without_writes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            jsonl, _ = self.write_delete_fixture(root)
            original = jsonl.read_bytes()
            with self.assertRaisesRegex(ValueError, "已经更新"):
                knowledge_edit.apply_delete(root, {"info_id": "item-1", "editor": "测试", "expected_revision": 1})
            self.assertEqual(jsonl.read_bytes(), original)
            self.assertFalse((root / "knowledge-base" / "edits").exists())

    def test_delete_rejects_last_missing_and_duplicate_targets_without_writes(self):
        for entries, target, expected_error in [
            ([{"id": "item-1"}], "item-1", "最后一条"),
            ([{"id": "item-1"}, {"id": "item-2"}], "missing", "不存在"),
            ([{"id": "item-1"}, {"id": "item-1"}], "item-1", "不唯一"),
        ]:
            with self.subTest(expected_error=expected_error), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                jsonl, _ = self.write_delete_fixture(root, entries)
                original = jsonl.read_bytes()
                with self.assertRaisesRegex(ValueError, expected_error):
                    knowledge_edit.apply_delete(root, {"info_id": target, "editor": "测试", "expected_revision": 1})
                self.assertEqual(jsonl.read_bytes(), original)
                self.assertFalse((root / "knowledge-base" / "edits").exists())

    def test_delete_rejects_invalid_identity_and_revision(self):
        for changes in [
            {"info_id": "../item"}, {"editor": ""}, {"expected_revision": None},
            {"expected_revision": True}, {"expected_revision": 0}, {"expected_revision": "2"},
        ]:
            with self.subTest(changes=changes):
                with self.assertRaises(ValueError):
                    knowledge_edit.validate_delete_payload({
                        "info_id": "item-1", "editor": "测试", "expected_revision": 2, **changes,
                    })

    def test_edit_preserves_identity_and_records_audit_history(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            jsonl = root / "knowledge-base" / "import" / "knowledge.jsonl"
            jsonl.parent.mkdir(parents=True)
            jsonl.write_text(json.dumps({
                "id": "upload-20260803-example-01",
                "title": "旧标题",
                "text": "这是一段长度足够的旧知识正文，用于验证编辑前后的字段保存。",
                "source_url": "https://example.com/old",
                "source_type": "user_upload",
                "uploaded_by": "FallaxAura",
                "verified_at": "2026-08-03",
                "confidence": "medium",
                "tags": ["旧标签"],
            }, ensure_ascii=False) + "\n", encoding="utf-8")

            result = knowledge_edit.apply_edit(root, {
                "info_id": "upload-20260803-example-01",
                "editor": "猫猫",
                "title": "新标题",
                "text": "这是一段长度足够的新知识正文，已经完成修订并且应当写入正式知识库。",
                "source_url": "https://example.com/new",
                "source_type": "official_web",
                "confidence": "high",
                "tags": ["产品", "参数", "产品"],
            }, now="2026-08-03T08:00:00+00:00")

            entry = json.loads(jsonl.read_text(encoding="utf-8"))
            self.assertEqual(entry["id"], "upload-20260803-example-01")
            self.assertEqual(entry["uploaded_by"], "FallaxAura")
            self.assertEqual(entry["title"], "新标题")
            self.assertEqual(entry["tags"], ["产品", "参数"])
            self.assertEqual(entry["last_edited_by"], "猫猫")
            self.assertEqual(entry["revision"], 2)
            self.assertEqual(result["changed_fields"], ["title", "text", "source_url", "source_type", "confidence", "tags"])

            audit = json.loads((root / result["audit_path"]).read_text(encoding="utf-8"))
            self.assertEqual(audit["edited_by"], "猫猫")
            self.assertEqual(audit["before"]["title"], "旧标题")
            self.assertEqual(audit["after"]["title"], "新标题")

    def test_decode_payload_accepts_base64url_without_padding(self):
        raw = json.dumps({"info_id": "item-1"}, ensure_ascii=False).encode()
        encoded = base64.urlsafe_b64encode(raw).decode().rstrip("=")
        self.assertEqual(knowledge_edit.decode_payload(encoded)["info_id"], "item-1")

    def test_rejects_immutable_or_invalid_target(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            jsonl = root / "knowledge-base" / "import" / "knowledge.jsonl"
            jsonl.parent.mkdir(parents=True)
            jsonl.write_text("{}\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "不存在"):
                knowledge_edit.apply_edit(root, {
                    "info_id": "missing",
                    "editor": "FallaxAura",
                    "title": "标题",
                    "text": "这是一段长度足够、但目标不存在的知识正文内容。",
                    "source_url": "来源说明",
                    "source_type": "user_upload",
                    "confidence": "high",
                    "tags": ["测试"],
                })


if __name__ == "__main__":
    unittest.main()
