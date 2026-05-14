# M3 — Simulation Engine

## 목적

M1의 UI 구조 데이터와 M2의 행동 파라미터를 결합해서
타겟 사용자가 실제로 서비스를 탐색하는 과정을 시뮬레이션한다.

출력은 **Think-Aloud 텍스트** — "이 버튼이 뭔지 모르겠는데... 그냥 눌러볼까?"
형태의 내부 독백으로, 혼란이 발생한 지점과 이유를 드러낸다.

---

## 입출력

| | 내용 |
|--|------|
| **Input** | `List[ScreenData]` (M1) + `PersonaParams` (M2) + 수행할 태스크 |
| **Output** | 화면별 Think-Aloud 텍스트 + 혼란 이벤트 목록 |

---

## 구현 상세

### 전략: UXAgent 오픈소스 포크

UXAgent (arXiv 2504.09407)는 LLM 기반 UX 시뮬레이션 프레임워크다.
이를 그대로 쓰지 않고, **행동 파라미터 주입 레이어**를 추가해서 포크한다.

UXAgent 기본 흐름:
```
화면 스크린샷 → LLM → "다음에 뭘 클릭할지" 결정 → 반복
```

우리가 추가하는 것:
```
화면 스크린샷 + PersonaParams → 파라미터 기반 프롬프트 생성
→ LLM → Think-Aloud + 혼란 판단 → 반복
```

### Step 1 — 파라미터 기반 동적 프롬프트 생성

PersonaParams를 자연어 컨텍스트로 변환해서 시스템 프롬프트에 주입한다.
`value=None` (unknown) feature는 "보통 사람" 기본 서술로 대체한다.

```python
def build_persona_prompt(params: PersonaParams) -> str:
    def describe(feature: str, low: str, high: str, default: str = "보통") -> str:
        fv = params.get(feature)
        if fv is None or fv.value is None:
            return default   # unknown → 보통
        return low if fv.value < 0.4 else (high if fv.value > 0.7 else "보통")

    return f"""
당신은 지금 처음 보는 앱을 사용하는 사람입니다.

특성:
- 디지털 기기 이해도: {describe("digital_literacy", "낮음", "높음")}
- 막히면: {describe("external_help_tendency", "혼자 해결 시도", "바로 주변에 도움 요청")}
- 빨리빨리 성향: {describe("bballi_bballi", "천천히 꼼꼼히", "빨리 끝내고 싶음")}
- 에러 발생 시: {describe("error_anxiety", "침착하게 대처", "당황하고 멈춤")}

각 화면에서:
1. 지금 무엇을 해야 할지 이해했는가?
2. 어떤 요소가 혼란스러운가?
3. 지금 어떤 생각을 하고 있는가? (내부 독백 형식으로)
4. 계속 진행할 것인가, 이탈할 것인가?
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
patience = params["patience_threshold"]  # 예: 0.3

for screen in screens:
    confusion_level = scorer.get_confusion(think_aloud)
    patience -= confusion_level * 0.1

    if patience <= 0:
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
