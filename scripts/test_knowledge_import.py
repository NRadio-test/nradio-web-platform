import importlib.util
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("knowledge_import.py")
SPEC = importlib.util.spec_from_file_location("knowledge_import", MODULE_PATH)
knowledge_import = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(knowledge_import)


class KnowledgeImportTests(unittest.TestCase):
    def test_safe_name_removes_path_and_unsafe_characters(self):
        self.assertEqual(knowledge_import.safe_name("../产品?说明.txt"), "产品_说明.txt")

    def test_text_extraction_accepts_chinese_source(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "source"
            path.write_text("鲲鹏无限知识库导入测试。" * 8, encoding="utf-8")
            text = knowledge_import.extract_text(path, "资料.txt")
        self.assertIn("知识库导入测试", text)

    def test_review_validation_normalizes_entries(self):
        result = knowledge_import.validate_review({
            "decision": "needs_review",
            "review_notes": ["需要核对动态信息"],
            "entries": [{
                "title": "测试条目",
                "text": "这是一条长度足够、仅用于验证结构化审核结果的测试知识内容。",
                "tags": ["测试", "测试"],
                "confidence": "unknown",
            }],
        })
        self.assertEqual(result["entries"][0]["tags"], ["测试"])
        self.assertEqual(result["entries"][0]["confidence"], "medium")


if __name__ == "__main__":
    unittest.main()
