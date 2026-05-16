# PersonaLab MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** mock pipeline을 실제 GPT-4o 기반 M1→M2→M3→M4 파이프라인으로 교체하고, Pattern-Mapped CAG로 한국 UX 연구 데이터를 M3 시뮬레이션에 주입한다.

**Architecture:** M1이 코드를 UI맵 JSON으로 변환 → M2가 20대 대학생 pre-baked PersonaParams + 관련 연구 청크 선택 → M3가 GPT-4o로 코호트 대표 Think-Aloud 생성 → M4가 혼란 지수 + 라인 번호 기반 Fix Prompt 출력.

**Tech Stack:** Python 3.11+, FastAPI, Gradio, OpenAI Python SDK (`openai>=1.0`), pytest, python-dotenv

---

## 전체 파이프라인 시각화

```
개발자 입력
┌─────────────────────────────────┐
│  코드 (App.tsx)  +  "회원가입하기"  │
└──────────────┬──────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  M1 — Code Analyzer                              │
│                                                  │
│  App.tsx ──→ GPT-4o ──→ UI맵 JSON               │
│                          {                       │
│                            components: [         │
│                              {type: "button",    │
│                               label: "가입",     │
│                               line: 45,          │
│                               size: "text-xs"}   │
│                            ],                    │
│                            detected_patterns:    │
│                              ["small_button"]  ← 핵심
│                          }                       │
└──────────────────────────┬───────────────────────┘
                           │  detected_patterns
          ┌────────────────┴──────────────────┐
          │                                   │
          ▼                                   ▼
┌─────────────────────┐           ┌───────────────────────┐
│  M2 — Feature Space │           │  M2 — CAG Chunks      │
│  (오프라인 사전계산)  │           │  (런타임 선택)         │
│                     │           │                       │
│  20대_대학생.json    │           │  "small_button" 감지  │
│  ├ digital: 0.78    │           │        ↓              │
│  ├ patience: 3.5초  │           │  PATTERN_TO_CHUNKS    │
│  ├ bballi: 0.75     │           │  ["nah_ch1",          │
│  └ anchors:         │           │   "korean_ch1"]       │
│    [instagram,      │           │        ↓              │
│     kakaotalk...]   │           │  CHUNK_REGISTRY에서   │
│         ↓           │           │  해당 텍스트 추출      │
│  behavioral_        │           │                       │
│  constraints 변환   │           │  "Nah(2004):          │
│                     │           │   2초 후 이탈..."      │
│  "3.5초 후 뒤로 간다 │           │  "한국 공공데이터:     │
│   온보딩 스킵..."    │           │   20대 빨리빨리..."    │
└─────────┬───────────┘           └──────────┬────────────┘
          │ HOW (행동 방식)                   │ WHY (실패 근거)
          └──────────────┬────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│  M3 — Simulation Engine                                │
│                                                        │
│  GPT-4o system prompt:                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [연구 근거 — WHY]                                 │  │
│  │ Nah(2004): 2초 후 이탈...                         │  │
│  │ 한국 공공데이터: 20대 빨리빨리...                  │  │
│  │                                                   │  │
│  │ [행동 제약 — HOW]                                 │  │
│  │ 3.5초 후 뒤로 간다                                │  │
│  │ 온보딩 텍스트 스킵                                │  │
│  │ instagram 패턴 기준으로 판단                       │  │
│  └──────────────────────────────────────────────────┘  │
│                     ↓                                  │
│             Think-Aloud 생성                           │
│                     ↓                                  │
│  {                                                     │
│    think_aloud: "버튼을 찾지 못겠어...",                │
│    confusion_events: [                                 │
│      {line: 45, severity: 0.82,                       │
│       evidence: "Nah(2004): small elements..."}       │
│    ],                                                  │
│    abandoned: true                                     │
│  }                                                     │
└────────────────────────────┬───────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────┐
│  M4 — Scorer & Fixer                                   │
│                                                        │
│  confusion_score = 82 / 100                            │
│                                                        │
│  Top 3 이슈:                                           │
│  🔴 line 45 — 버튼 너무 작음 (82%)                    │
│  🟡 line 32 — 입력 placeholder만 있음 (55%)            │
│                                                        │
│  Fix Prompts:                                          │
│  "[App.tsx:45] 버튼에 p-4 bg-blue-600 추가해줘"        │
│  근거: Nah(2004) — small elements cause hesitation     │
└────────────────────────────┬───────────────────────────┘
                             │
                             ▼
                    M5 Gradio Dashboard
                    개발자가 결과 확인 + 복사
```

