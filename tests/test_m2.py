from src.core.m2_persona import build_behavioral_constraints, build_m2_output

def test_constraints_contains_mental_model_anchors():
    constraints = build_behavioral_constraints("20대_대학생")
    for anchor in ["instagram", "kakaotalk", "coupang"]:
        assert anchor in constraints.lower()

def test_constraints_contains_patience():
    constraints = build_behavioral_constraints("20대_대학생")
    assert "3.5" in constraints or "초" in constraints

def test_constraints_contains_bballi():
    constraints = build_behavioral_constraints("20대_대학생")
    assert "빨리" in constraints or "스킵" in constraints

def test_m2_output_returns_tuple():
    result = build_m2_output(["small_button", "multi_step_form"], "20대_대학생")
    constraints, research_context = result
    assert isinstance(constraints, str) and len(constraints) > 50
    assert isinstance(research_context, str) and len(research_context) > 50

def test_m2_output_research_contains_nah():
    _, research_context = build_m2_output(["small_button"], "20대_대학생")
    assert "Nah" in research_context or "nah" in research_context.lower() or "2004" in research_context
