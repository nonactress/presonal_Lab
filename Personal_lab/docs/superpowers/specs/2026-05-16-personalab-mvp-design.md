# PersonaLab MVP — Design Spec
**날짜:** 2026-05-16  
**데드라인:** 2026-05-25 (FIN:NECT 챌린지 2026)  
**팀:** SW 전공 2인 (20대 대학생)

---

## 1. 문제 정의 & 서비스 포지셔닝

### 핵심 가설 (H5)
개인 개발자는 리소스 부족으로 UX 검증을 체계적으로 건너뛴다.
→ PersonaLab은 이 공백을 채우는 AI 기반 UX 실패 예측 도구다.

### 올바른 포지셔닝
> PersonaLab은 특정 개인의 행동을 예측하지 않는다.
> **타겟 코호트에서 체계적으로 발생하는 UX 실패 지점을 식별한다.**

이는 과장이 아니다. UX 리서치의 본질이 이것이다.
Nielsen의 "사용자 5명이 UX 문제 85%를 찾는다"는 UX 문제가 개인적이지 않고 **시스템적**이기 때문에 성립한다.

### MVP 타겟 코호트: 20대 대학생
- **선택 이유:** 팀원이 20대 대학생 → 실제 user test 10~30명 직접 모집 가능
- **검증 전략:** AI 예측 vs 실제 user test 비교 → H3 (Think-Aloud 근사 가능) 검증
- **경쟁 차별화:** GPT 직접 활용과 달리, 각 예측에 논문 citation이 붙음

---

## 2. 전체 아키텍처

```
[입력]
  프론트엔드 코드 (TSX/JSX/ZIP) + 타겟 태스크

[M1 — Code Analyzer]
  GPT-4o Mental Rendering
  → UI 요소 맵 JSON (컴포넌트, 라인 번호, 시각적 위계)

[M2 — Persona Engine]  ← BLACK BOX (개발자에게 노출 안 됨)
  20대 대학생 pre-baked PersonaParams 로드
  → build_behavioral_constraints() → 자연어 행동 제약

[M3 — Simulation Engine]
  behavioral_constraints + UI맵 → GPT-4o 호출
  → Think-Aloud + confusion_events JSON

[M4 — Scorer & Fixer]
  혼란 지수 계산 + 코호트 실패 위험도 framing
  → 이탈 위험 Top3 + 라인 번호 기반 Fix Prompts

[M5 — Gradio Dashboard]
  코드 입력 → 결과 확인 → Fix Prompt 복사
```

**기술 스택:** GPT-4o API + FastAPI + Gradio  
**제외 (MVP):** Playwright, ChromaDB, UXAgent 포크, Qwen 파인튜닝

---

## 3. M2 PersonaParams v2 설계

### 핵심 원칙
Feature = UX 실패 모드를 예측하는 연구 기반 측정 도구.
인간 인지를 표현하는 것이 아니라, LLM 생성 공간을 anchoring하는 장치.

### Feature Schema — 20대 대학생 Baseline

| Feature | Value | 예측 실패 모드 | 논문 근거 |
|---------|-------|--------------|---------|
| `digital_literacy` | 0.78 (σ=0.15) | 스키마 불일치 발생 위치 | Hargittai 2010 |
| `patience_threshold_sec` | 3.5초 (실패마다 -0.5초) | 이탈 시점 | Nah 2004 |
| `cognitive_load_headroom` | 친숙 0.72 / 새 도메인 0.35 | 감당 가능한 선택지 수 | Sweller 1988 |
| `mental_model_anchors` | [instagram, kakaotalk, coupang, youtube, toss] | UI 패턴 불일치 혼란 | Norman 1983 |
| `self_efficacy` | 0.71 (여성 -0.12) | 새 기능 시도 여부 | Hargittai 2010 |
| `trust_disposition` | 0.58 | 회원가입/결제 완료 여부 | McKnight 2002 |
| `bballi_bballi` | 0.75 | 온보딩 스킵 여부 | 한국 공공데이터 2025 |
| `error_recovery_capacity` | 0.65 | 오류 후 이탈 vs 해결 | Norman/Staggers 1993 |

### Feature → LLM 변환 (블랙박스 내부)
feature 수치를 LLM에 직접 노출하지 않는다.
`build_behavioral_constraints()` 가 자연어 행동 제약으로 변환.
LLM은 이 제약 안에서 창발적 Think-Aloud를 생성한다.

---

## 4. 서비스 버전 Hybrid Architecture (MVP 이후)

```
연령별 Pre-baked Baseline JSON
  20대, 30대, 40대, 60대+

사용자 프롬프트 입력
  "서툰 20대 개발자"

Semantic Refinement Layer (GPT-4o)
  "서툰" → digital_literacy -0.25, self_efficacy -0.20
  "직장인" → patience_threshold +0.8초

Final PersonaParams → build_behavioral_constraints()
```

MVP: 20대 baseline only, refinement 없음.
서비스: 연령 감지 + semantic refinement 추가.

---

## 5. 검증 전략

### H3 검증 (핵심)
- AI 예측: "onboarding step 2에서 cognitive_load_headroom 초과로 confusion 예측"
- User test: 20대 대학생 10~30명 Think-Aloud 수집
- 측정: AI confusion 예측 지점 vs 실제 막힌 지점 매칭률

### 심사 데모 스토리
1. 개발자가 React 코드 + "20대 대학생" 입력
2. PersonaLab: "onboarding 3단계에서 높은 비율이 이탈 예측 (근거: bballi_bballi 0.75 + cognitive_load Sweller 1988)"
3. 실제 user test 결과 비교 슬라이드: "실제 27/30명이 해당 지점 이탈"
4. Fix Prompt 적용 후 재분석: 개선 전/후 비교

