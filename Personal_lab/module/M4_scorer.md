# M4 — Scorer & Fixer (Pivot)

## 목적

M3의 시뮬레이션 결과를 분석하여 혼란 지수를 계산하고,
**개발자가 코드 파일의 특정 라인을 즉시 고칠 수 있는 'Actionable Fix Prompts'를 생성한다.**

---

## 입출력

| | 내용 |
|--|------|
| **Input** | `SimulationResult` (M3) + `SourceCode` (M1) |
| **Output** | 혼란 지수 + **[Line-specific Fix Prompts]** |

---

## 핵심 기능: 코드 기반 Vibe Coding 프롬프트

단순한 조언을 넘어, 개발자가 Cursor나 v0에 **"이 코드를 이렇게 바꿔"**라고 명령할 수 있는 수준의 프롬프트를 생성한다.

### 프롬프트 생성 예시
```python
def generate_line_fix_prompt(issue):
    return f"""
    [UX Issue Found]
    - 위치: {issue.file_path} (Line {issue.line_number})
    - 문제: 사용자가 버튼의 역할을 인지하지 못함 (크기 너무 작음)
    
    [Fix Instruction for Cursor/v0]
    "{issue.line_number}번 라인의 <button> 태그에 'p-4 text-lg font-bold' 클래스를 추가해서 
     크기를 키우고, 배경색을 'bg-blue-600'으로 변경해서 가독성을 높여줘."
    """
```

---

## 차별화 포인트

1. **라인 번호 지칭:** 개발자가 코드를 찾을 필요 없이 바로 수정 가능.
2. **Tailwind/CSS 추천:** 단순 제안이 아니라, 실제 프로젝트에서 사용 중인 스타일링 방식(예: Tailwind)에 맞춘 코드 조각 제공.
3. **Before/After 비교:** 수정한 후의 예상 혼란 지수 변화를 함께 제시하여 수정 동기 부여.

---

## 우리가 직접 구현하는 것
- 코드 위치 매핑 알고리즘 (M1 분석 결과 활용)
- **Vibe Coder를 위한 지시문 최적화 템플릿**
- 수정 전/후 점수 예측 모델 (LLM 기반)