---

## Feature Space vs CAG Chunks — 같은 논문, 다른 용도

```
논문 원문 (예: Nah 2004)
"피드백 없을 때 허용 대기 시간은 약 2초"
        │
        ├──────────────────────────────────────────┐
        │                                          │
        ▼                                          ▼
[오프라인 계산 — 한 번만]               [런타임 텍스트 — 그대로]
        │                                          │
  수치로 압축                             원문 보존
patience_threshold: 3.5초             "Nah(2004): 피드백 없으면
(한국 20대 보정 포함)                   2초 후 이탈. 실패 반복 시
        │                              허용 시간 급감..."
        │                                          │
        ▼                                          ▼
  M2가 자연어로 변환                  M3 프롬프트에 직접 주입
"응답 없으면 3.5초 후                "이 근거로 think-aloud 생성"
 뒤로 간다"
        │                                          │
        └──────────────┬───────────────────────────┘
                       ▼
               M3 GPT-4o 호출
               HOW(행동 방식) + WHY(실패 근거) 둘 다 받아서 생성
```

---

## 데이터 소스별 역할

```
dong_paper/전처리 논문/
│
├── patience/nah_rag_processed.md
│   ├── [오프라인] → patience_threshold: 3.5초  (Feature Space)
│   └── [런타임]  → "nah_ch1", "nah_ch2" 청크  (CAG)
│
├── cognitive_load/sweller_rag_processed.md
│   ├── [오프라인] → cognitive_load_headroom: 0.72 / 0.35
│   └── [런타임]  → "sweller_ch3" 청크
│
├── 대한민국 공공데이터/internet_usage_stats_processed.md
│   ├── [오프라인] → bballi_bballi: 0.75  ← 서양 논문 수치 한국화
│   └── [런타임]  → "korean_ch1", "korean_ch2" 청크
│        ↑
│        핵심 — 서양 논문 수치를 한국 맥락으로 보정하는 유일한 데이터
│
└── mental model/norman_rag_processed.md
    ├── [오프라인] → mental_model_anchors: [instagram, kakaotalk...]
    └── [런타임]  → "norman_ch2", "norman_ch3" 청크
```

---

## 파일 구조

```
personalab/
├── src/
│   ├── core/
│   │   ├── __init__.py           (기존)
│   │   ├── logic.py              MODIFY — mock → 실제 파이프라인 오케스트레이터
│   │   ├── m1_analyzer.py        CREATE — M1 코드 분석
│   │   ├── m2_persona.py         CREATE — M2 페르소나 엔진 + CHUNK 선택
│   │   ├── m3_simulation.py      CREATE — M3 시뮬레이션
│   │   └── m4_scorer.py          CREATE — M4 혼란 지수 + Fix Prompt
│   ├── backend/api.py            (기존, 수정 불필요)
│   └── frontend/ui.py            MODIFY — 출력 포맷 업데이트
├── data/
│   ├── chunk_registry.py         CREATE — 연구 청크 로더 + PATTERN_TO_CHUNKS 매핑
│   └── persona_params/
│       └── 20대_대학생.json      CREATE — pre-baked PersonaParams
├── tests/
│   ├── __init__.py               CREATE
│   ├── test_m2.py                CREATE
│   ├── test_m1.py                CREATE
│   ├── test_m3.py                CREATE
│   ├── test_m4.py                CREATE
│   └── test_pipeline.py         CREATE
├── .env.example                  CREATE
└── requirements.txt              MODIFY — openai 추가
```

