# M3 — Simulation Engine

## 목적

M1의 UI 구조 데이터와 M2의 행동 제약(behavioral constraints)을 결합하여
타겟 **코호트에서 체계적으로 발생하는 UX 실패 지점**을 시뮬레이션한다.

출력은 **Think-Aloud 텍스트** — "이 버튼이 뭔지 모르겠는데... 그냥 눌러볼까?"
형태의 내부 독백으로, 코호트 대표 행동 내에서 혼란이 발생한 지점과 이유를 드러낸다.

> **중요:** Think-Aloud는 feature로 역추산 불가능한 창발적 결과다.
> feature는 생성 공간을 제한하는 내부 장치일 뿐, 출력에 직접 노출되지 않는다.

---

## 입출력

| | 내용 |
|--|------|
| **Input** | `List[ScreenData]` (M1) + `PersonaParams` (M2) + 수행할 태스크 |
| **Output** | 화면별 Think-Aloud 텍스트 + 혼란 이벤트 목록 |

---

## 구현 상세

### 전략: 직접 구현 (UXAgent 포크 제외)

MVP 9일 기한 내 UXAgent 포크는 비현실적.
GPT-4o 직접 호출로 동일한 Think-Aloud 생성을 구현한다.

```
코드 UI맵 (M1) + behavioral_constraints (M2)
→ build_simulation_prompt()
→ GPT-4o 단일 호출
→ Think-Aloud + confusion_events (JSON)
```

### Step 1 — behavioral_constraints 기반 동적 프롬프트 생성

M2의 `build_behavioral_constraints()`가 반환한 자연어 제약을 시스템 프롬프트에 주입한다.
**feature 수치는 LLM에 직접 전달하지 않는다.**

```python
def build_simulation_prompt(constraints: str, ui_map: dict, task: str) -> str:
    components_desc = "\n".join([
        f"- {c['type']} '{c['label']}' (line {c['line_number']}): {c['context']}"
        for c in ui_map["components"]
    ])

    return f"""
{constraints}

지금 수행하려는 태스크: {task}

화면의 UI 요소:
{components_desc}

시각적 위계 이슈: {ui_map.get('visual_hierarchy', '없음')}

각 UI 요소에 대해 순서대로:
1. 이 요소의 역할을 즉시 이해했는가?
2. 어떤 생각이 드는가? (내부 독백 형식, 1~2문장)
3. 다음 행동은? (클릭 / 스킵 / 혼란으로 이탈)

가장 혼란스러운 지점 하나를 명시하라.
    """
```

### Step 2 — Think-Aloud 생성 (Chain-of-Thought)

화면별로 LLM이 페르소나 입장에서 내부 독백을 생성한다.

```
출력 형식:
{
  "screen_id": "screen_01",
  "think_aloud": "이메일을 넣으라고 하는데... 인증은 뭐지? 그냥 넘어가면 안 되나?",
  "action_taken": "다음 버튼 클릭",
  "confusion_triggered": true,
  "confusion_reason": "이메일 인증 필요 여부 불명확"
}
```

### Step 3 — 이탈 판단 로직

인내심 파라미터(`patience_threshold`)를 소진하는 방식으로 이탈을 결정한다.

```python
# patience는 M2 params에서 로드하되 LLM에 직접 노출하지 않음
# LLM의 think-aloud에서 이탈 신호를 추출하여 판단
patience_budget = params["features"]["patience_threshold_sec"]["value"]  # 초 단위

for screen in screens:
    confusion_level = scorer.get_confusion(think_aloud)  # M4
    patience_budget -= confusion_level * 0.5  # 혼란 1회당 0.5초 소진

    if patience_budget <= 0:
        return SimulationResult(status="abandoned", at_screen=screen.id)
```

---

## 사용 오픈소스

| 라이브러리 | 용도 | 비고 |
|-----------|------|------|
| **UXAgent** (포크) | 기본 시뮬레이션 프레임워크 | arXiv 2504.09407, GitHub 오픈소스 |
| `Qwen2.5` / `GPT-4o` | Think-Aloud 생성 LLM | |
| `LangChain` | 멀티턴 프롬프트 관리 | |

---

## FAILURE_PATTERNS 카탈로그

M1이 감지한 `detected_ui_patterns`와 PersonaParams를 교차해서
각 화면의 실패 확률을 보정한다.

```python
FAILURE_PATTERNS = {
    "scroll_to_find_button": {
        "60대_저리터러시": 0.75,
        "20대_일반":       0.05,
    },
    "hamburger_menu": {
        "60대_저리터러시": 0.80,
        "20대_일반":       0.05,
    },
    "email_verification": {
        "60대_저리터러시": 0.70,
        "20대_일반":       0.10,
    },
    "popup_with_close_button": {
        "60대_저리터러시": 0.60,
        "20대_일반":       0.02,
    },
}

def apply_failure_patterns(screen: ScreenData, persona: PersonaParams) -> float:
    bonus_confusion = 0
    for pattern in screen.detected_ui_patterns:
        prob = FAILURE_PATTERNS.get(pattern, {}).get(persona.group, 0.1)
        bonus_confusion += prob * 30   # 실패 패턴 하나당 최대 +30 혼란
    return min(bonus_confusion, 40)    # 상한선
```

---

## 우리가 직접 구현하는 것

- 파라미터 → 자연어 컨텍스트 변환 함수 (unknown feature 처리 포함)
- 인내심 소진 기반 이탈 판단 로직
- 한국어 Think-Aloud 프롬프트 템플릿
- UXAgent 포크 — 파라미터 주입 레이어
- `FAILURE_PATTERNS` 카탈로그 구축 및 적용 로직

---

## 다음 모듈로 넘기는 데이터

```python
SimulationResult = {
    "task_completed": False,
    "abandoned_at": "screen_02",
    "screens": [
        {
            "screen_id": "screen_01",
            "think_aloud": "...",
            "confusion_triggered": True,
            "confusion_reason": "..."
        },
        ...
    ]
}
```
