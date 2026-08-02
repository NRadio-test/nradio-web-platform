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
    def test_workflow_configures_git_identity_before_merging_review_branch(self):
        workflow_path = MODULE_PATH.parents[1] / ".github" / "workflows" / "knowledge-import.yml"
        workflow = workflow_path.read_text(encoding="utf-8")
        identity_position = workflow.index('git config user.name "NRadio Knowledge Bot"')
        merge_position = workflow.index("git merge --no-edit origin/main")
        self.assertLess(identity_position, merge_position)

    def test_structure_prompt_treats_member_uploads_as_collectable(self):
        self.assertIn("确认可以写入知识库", knowledge_import.STRUCTURE_PROMPT)
        self.assertIn("不得进行隐私", knowledge_import.STRUCTURE_PROMPT)
        self.assertIn("QQ", knowledge_import.STRUCTURE_PROMPT)
        self.assertIn("仅当文本为空", knowledge_import.STRUCTURE_PROMPT)

    def test_safe_name_removes_path_and_unsafe_characters(self):
        self.assertEqual(knowledge_import.safe_name("../产品?说明.txt"), "产品_说明.txt")

    def test_source_reference_accepts_url_or_description(self):
        source_path = Path("knowledge-base/sources/uploads/资料.txt")
        self.assertEqual(
            knowledge_import.resolve_source_url(
                "https://v.douyin.com/example/", "NRadio-test/nradio-web-platform", source_path
            ),
            "https://v.douyin.com/example/",
        )
        self.assertEqual(
            knowledge_import.resolve_source_url(
                "张导直播间", "NRadio-test/nradio-web-platform", source_path
            ),
            "https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/资料.txt",
        )

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

    def test_rejected_review_keeps_usable_entries_for_human_review(self):
        result = knowledge_import.validate_review({
            "decision": "reject",
            "review_notes": ["模型认为这是联系方式"],
            "entries": [{
                "title": "小助理临时联系方式",
                "text": "企业微信暂时不可用时，可以通过资料中提供的 QQ 号联系小助理。",
                "tags": ["联系方式", "小助理"],
                "confidence": "high",
            }],
        })
        self.assertEqual(result["decision"], "needs_review")
        self.assertEqual(len(result["entries"]), 1)

    def test_one_rejected_chunk_does_not_discard_other_chunks(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.txt"
            source.write_text("NRadio 知识资料" * 10, encoding="utf-8")
            args = type("Args", (), {
                "input": str(source),
                "output_root": str(root),
                "file_name": "联系方式.txt",
                "job_id": "test-job",
                "title": "联系方式",
                "source_url": "内部通知",
                "github_repository": "NRadio-test/nradio-web-platform",
                "uploaded_by": "FallaxAura",
            })()
            result = knowledge_import.write_outputs(args, "已提取文本", [
                {"decision": "reject", "review_notes": ["第一段无可用信息"], "entries": []},
                {"decision": "accept", "review_notes": [], "entries": [{
                    "title": "小助理联系方式",
                    "text": "企业微信暂时不可用时，可以使用资料提供的 QQ 号联系小助理。",
                    "tags": ["联系方式"],
                    "confidence": "high",
                }]},
            ])
        self.assertEqual(result["decision"], "accept")
        self.assertEqual(result["entry_count"], 1)


if __name__ == "__main__":
    unittest.main()