**인터페이스 계약 (타입 기준):**
- M1 output = `UIMap`: `{"components": [...], "detected_patterns": [...], "visual_hierarchy": str}`
- M2 output = `(constraints: str, research_context: str)`
- M3 output = `SimulationResult`: `{"think_aloud": str, "confusion_events": [...], "abandoned": bool}`
- M4 output = `ScorerOutput`: `{"confusion_score": int, "top3": [...], "fix_prompts": [...]}`

---

## Task 1: 프로젝트 셋업

**Files:**
- Modify: `requirements.txt`
- Create: `.env.example`
- Create: `tests/__init__.py`

- [ ] **Step 1: requirements.txt에 openai 추가**

```
fastapi
uvicorn
gradio
pydantic
httpx
python-dotenv
openai>=1.0.0
pytest
pytest-asyncio
```

- [ ] **Step 2: .env.example 생성**

```bash
# .env.example
OPENAI_API_KEY=sk-...
```

실제 `.env` 파일도 같은 형식으로 생성하고 실제 API 키 입력.

- [ ] **Step 3: tests/__init__.py 생성 (빈 파일)**

```python
```

- [ ] **Step 4: 의존성 설치 및 확인**

```bash
pip install -r requirements.txt
python -c "import openai; print(openai.__version__)"
```

Expected: `1.x.x` 출력

- [ ] **Step 5: Commit**

```bash
git add requirements.txt .env.example tests/__init__.py
git commit -m "chore: add openai dependency and test infrastructure"
```

---

## Task 2: PersonaParams JSON + CHUNK_REGISTRY

**Files:**
- Create: `data/persona_params/20대_대학생.json`
- Create: `data/__init__.py`
- Create: `data/chunk_registry.py`
- Create: `tests/test_chunk_registry.py`

- [ ] **Step 1: 테스트 먼저 작성**

`tests/test_chunk_registry.py`:
```python
import pytest
from data.chunk_registry import load_persona_params, get_relevant_chunks, CHUNK_REGISTRY, PATTERN_TO_CHUNKS

def test_persona_params_loads_all_features():
    params = load_persona_params("20대_대학생")
    features = params["features"]
    required = [
        "digital_literacy", "patience_threshold_sec",
        "cognitive_load_headroom", "mental_model_anchors",
        "self_efficacy", "trust_disposition",
        "bballi_bballi", "error_recovery_capacity"
    ]
    for key in required:
        assert key in features, f"Missing feature: {key}"

def test_persona_params_has_evidence():
    params = load_persona_params("20대_대학생")
    for key, feat in params["features"].items():
        if isinstance(feat, dict):
            assert "evidence" in feat, f"{key} missing evidence citation"

def test_chunk_registry_not_empty():
    assert len(CHUNK_REGISTRY) >= 10, "CHUNK_REGISTRY too sparse"

def test_pattern_mapping_returns_chunks():
    chunks = get_relevant_chunks(["small_button", "multi_step_form"])
    assert len(chunks) > 100, "Expected substantial chunk content"

def test_unknown_pattern_returns_empty():
    chunks = get_relevant_chunks(["nonexistent_pattern_xyz"])
    assert chunks == ""

def test_chunk_deduplication():
    # 두 패턴이 같은 청크 참조해도 중복 없어야 함
    chunks1 = get_relevant_chunks(["small_button"])
    chunks2 = get_relevant_chunks(["small_button", "small_button"])
    assert chunks1 == chunks2
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pytest tests/test_chunk_registry.py -v
```

Expected: `ModuleNotFoundError: No module named 'data'`

- [ ] **Step 3: data/__init__.py 생성 (빈 파일)**

```python
```

- [ ] **Step 4: 20대_대학생.json 생성**

