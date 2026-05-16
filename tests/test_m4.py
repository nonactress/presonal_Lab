from src.core.m4_scorer import calculate_confusion_score, generate_fix_prompts

SAMPLE_SIMULATION = {
    "think_aloud": "버튼을 못 찾겠어. 그냥 닫아야겠다.",
    "confusion_events": [
        {"element": "button#가입", "line_number": 45, "reason": "버튼 너무 작음",
         "severity": 0.82, "evidence": "Nah(2004): small elements cause hesitation"},
        {"element": "input#email", "line_number": 32, "reason": "placeholder만 있어서 무슨 형식인지 모름",
         "severity": 0.55, "evidence": "Sweller(1988): missing context increases cognitive load"}
    ],
    "abandoned": True,
    "abandonment_reason": "버튼 미발견"
}
SAMPLE_SOURCE = "// App.tsx\nline1\nline2\n..."

def test_confusion_score_range():
    score = calculate_confusion_score(SAMPLE_SIMULATION)
    assert 0 <= score <= 100

def test_confusion_score_high_for_abandoned():
    score = calculate_confusion_score(SAMPLE_SIMULATION)
    assert score >= 60, "abandoned=True면 높은 점수여야 함"

def test_confusion_score_zero_events():
    result = {"think_aloud": "쉽게 완료했어요", "confusion_events": [], "abandoned": False}
    score = calculate_confusion_score(result)
    assert score <= 20

def test_fix_prompts_have_line_numbers():
    prompts = generate_fix_prompts(SAMPLE_SIMULATION, SAMPLE_SOURCE, "20대_대학생")
    assert len(prompts) > 0
    for p in prompts:
        assert "line" in p.lower() or "라인" in p or "45" in p or "32" in p

def test_fix_prompts_have_evidence():
    prompts = generate_fix_prompts(SAMPLE_SIMULATION, SAMPLE_SOURCE, "20대_대학생")
    combined = " ".join(prompts)
    assert "Nah" in combined or "Sweller" in combined or "근거" in combined

def test_top3_issues():
    from src.core.m4_scorer import get_top3_issues
    top3 = get_top3_issues(SAMPLE_SIMULATION)
    assert len(top3) <= 3
    assert top3[0]["severity"] >= top3[-1]["severity"]
