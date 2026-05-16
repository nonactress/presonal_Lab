from data.chunk_registry import load_persona_params, get_relevant_chunks, CHUNK_REGISTRY, PATTERN_TO_CHUNKS

def build_behavioral_constraints(cohort: str) -> str:
    params = load_persona_params(cohort)
    f = params["features"]

    anchors = ", ".join(f["mental_model_anchors"]["value"])
    patience = f["patience_threshold_sec"]["value"]
    bballi = f["bballi_bballi"]["value"]
    trust = f["trust_disposition"]["value"]
    error_rec = f["error_recovery_capacity"]["value"]

    bballi_desc = "빨리빨리 성향 — 온보딩 텍스트를 거의 읽지 않고 버튼부터 누른다" if bballi > 0.7 else "안내 텍스트를 읽는 편이다"
    trust_desc = "생소한 스타트업 서비스의 개인정보 요청에 거부감을 느낀다" if trust < 0.65 else "서비스를 비교적 신뢰한다"
    error_desc = "오류 메시지가 나오면 의미를 해석하지 않고 뒤로 간다" if error_rec < 0.7 else "오류를 보고 스스로 해결을 시도한다"

    return f"""당신은 20대 대학생 코호트를 대표하는 사용자입니다.

행동 제약 (연구 기반):
- {anchors} 패턴에 익숙하며, 이와 다른 UI 패턴에서 즉시 혼란을 느낀다
- 화면에 아무 반응이 없으면 {patience}초 후 오류로 인식하고 뒤로 간다
- {bballi_desc}
- {trust_desc}
- {error_desc}
- 처음 보는 도메인의 UI에서는 디지털 숙련자여도 초보처럼 행동한다

반드시 위 제약 안에서 think-aloud를 생성하라."""

_CHUNK_SOURCE_LABELS = {
    "nah":         "Nah (2004): 웹 응답 대기 시간 — TWT 연구",
    "sweller":     "Sweller (1988): 인지 부하 이론",
    "miller":      "Miller (1956): 단기 기억 한계",
    "hargittai":   "Hargittai (2010): 디지털 리터러시 격차",
    "norman":      "Norman (1983): 멘탈 모델 이론",
    "mcknight":    "McKnight (2002): 온라인 신뢰 이론",
    "marchionini": "Marchionini (1997): 정보 탐색 행동",
    "korean":      "NIA 한국지능정보사회진흥원 (2025): 인터넷 이용 통계",
}

def _get_research_context_with_labels(ui_patterns: list) -> str:
    """청크를 가져오되, 출처 레이블(저자/연도)을 각 청크 앞에 붙인다."""
    chunk_ids: set = set()
    for pattern in ui_patterns:
        chunk_ids.update(PATTERN_TO_CHUNKS.get(pattern, []))

    sections = []
    for cid in chunk_ids:
        if cid not in CHUNK_REGISTRY:
            continue
        prefix = cid.split("_ch")[0]
        label = _CHUNK_SOURCE_LABELS.get(prefix, prefix)
        sections.append(f"[출처: {label}]\n{CHUNK_REGISTRY[cid]}")

    return "\n\n---\n\n".join(sections)

def build_m2_output(ui_patterns: list, cohort: str = "20대_대학생") -> tuple:
    """(behavioral_constraints, research_context) 반환"""
    constraints = build_behavioral_constraints(cohort)
    research_context = _get_research_context_with_labels(ui_patterns)
    return constraints, research_context