`data/persona_params/20대_대학생.json`:
```json
{
  "cohort": "20대_대학생",
  "features": {
    "digital_literacy": {
      "value": 0.78,
      "sigma": 0.15,
      "failure_mode": "스키마 불일치 발생 위치",
      "evidence": "Hargittai (2010): high autonomy + long usage history"
    },
    "patience_threshold_sec": {
      "value": 3.5,
      "decay_per_failure": 0.5,
      "failure_mode": "이탈 시점",
      "evidence": "Nah (2004): 2초 TWT baseline; 한국 20대 빨리빨리 보정"
    },
    "cognitive_load_headroom": {
      "value_familiar": 0.72,
      "value_novel": 0.35,
      "failure_mode": "감당 가능한 선택지/단계 수",
      "evidence": "Sweller (1988): SNS/쇼핑 스키마 강함; 새 도메인 초보 수준"
    },
    "mental_model_anchors": {
      "value": ["instagram", "kakaotalk", "coupang", "youtube", "toss"],
      "failure_mode": "UI 패턴 불일치 혼란",
      "evidence": "Norman (1983): 기존 서비스 패턴 전이; 불일치 = 막힘"
    },
    "self_efficacy": {
      "value": 0.71,
      "gender_delta": -0.12,
      "failure_mode": "새 기능 시도 여부",
      "evidence": "Hargittai (2010): 여성 자기효능감 과소평가 → 시도 포기"
    },
    "trust_disposition": {
      "value": 0.58,
      "failure_mode": "회원가입/결제 완료 여부",
      "evidence": "McKnight (2002): 앱스토어 신뢰 O; 생소한 스타트업 UI → 이탈"
    },
    "bballi_bballi": {
      "value": 0.75,
      "failure_mode": "온보딩 스킵 여부",
      "evidence": "한국지능정보사회진흥원 (2025): 20대 즉각 결과 기대 전 연령 최고"
    },
    "error_recovery_capacity": {
      "value": 0.65,
      "failure_mode": "오류 후 이탈 vs 해결 시도",
      "evidence": "Norman/Staggers (1993): 인증/결제 오류에서 미성숙 멘탈모델 → 급감"
    }
  }
}
```

- [ ] **Step 5: chunk_registry.py 생성**

`data/chunk_registry.py`:
```python
import json
import re
from pathlib import Path

BASE = Path(__file__).parent.parent / "dong_paper" / "전처리 논문"

def _load_chunks_from_file(path: Path, prefix: str) -> dict:
    """_rag_processed.md 파일에서 # CHUNK N 섹션을 추출한다."""
    text = path.read_text(encoding="utf-8")
    chunks = {}
    # "# CHUNK N" 패턴으로 분할
    parts = re.split(r"(?=# CHUNK \d+)", text)
    for part in parts:
        match = re.match(r"# CHUNK (\d+)", part)
        if match:
            chunk_num = match.group(1)
            key = f"{prefix}_ch{chunk_num}"
            chunks[key] = part.strip()
    return chunks

def _build_registry() -> dict:
    registry = {}
    sources = [
        (BASE / "patience" / "nah_rag_processed.md",           "nah"),
        (BASE / "cognitive_load" / "sweller_rag_processed.md",  "sweller"),
        (BASE / "cognitive_load" / "miller_rag_processed.md",   "miller"),
        (BASE / "tech_literacy" / "hargittai_rag_processed.md", "hargittai"),
        (BASE / "mental model" / "norman_rag_processed.md",     "norman"),
        (BASE / "불안 신뢰 논문" / "mcknight_trust_processed.md","mcknight"),
        (BASE / "탐색행동논문" / "information_seeking_processed.md", "marchionini"),
        (BASE / "대한민국 공공데이터" / "internet_usage_stats_processed.md", "korean"),
    ]
    for path, prefix in sources:
        if path.exists():
            registry.update(_load_chunks_from_file(path, prefix))
    return registry

CHUNK_REGISTRY: dict = _build_registry()

PATTERN_TO_CHUNKS: dict = {
    "small_button":           ["nah_ch1", "korean_ch1"],
    "low_contrast":           ["nah_ch1", "sweller_ch3"],
    "multi_step_form":        ["sweller_ch3", "nah_ch4", "korean_ch1"],
    "hamburger_menu":         ["norman_ch2", "marchionini_ch5"],
    "email_verification":     ["mcknight_ch4", "korean_ch2"],
    "loading_no_feedback":    ["nah_ch2", "nah_ch5"],
    "no_error_guidance":      ["norman_ch3", "sweller_ch5"],
    "trust_signal_missing":   ["mcknight_ch4", "mcknight_ch2", "korean_ch3"],
    "complex_navigation":     ["marchionini_ch3", "norman_ch3"],
    "payment_flow":           ["mcknight_ch5", "korean_ch4"],
    "onboarding_text_heavy":  ["sweller_ch4", "hargittai_ch3"],
}

def load_persona_params(cohort: str) -> dict:
    path = Path(__file__).parent / "persona_params" / f"{cohort}.json"
    return json.loads(path.read_text(encoding="utf-8"))

def get_relevant_chunks(ui_patterns: list) -> str:
    chunk_ids = set()
    for pattern in ui_patterns:
        chunk_ids.update(PATTERN_TO_CHUNKS.get(pattern, []))
    chunks = [CHUNK_REGISTRY[cid] for cid in chunk_ids if cid in CHUNK_REGISTRY]
    return "\n\n---\n\n".join(chunks)
```

