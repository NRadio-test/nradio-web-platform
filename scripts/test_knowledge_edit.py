import base64
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("knowledge_edit.py")
SPEC = importlib.util.spec_from_file_location("knowledge_edit", MODULE_PATH)
knowledge_edit = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(knowledge_edit)


class KnowledgeEditTests(unittest.TestCase):
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

    def test_delete_removes_only_target_and_records_full_audit(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            jsonl = root / "knowledge-base" / "import" / "knowledge.jsonl"
            jsonl.parent.mkdir(parents=True)
            first = {"id": "item-1", "title": "要删除的条目", "revision": 2, "uploaded_by": "原上传者"}
            second = {"id": "item-2", "title": "保留的条目"}
            jsonl.write_text(
                "".join(json.dumps(entry, ensure_ascii=False) + "\n" for entry in (first, second)),
                encoding="utf-8",
            )

            result = knowledge_edit.apply_change(root, {
                "action": "delete", "info_id": "item-1", "editor": "编辑者", "expected_revision": 2,
            }, now="2026-09-16T08:00:00+00:00")

            self.assertEqual(result["action"], "delete")
            self.assertEqual([json.loads(line) for line in jsonl.read_text(encoding="utf-8").splitlines()], [second])
            audit = json.loads((root / result["audit_path"]).read_text(encoding="utf-8"))
            self.assertEqual(audit["before"], first)
            self.assertIsNone(audit["after"])
            self.assertEqual(audit["deleted_by"], "编辑者")

    def test_delete_rejects_stale_revision_and_last_entry(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            jsonl = root / "knowledge-base" / "import" / "knowledge.jsonl"
            jsonl.parent.mkdir(parents=True)
            first = {"id": "item-1", "revision": 3}
            second = {"id": "item-2"}
            original = "".join(json.dumps(entry) + "\n" for entry in (first, second))
            jsonl.write_text(original, encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "版本已经变化"):
                knowledge_edit.apply_delete(root, {
                    "info_id": "item-1", "editor": "编辑者", "expected_revision": 2,
                })
            self.assertEqual(jsonl.read_text(encoding="utf-8"), original)

            jsonl.write_text(json.dumps(first) + "\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "最后一条"):
                knowledge_edit.apply_delete(root, {
                    "info_id": "item-1", "editor": "编辑者", "expected_revision": 3,
                })

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
