# M2 — Persona Engine (MVP)

## 목적

PersonaLab은 **특정 개인의 행동을 예측하지 않는다.**
타겟 코호트에서 **체계적으로 발생하는 UX 실패 지점**을 식별한다.

M2는 논문과 공공 데이터에 기반한 코호트 행동 제약(behavioral constraints)을 생성하여,
M3 시뮬레이션이 현실적인 실패 공간 내에서만 작동하도록 anchoring한다.

---

## 핵심 설계 원칙

**Feature는 개발자에게 노출되지 않는 블랙박스다.**

feature의 역할:
- 인간 인지를 숫자로 "표현"하는 것 ❌
- LLM이 생성할 수 있는 행동의 확률 공간을 연구 기반으로 제한하는 것 ✅

feature 없이 GPT에 "20대 대학생 시뮬해줘" → 매번 다른 결과, 근거 없음
feature 있으면 → Nah(2004)/Sweller(1988) 기반으로 anchoring된 일관된 생성

---

## PersonaParams v2 — 20대 대학생 Pre-baked Baseline

각 feature는 **특정 UX 실패 모드를 예측하는 측정 도구**다.

```json
{
  "cohort": "20대_대학생",
  "features": {
    "digital_literacy": {
      "value": 0.78,
      "failure_mode": "어디서 스키마 불일치가 발생하는가",
      "evidence": "Hargittai (2010): high autonomy + long usage history; within-group σ=0.15"
    },
    "patience_threshold_sec": {
      "value": 3.5,
      "failure_mode": "언제 이탈하는가",
      "evidence": "Nah (2004): 2초 TWT baseline, 20대는 소폭 높음; 실패 1회마다 -0.5초 누적 감소"
    },
    "cognitive_load_headroom": {
      "value_familiar_domain": 0.72,
      "value_novel_domain": 0.35,
      "failure_mode": "얼마나 많은 선택지/단계를 감당하는가",
      "evidence": "Sweller (1988): SNS/쇼핑 스키마 강함; 새 도메인에서는 초보자 수준으로 하락"
    },
    "mental_model_anchors": {
      "value": ["instagram", "kakaotalk", "coupang", "youtube", "toss"],
      "failure_mode": "어떤 UI 패턴 불일치가 혼란을 유발하는가",
      "evidence": "Norman (1983): 기존 서비스 패턴이 새 서비스로 전이됨; 불일치 지점이 막히는 지점"
    },
    "self_efficacy": {
      "value": 0.71,
      "gender_delta": -0.12,
      "failure_mode": "새 기능을 시도조차 하는가",
      "evidence": "Hargittai (2010): 여성 사용자 자기효능감 과소평가 경향; 시도 포기로 이어짐"
    },
    "trust_disposition": {
      "value": 0.58,
      "failure_mode": "회원가입/결제를 완료하는가",
      "evidence": "McKnight (2002): 앱스토어 신뢰 O, 생소한 스타트업 UI → 즉시 이탈"
    },
    "bballi_bballi": {
      "value": 0.75,
      "failure_mode": "온보딩을 읽지 않고 스킵하는가",
      "evidence": "한국지능정보사회진흥원 (2025): 20대 즉각 결과 기대 전 연령 최고"
    },
    "error_recovery_capacity": {
      "value": 0.65,
      "failure_mode": "오류 발생 시 이탈하는가 vs 해결 시도하는가",
      "evidence": "Norman/Staggers (1993): 미성숙 멘탈 모델 → 인증/결제 오류에서 급감"
    }
  }
}
```

---

## build_behavioral_constraints() — Feature → LLM Prompt 변환

feature 수치를 LLM에 직접 주입하지 않는다.
**자연어 행동 제약으로 변환하여 주입한다.**

```python
def build_behavioral_constraints(params: dict) -> str:
    anchors = ", ".join(params["features"]["mental_model_anchors"]["value"])
    patience = params["features"]["patience_threshold_sec"]["value"]
    bballi = params["features"]["bballi_bballi"]["value"]

    return f"""
당신은 {params['cohort']} 코호트를 대표하는 사용자입니다.

행동 제약:
- {anchors} 패턴에 익숙하며, 이와 다른 UI에서 즉시 혼란을 느낀다
- 응답이 {patience}초 이상 없으면 오류로 인식하고 뒤로 간다
- {'온보딩 텍스트는 거의 읽지 않고 버튼부터 누른다' if bballi > 0.7 else '안내 텍스트를 읽는 편이다'}
- 오류 메시지가 나오면 의미를 해석하려 하지 않고 이탈한다
- 처음 보는 UI 패턴에서는 디지털 숙련자여도 초보처럼 행동한다
    """
```

---

## Semantic Refinement (서비스 버전 / MVP 이후)

MVP: 20대 대학생 baseline만 사용
서비스: 사용자 프롬프트에서 descriptor 감지 → baseline delta 조정

```python
# 예: "서툰 20대 개발자"
REFINEMENT_RULES = {
    "서툰":      {"digital_literacy": -0.25, "self_efficacy": -0.20},
    "직장인":    {"patience_threshold_sec": +0.8},  # 목적 명확 → 소폭 인내
    "바쁜":      {"bballi_bballi": +0.15},
}
```

---

## 데이터 소스

- **한국지능정보사회진흥원 (2025):** 연령별 디지털 역량 실증 수치
- **Hargittai (2010), Nah (2004), Sweller (1988):** 인지/행동 파라미터 근거
- **Norman/Staggers (1993), McKnight (2002):** 멘탈 모델 / 신뢰 파라미터 근거
- *런타임 RAG 없음 (MVP): baseline은 오프라인에서 사전 계산*