- [ ] **Step 6: 테스트 통과 확인**

```bash
pytest tests/test_chunk_registry.py -v
```

Expected: 6개 PASSED

- [ ] **Step 7: Commit**

```bash
git add data/ tests/test_chunk_registry.py
git commit -m "feat: add PersonaParams JSON and Pattern-Mapped CAG chunk registry"
```

---

## Task 3: M2 Persona Engine

**Files:**
- Create: `src/core/m2_persona.py`
- Create: `tests/test_m2.py`

- [ ] **Step 1: 테스트 먼저 작성**

`tests/test_m2.py`:
```python
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
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pytest tests/test_m2.py -v
```

Expected: `ImportError`

- [ ] **Step 3: m2_persona.py 구현**

`src/core/m2_persona.py`:
```python
from data.chunk_registry import load_persona_params, get_relevant_chunks

def build_behavioral_constraints(cohort: str) -> str:
    params = load_persona_params(cohort)
    f = params["features"]

    anchors = ", ".join(f["mental_model_anchors"]["value"])
    patience = f["patience_threshold_sec"]["value"]
    bballi = f["bballi_bballi"]["value"]
    trust = f["trust_disposition"]["value"]
    error_rec = f["error_recovery_capacity"]["value"]

    bballi_desc = "온보딩 텍스트를 거의 읽지 않고 버튼부터 누른다" if bballi > 0.7 else "안내 텍스트를 읽는 편이다"
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

def build_m2_output(ui_patterns: list, cohort: str = "20대_대학생") -> tuple:
    """(behavioral_constraints, research_context) 반환"""
    constraints = build_behavioral_constraints(cohort)
    research_context = get_relevant_chunks(ui_patterns)
    return constraints, research_context
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pytest tests/test_m2.py -v
```

Expected: 5개 PASSED

- [ ] **Step 5: Commit**

```bash
git add src/core/m2_persona.py tests/test_m2.py
git commit -m "feat: implement M2 persona engine with behavioral constraints"
```

---

## Task 4: M1 Code Analyzer

**Files:**
- Create: `src/core/m1_analyzer.py`
- Create: `tests/test_m1.py`

- [ ] **Step 1: 테스트 먼저 작성**

`tests/test_m1.py`:
```python
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
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pytest tests/test_m1.py -v
```

Expected: `ImportError`

- [ ] **Step 3: m1_analyzer.py 구현**

