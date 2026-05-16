def calculate_confusion_score(simulation_result: dict) -> int:
    events = simulation_result.get("confusion_events", [])
    abandoned = simulation_result.get("abandoned", False)

    base = 40 if abandoned else 0
    event_score = sum(e.get("severity", 0) * 30 for e in events)

    return min(100, int(base + event_score))

def get_top3_issues(simulation_result: dict) -> list:
    events = simulation_result.get("confusion_events", [])
    sorted_events = sorted(events, key=lambda e: e.get("severity", 0), reverse=True)
    return sorted_events[:3]

def generate_fix_prompts(simulation_result: dict, source_code: str, cohort: str) -> list:
    top3 = get_top3_issues(simulation_result)
    prompts = []
    for issue in top3:
        line = issue.get("line_number", "?")
        reason = issue.get("reason", "")
        evidence = issue.get("evidence", "")
        element = issue.get("element", "")

        prompt = (
            f"[{cohort} UX 이슈 — line {line}]\n"
            f"문제: {reason}\n"
            f"근거: {evidence}\n\n"
            f"Fix: {line}번 라인의 {element} 요소를 수정해줘. "
            f"버튼이면 'p-4 text-base font-semibold bg-blue-600 text-white rounded-lg'로 변경하고, "
            f"입력창이면 라벨과 helper text를 명시적으로 추가해줘."
        )
        prompts.append(prompt)
    return prompts

def build_scorer_output(simulation_result: dict, source_code: str, cohort: str = "20대_대학생") -> dict:
    return {
        "confusion_score": calculate_confusion_score(simulation_result),
        "cohort_framing": f"{cohort} 코호트에서 이 UI의 실패 위험도",
        "top3": get_top3_issues(simulation_result),
        "fix_prompts": generate_fix_prompts(simulation_result, source_code, cohort),
        "think_aloud": simulation_result.get("think_aloud", ""),
        "abandoned": simulation_result.get("abandoned", False),
        "source_code": source_code,
    }