---

## 6. 데이터 흐름

```
M1 Output:
{
  "components": [
    {"type": "button", "label": "가입하기", "line_number": 45, "styling": {"size": "small"}},
    ...
  ],
  "visual_hierarchy": "상단 배너가 CTA보다 눈에 띔",
  "potential_issues": ["text-gray-300 대비 낮음"]
}

M2 Output (internal):
"이 사용자는 instagram, kakaotalk 패턴에 익숙하며..."  ← 자연어

M3 Output:
{
  "think_aloud": "가입 버튼이 너무 작아서 어디 있는지 한참 찾았어...",
  "confusion_events": [
    {"element": "button#signup", "line": 45, "reason": "크기 작음, 배경과 대비 낮음", "severity": 0.82}
  ]
}

M4 Output:
{
  "confusion_score": 76,
  "cohort_framing": "20대 대학생 코호트에서 이 화면의 실패 위험도 높음",
  "top3_issues": [...],
  "fix_prompts": [
    "[App.tsx:45] 버튼에 'p-4 text-lg bg-blue-600' 추가해서 크기와 대비 개선해줘"
  ]
}
```

---

## 7. M3 연구 데이터 활용 — Pattern-Mapped CAG

### 왜 연구 데이터를 M3에 주입하는가

서양 논문 = **메커니즘** ("왜 막히는가")  
한국 공공데이터 = **수치 보정** ("한국 20대는 얼마나 빨리 막히는가")

두 개를 함께 써야 한국 사용자에게 유효한 예측이 나온다.
한국 공공데이터 없이 서양 논문만 쓰면 → 빨리빨리 문화, 카카오/네이버 멘탈모델 반영 안 됨.

### Pattern-Mapped CAG 구조

전체 논문 주입(Full CAG) 대신, M1이 감지한 UI 패턴에 관련된 청크만 선택 주입.

```python
PATTERN_TO_CHUNKS = {
    "small_button":          ["nah_ch2_waiting",       "korean_ch1_digital_gap"],
    "email_verification":    ["mcknight_ch4_trust",    "korean_ch2_sns_nonadopt"],
    "multi_step_form":       ["sweller_ch3_novice",    "korean_ch1_digital_gap"],
    "hamburger_menu":        ["norman_ch3_mental",     "marchionini_ch5_nav"],
    "loading_no_feedback":   ["nah_ch2_waiting"],
    "no_error_guidance":     ["norman_ch3_mental",     "sweller_ch5_schema"],
    "trust_signal_missing":  ["mcknight_ch4_trust",    "korean_ch3_ai_adoption"],
}

def get_relevant_chunks(ui_patterns: list) -> str:
    chunk_ids = set()
    for p in ui_patterns:
        chunk_ids.update(PATTERN_TO_CHUNKS.get(p, []))
    return "\n\n".join(CHUNK_REGISTRY[cid] for cid in chunk_ids)
```

M3 system prompt 구성:
```python
system_prompt = f"""
[관련 연구 근거]
{get_relevant_chunks(ui_map["detected_patterns"])}

[20대 대학생 행동 제약]
{behavioral_constraints}

위 연구를 참고하여 think-aloud를 생성하라.
한국 사용자 맥락(빨리빨리 문화, 카카오/네이버 멘탈모델)을 반영하라.
혼란 지점에 관련 연구 근거를 명시하라.
"""
```

### 출력 품질 비교

연구 데이터 없이:
```
"이메일 인증이 뭔지 모르겠어서 닫았어요."
```

Pattern-Mapped CAG 적용 후:
```
"이메일 인증... 카카오로 로그인하면 안 되나?
 왜 이걸 해야 하는지 모르겠어서 뒤로 갔어요."

[혼란 근거]
- McKnight(2002): 생소한 보안 단계 → 신뢰 하락, 이탈
- 한국지능정보사회진흥원(2025): SNS 비이용 사유 2위 "이용 방법 난해함"
```

### 데이터 소스 역할 분리

| 데이터 | 역할 | 사용 시점 |
|--------|------|---------|
| 서양 UX 논문 (Nah, Sweller, Norman 등) | 메커니즘 설명 — "왜 막히는가" | M2 오프라인 + M3 런타임 |
| 한국 공공데이터 (한국지능정보사회진흥원 2025) | 수치 보정 — "한국 20대는 얼마나" | M2 오프라인 + M3 런타임 |
| CHUNK_REGISTRY | 위 데이터를 청크 단위로 등록한 정적 딕셔너리 | M3 런타임 선택 주입 |

---

## 8. MVP 범위 (9일)

### In Scope
- [ ] M1: 코드 → UI맵 JSON (GPT-4o Mental Rendering)
- [ ] M2: 20대 대학생 pre-baked PersonaParams + build_behavioral_constraints()
- [ ] M2: CHUNK_REGISTRY 구축 (전처리 논문 청크 등록)
- [ ] M3: Pattern-Mapped CAG + GPT-4o Think-Aloud 생성
- [ ] M4: 혼란 지수 계산 + 라인 번호 Fix Prompt (논문 근거 포함)
- [ ] M5: Gradio 입력/결과 UI

### Out of Scope (MVP 이후)
- Semantic refinement (연령별 확장)
- 버전 비교 (V1→V2 자동 추적)
- 복수 think-aloud sampling (Monte Carlo)
- Qwen 파인튜닝 교체