`src/core/m1_analyzer.py`:
```python
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

M1_SYSTEM_PROMPT = """프론트엔드 코드를 분석하여 사용자가 시각적으로 인지할 UI 구조를 JSON으로 반환하라.

반드시 아래 형식으로 반환하라:
{
  "components": [
    {
      "type": "button|input|form|nav|text|image",
      "label": "사용자가 보는 텍스트",
      "line_number": 숫자,
      "styling": {"color": "클래스명", "size": "클래스명"},
      "context": "이 요소의 역할 한 줄 설명"
    }
  ],
  "visual_hierarchy": "시각적 위계 문제 한 줄 요약",
  "potential_issues": ["문제1", "문제2"]
}"""

def detect_ui_patterns(components: list, potential_issues: list) -> list:
    """컴포넌트 분석 결과에서 PATTERN_TO_CHUNKS 키와 매칭되는 패턴을 감지한다."""
    patterns = []
    for comp in components:
        size = comp.get("styling", {}).get("size", "")
        color = comp.get("styling", {}).get("color", "")
        # 작은 버튼: text-xs, text-sm, p-1, p-2
        if comp["type"] == "button" and any(s in size for s in ["text-xs", "text-sm", "p-1", "p-2"]):
            patterns.append("small_button")
        # 낮은 대비: text-gray-2xx, text-gray-3xx
        if any(c in color for c in ["gray-2", "gray-3", "gray-4"]):
            patterns.append("low_contrast")
        # 폼 여러 단계
        if comp["type"] == "form":
            patterns.append("multi_step_form")

    for issue in potential_issues:
        issue_lower = issue.lower()
        if "대비" in issue_lower or "contrast" in issue_lower:
            if "low_contrast" not in patterns:
                patterns.append("low_contrast")
        if "로딩" in issue_lower or "loading" in issue_lower:
            patterns.append("loading_no_feedback")
        if "오류" in issue_lower or "error" in issue_lower:
            patterns.append("no_error_guidance")
        if "신뢰" in issue_lower or "trust" in issue_lower:
            patterns.append("trust_signal_missing")

    return list(set(patterns))

def analyze_code(source_code: str, task: str) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": M1_SYSTEM_PROMPT},
            {"role": "user", "content": f"태스크: {task}\n\n코드:\n{source_code}"}
        ],
        response_format={"type": "json_object"}
    )
    result = json.loads(response.choices[0].message.content)
    result["detected_patterns"] = detect_ui_patterns(
        result.get("components", []),
        result.get("potential_issues", [])
    )
    return result
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pytest tests/test_m1.py -v
```

Expected: 4개 PASSED

- [ ] **Step 5: Commit**

```bash
git add src/core/m1_analyzer.py tests/test_m1.py
git commit -m "feat: implement M1 code analyzer with UI pattern detection"
```

---

## Task 5: M3 Simulation Engine

**Files:**
- Create: `src/core/m3_simulation.py`
- Create: `tests/test_m3.py`

- [ ] **Step 1: 테스트 먼저 작성**

`tests/test_m3.py`:
```python
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
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pytest tests/test_m3.py -v
```

Expected: `ImportError`

- [ ] **Step 3: m3_simulation.py 구현**

`src/core/m3_simulation.py`:
```python
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

M3_SYSTEM_TEMPLATE = """[관련 연구 근거]
{research_context}

[코호트 행동 제약]
{constraints}

위 연구와 행동 제약을 반드시 반영하여 think-aloud를 생성하라.
한국 사용자 맥락(빨리빨리 문화, 카카오/네이버 멘탈모델)을 반영하라.

아래 JSON 형식으로만 반환하라:
{{
  "think_aloud": "사용자 내부 독백 (2~5문장, 한국어)",
  "confusion_events": [
    {{
      "element": "요소 설명",
      "line_number": 숫자,
      "reason": "혼란 원인",
      "severity": 0.0~1.0,
      "evidence": "관련 논문 인용 (저자 연도: 내용)"
    }}
  ],
  "abandoned": true|false,
  "abandonment_reason": "이탈 이유 (abandoned=true인 경우)"
}}"""

def build_simulation_prompt(constraints: str, research_context: str, ui_map: dict, task: str) -> list:
    system = M3_SYSTEM_TEMPLATE.format(
        research_context=research_context if research_context else "관련 연구 없음",
        constraints=constraints
    )
    components_desc = "\n".join(
        f"- [{c['type']}] '{c['label']}' (line {c['line_number']}): {c['context']}"
        for c in ui_map.get("components", [])
    )
    user_content = f"""태스크: {task}

UI 요소:
{components_desc}

시각적 위계: {ui_map.get('visual_hierarchy', '없음')}
잠재 이슈: {', '.join(ui_map.get('potential_issues', []))}"""

    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user_content}
    ]

def run_simulation(ui_map: dict, constraints: str, research_context: str, task: str) -> dict:
    messages = build_simulation_prompt(constraints, research_context, ui_map, task)
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pytest tests/test_m3.py -v
```

