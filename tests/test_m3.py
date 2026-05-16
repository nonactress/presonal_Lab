import json
import pytest
from unittest.mock import patch, MagicMock
from src.core.m3_simulation import run_simulation, build_simulation_prompt

SAMPLE_UI_MAP = {
    "components": [
        {"type": "button", "label": "회원가입", "line_number": 45,
         "styling": {"size": "text-xs"}, "context": "최종 가입 버튼"}
    ],
    "visual_hierarchy": "CTA 버튼이 눈에 잘 안 띔",
    "detected_patterns": ["small_button"]
}
SAMPLE_CONSTRAINTS = "instagram, kakaotalk 패턴에 익숙하며 3.5초 후 이탈한다"
SAMPLE_RESEARCH = "Nah(2004): 피드백 없으면 2초 내 이탈"

MOCK_SIMULATION = {
    "think_aloud": "회원가입 버튼이 어디 있지... 너무 작아서 못 찾겠어. 그냥 닫아야겠다.",
    "confusion_events": [
        {
            "element": "button#회원가입",
            "line_number": 45,
            "reason": "버튼 크기 작음, 대비 낮음",
            "severity": 0.82,
            "evidence": "Nah(2004): small interactive elements cause hesitation"
        }
    ],
    "abandoned": True,
    "abandonment_reason": "버튼을 찾지 못해 이탈"
}

def test_run_simulation_returns_required_keys():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value.choices[0].message.content = json.dumps(MOCK_SIMULATION)

    with patch("src.core.m3_simulation.client", mock_client):
        result = run_simulation(SAMPLE_UI_MAP, SAMPLE_CONSTRAINTS, SAMPLE_RESEARCH, "회원가입하기")

    assert "think_aloud" in result
    assert "confusion_events" in result
    assert "abandoned" in result

def test_run_simulation_confusion_events_have_line_numbers():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value.choices[0].message.content = json.dumps(MOCK_SIMULATION)

    with patch("src.core.m3_simulation.client", mock_client):
        result = run_simulation(SAMPLE_UI_MAP, SAMPLE_CONSTRAINTS, SAMPLE_RESEARCH, "회원가입하기")

    for event in result["confusion_events"]:
        assert "line_number" in event
        assert "evidence" in event

def test_build_simulation_prompt_includes_constraints():
    messages = build_simulation_prompt(SAMPLE_CONSTRAINTS, SAMPLE_RESEARCH, SAMPLE_UI_MAP, "회원가입하기")
    system_content = messages[0]["content"]
    assert "instagram" in system_content or "3.5초" in system_content or "제약" in system_content

def test_build_simulation_prompt_includes_research():
    messages = build_simulation_prompt(SAMPLE_CONSTRAINTS, SAMPLE_RESEARCH, SAMPLE_UI_MAP, "회원가입하기")
    system_content = messages[0]["content"]
    assert "Nah" in system_content or "연구" in system_content
