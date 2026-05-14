# Backend 기술 스택 (Pivot: Code Analyzer)

## API 서버: FastAPI

### 선택 이유
- Python 기반 — 코드 파싱 및 AI 모델 연동 용이
- 비동기 처리로 대용량 코드 분석 및 LLM 호출 병렬화 가능

---

## 모듈별 엔드포인트 설계 (MVP)

```
POST /analyze/code
  Input:  { code, target_preset, context_description }
  Output: { analysis_id, initial_ux_report }
  역할:   M1(Code Analysis) + M2(Persona) + M3(Simulation) 통합 실행

GET /report/{analysis_id}
  Output: { confusion_scores, fix_prompts, simulation_logs }
  역할:   분석 결과 및 Vibe Coding용 수정 프롬프트 조회
```

---

## 코드 분석: 정적 분석 + LLM Mental Rendering

기존 Playwright(브라우저 자동화)를 제거하고, 소스코드 자체를 분석하는 방식으로 전환합니다.

| 항목 | 내용 |
|------|------|
| 입력 형식 | React(TSX/JSX), HTML, Tailwind CSS, Vue 등 |
| 분석 방식 | LLM (GPT-4o)의 코드 구조 파악 및 시각적 렌더링 추론 |
| 주요 추출 | DOM 계층 구조, 스타일링 클래스(Tailwind), 인터랙션 로직 |

---

## 데이터 저장

### 리포트 저장: JSON 파일 기반 (초기)
```
reports/
  {project_id}/
    {timestamp}/
      source_code.txt
      persona_params.json
      ux_analysis.json
      fix_prompts.json
```

---

## 주요 라이브러리

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| `fastapi` | latest | API 서버 |
| `uvicorn` | latest | ASGI 서버 |
| `pydantic` | v2 | 데이터 스키마 및 코드 입력 검증 |
| `openai` | latest | GPT-4o API 호출 (Main Engine) |

```bash
pip install fastapi uvicorn pydantic openai
```

---

## 실행 구조 (MVP)

```
Gradio (Frontend) <-> FastAPI (Backend) <-> LLM (Code Analysis & UX Simulation)
```
데모 단계에서는 Gradio에서 직접 로직을 호출하되, 함수 구조는 FastAPI 엔드포인트에 맞게 모듈화하여 개발합니다.
