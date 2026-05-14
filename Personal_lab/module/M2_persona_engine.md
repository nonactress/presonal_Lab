# M2 — Persona Engine (MVP)

## 목적

M1의 서비스 분석 결과와 공공 데이터 RAG를 결합하여,
**개발자가 타겟팅하는 인구 집단의 행동 파라미터(PersonaParams)를 자동 생성한다.**

---

## MVP 파이프라인

1. **타겟 프리셋 선택:** 개발자가 "60대 어르신" 등을 선택
2. **RAG 검색:** ChromaDB에서 해당 집단의 디지털 역량, 선호 UI 패턴 근거 추출
3. **파라미터 생성:** GPT-4o가 근거를 바탕으로 `digital_literacy`, `patience` 등의 수치(0~1) 할당

---

## 데이터 소스
- **공공 데이터:** 디지털정보격차 실태조사 등 (수치 베이스)
- **논문:** 학술적 근거 (심리 베이스)
- *커뮤니티 및 리뷰 데이터는 MVP에서 제외*

---

## 결과물: PersonaParams
```json
{
  "digital_literacy": 0.25,
  "patience_threshold": 0.4,
  "ui_pattern_familiarity": 0.15,
  "evidence": "2024 디지털정보격차 실태조사: 60대 역량지수 50% 미만 반영"
}
```
