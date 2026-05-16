import json
import pytest
from unittest.mock import patch, MagicMock
from src.core.m1_analyzer import analyze_code, detect_ui_patterns

SAMPLE_CODE = """
export default function LoginForm() {
  return (
    <div>
      <input type="email" placeholder="이메일" className="text-gray-300" />
      <button className="text-xs p-1">로그인</button>
    </div>
  );
}
"""

MOCK_LLM_RESPONSE = {
    "components": [
        {"type": "input", "label": "이메일 입력", "line_number": 4,
         "styling": {"color": "text-gray-300"}, "context": "이메일 입력 필드"},
        {"type": "button", "label": "로그인", "line_number": 5,
         "styling": {"size": "text-xs p-1"}, "context": "로그인 제출 버튼"}
    ],
    "visual_hierarchy": "버튼이 작고 대비가 낮아 눈에 잘 띄지 않음",
    "potential_issues": ["text-gray-300 대비 낮음", "버튼 크기 너무 작음"]
}

def test_analyze_code_returns_required_keys():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value.choices[0].message.content = json.dumps(MOCK_LLM_RESPONSE)

    with patch("src.core.m1_analyzer.client", mock_client):
        result = analyze_code(SAMPLE_CODE, "로그인하기")

    assert "components" in result
    assert "visual_hierarchy" in result
    assert "detected_patterns" in result
    assert isinstance(result["components"], list)

def test_analyze_code_detects_patterns():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value.choices[0].message.content = json.dumps(MOCK_LLM_RESPONSE)

    with patch("src.core.m1_analyzer.client", mock_client):
        result = analyze_code(SAMPLE_CODE, "로그인하기")

    assert "small_button" in result["detected_patterns"]
    assert "low_contrast" in result["detected_patterns"]

def test_detect_ui_patterns_small_button():
    components = [{"type": "button", "styling": {"size": "text-xs p-1"}, "label": "로그인", "line_number": 5, "context": ""}]
    patterns = detect_ui_patterns(components, [])
    assert "small_button" in patterns

def test_detect_ui_patterns_low_contrast():
    components = [{"type": "input", "styling": {"color": "text-gray-300"}, "label": "이메일", "line_number": 4, "context": ""}]
    patterns = detect_ui_patterns(components, ["text-gray-300 대비 낮음"])
    assert "low_contrast" in patterns