Expected: 4개 PASSED

- [ ] **Step 5: Commit**

```bash
git add src/core/m3_simulation.py tests/test_m3.py
git commit -m "feat: implement M3 simulation engine with Pattern-Mapped CAG"
```

---

## Task 6: M4 Scorer & Fixer

**Files:**
- Create: `src/core/m4_scorer.py`
- Create: `tests/test_m4.py`

- [ ] **Step 1: 테스트 먼저 작성**

`tests/test_m4.py`:
```python
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
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pytest tests/test_m4.py -v
```

Expected: `ImportError`

- [ ] **Step 3: m4_scorer.py 구현**

`src/core/m4_scorer.py`:
```python
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
    }
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pytest tests/test_m4.py -v
```

Expected: 6개 PASSED

- [ ] **Step 5: Commit**

```bash
git add src/core/m4_scorer.py tests/test_m4.py
git commit -m "feat: implement M4 scorer with cohort-level confusion scoring"
```

---

## Task 7: Pipeline 통합

**Files:**
- Modify: `src/core/logic.py`
- Create: `tests/test_pipeline.py`

- [ ] **Step 1: 테스트 먼저 작성**

`tests/test_pipeline.py`:
```python
import json
from unittest.mock import patch, MagicMock
from src.core.logic import run_pipeline

MOCK_M1 = {
    "components": [{"type": "button", "label": "가입", "line_number": 10,
                    "styling": {"size": "text-xs"}, "context": "가입 버튼"}],
    "visual_hierarchy": "버튼이 작음",
    "potential_issues": ["버튼 너무 작음"],
    "detected_patterns": ["small_button"]
}
MOCK_M3 = {
    "think_aloud": "버튼이 어딨지...",
    "confusion_events": [{"element": "button", "line_number": 10,
                          "reason": "너무 작음", "severity": 0.8,
                          "evidence": "Nah(2004)"}],
    "abandoned": True,
    "abandonment_reason": "버튼 미발견"
}

def test_run_pipeline_returns_required_keys():
    codebase = [{"name": "App.tsx", "content": "export default function App() { return <button>가입</button>; }"}]

    with patch("src.core.logic.analyze_code", return_value=MOCK_M1), \
         patch("src.core.logic.run_simulation", return_value=MOCK_M3):
        result = run_pipeline(codebase, "20대 대학생", "회원가입하기")

    assert "confusion_score" in result
    assert "fix_prompts" in result
    assert "think_aloud" in result
    assert "top3" in result

def test_run_pipeline_score_is_int():
    codebase = [{"name": "App.tsx", "content": "..."}]

    with patch("src.core.logic.analyze_code", return_value=MOCK_M1), \
         patch("src.core.logic.run_simulation", return_value=MOCK_M3):
        result = run_pipeline(codebase, "20대 대학생", "회원가입하기")

    assert isinstance(result["confusion_score"], int)
    assert 0 <= result["confusion_score"] <= 100
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pytest tests/test_pipeline.py -v
```

Expected: `ImportError` 또는 mock 오류

- [ ] **Step 3: logic.py 교체**

`src/core/logic.py`:
```python
from src.core.m1_analyzer import analyze_code
from src.core.m2_persona import build_m2_output
from src.core.m3_simulation import run_simulation
from src.core.m4_scorer import build_scorer_output

def run_pipeline(codebase: list, persona_desc: str, task: str = "서비스 탐색하기") -> dict:
    """
    codebase: [{"name": "App.tsx", "content": "..."}]
    persona_desc: "20대 대학생" 등
    task: 수행할 태스크 설명
    """
    # M1: 코드 분석 (첫 번째 파일 우선, 이후 확장 가능)
    main_file = codebase[0]
    ui_map = analyze_code(main_file["content"], task)

    # M2: 페르소나 + 연구 청크 선택
    cohort = "20대_대학생"
    constraints, research_context = build_m2_output(
        ui_map.get("detected_patterns", []),
        cohort
    )

    # M3: Think-Aloud 시뮬레이션
    simulation = run_simulation(ui_map, constraints, research_context, task)

    # M4: 혼란 지수 + Fix Prompt
    return build_scorer_output(simulation, main_file["content"], cohort)
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pytest tests/test_pipeline.py -v
```

Expected: 2개 PASSED

- [ ] **Step 5: 전체 테스트 통과 확인**

```bash
pytest tests/ -v
```

Expected: 전체 PASSED (단, LLM 호출 없는 유닛 테스트만)

- [ ] **Step 6: Commit**

```bash
git add src/core/logic.py tests/test_pipeline.py
git commit -m "feat: replace mock pipeline with real M1→M2→M3→M4 pipeline"
```

---

## Task 8: M5 Dashboard 업데이트

**Files:**
- Modify: `src/frontend/ui.py`

- [ ] **Step 1: 결과 포맷 업데이트**

`src/frontend/ui.py` 의 결과 표시 섹션 (`if response.status_code == 200:` 이후):
```python
if response.status_code == 200:
    res = response.json()

    score_val = f"혼란 지수: {res['confusion_score']} / 100"
    cohort_framing = res.get("cohort_framing", "")
    abandoned_str = "⚠️ 이탈 예측됨" if res.get("abandoned") else "✅ 완료 가능"

    # Think-Aloud
    think_aloud_html = f"<blockquote style='border-left:4px solid #f59e0b; padding-left:12px; color:#374151;'>{res.get('think_aloud', '')}</blockquote>"

    # Top3 이슈
    top3_html = "<ul>"
    for item in res.get("top3", []):
        severity_pct = int(item.get("severity", 0) * 100)
        top3_html += (
            f"<li><b>[line {item.get('line_number', '?')}]</b> "
            f"{item.get('reason', '')} "
            f"<span style='color:#6b7280; font-size:0.85em;'>({item.get('evidence', '')})</span>"
            f" — 심각도 {severity_pct}%</li>"
        )
    top3_html += "</ul>"

    fix_prompts_val = "\n\n".join(res.get("fix_prompts", []))

    yield {
        progress_screen: gr.update(visible=False),
        result_screen: gr.update(visible=True),
        score_display: score_val,
        drop_off_display: f"### {abandoned_str}\n{cohort_framing}",
        timeline_display: think_aloud_html + top3_html,
        fix_prompts: fix_prompts_val
    }
```

- [ ] **Step 2: 백엔드 + 프론트엔드 로컬 실행 확인**

터미널 1:
```bash
uvicorn src.backend.api:app --reload --port 8000
```

터미널 2:
```bash
python src/frontend/ui.py
```

브라우저 `http://localhost:7860` 접속 → 샘플 TSX 코드 입력 → 분석 버튼 클릭 → 결과 확인.

- [ ] **Step 3: Commit**

```bash
git add src/frontend/ui.py
git commit -m "feat: update M5 dashboard with cohort-level result display"
```

---

## Self-Review

**Spec 커버리지 확인:**
- [x] M1 Code Analyzer (GPT-4o Mental Rendering) → Task 4
- [x] M2 PersonaParams v2 (8 features + citations) → Task 2, 3
- [x] Pattern-Mapped CAG (CHUNK_REGISTRY + PATTERN_TO_CHUNKS) → Task 2
- [x] M3 Simulation (behavioral_constraints → LLM → Think-Aloud) → Task 5
- [x] M4 Scorer (cohort-level framing + Fix Prompts) → Task 6
- [x] Pipeline Integration → Task 7
- [x] M5 Dashboard update → Task 8
- [x] 서양 논문 + 한국 공공데이터 분리 역할 → Task 2 chunk_registry

**플레이스홀더 없음 확인:** 모든 스텝에 실제 코드 포함.

**타입 일관성:**
- `analyze_code()` → `UIMap` dict (Task 4) → `run_simulation()` 첫 인자 (Task 5) ✅
- `build_m2_output()` → `(str, str)` (Task 3) → `run_simulation(constraints, research_context)` (Task 5) ✅
- `run_simulation()` → `SimulationResult` dict (Task 5) → `build_scorer_output()` (Task 6) ✅
- `run_pipeline()` 반환 → `build_scorer_output()` 반환 (Task 7) ✅
