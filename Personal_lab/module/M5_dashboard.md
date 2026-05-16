# M5 — Developer Dashboard (Pivot)

## 목적

개발자가 코드를 입력하고, 분석된 UX 결과와 **즉시 복사 가능한 수정 프롬프트**를 확인하는 중앙 허브.

---

## MVP 화면 구성 (Gradio)

### 1. 입력 섹션
- **Code Editor:** `gr.Code(label="Paste your Component Code", language="typescript")`
- **Context:** 타겟 사용자(페르소나) 및 수행할 태스크 설정

### 2. 분석 결과 섹션
- **UX Score:** 혼란 지수 시각화 (Gauge Chart 또는 컬러 코딩)
- **User Thought:** 페르소나의 'Think-Aloud'를 코드 라인과 매칭하여 표시
  * *예: "32번 라인 입력창을 보며 사용자가 '뭘 입력하라는 건지 모르겠어'라고 생각함"*

### 3. Vibe Coding Fix Zone
- **Fix Prompt Card:** 문제별 수정 지시문
- **Copy Button:** 한 번의 클릭으로 Cursor 등에 붙여넣을 프롬프트 복사

---

## 코드 구조 (MVP)

```python
import gradio as gr

def analyze_ux(code, persona):
    # 파이프라인 호출
    # M1(Code) -> M2(Persona) -> M3(Sim) -> M4(Score/Fix)
    return score, timeline, fix_prompts

with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🧪 PersonaLab: UX Linter for Vibe Coders")
    
    with gr.Row():
        with gr.Column(scale=2):
            code_input = gr.Code(label="Frontend Code", language="typescript", lines=20)
            task_input = gr.Textbox(label="User Task (e.g., 'Sign up')")
        
        with gr.Column(scale=1):
            # MVP: 20대 대학생 only. 서비스 버전에서 확장.
            persona_drop = gr.Dropdown(["20대 대학생 (MVP)"], label="Target Cohort")
            analyze_btn = gr.Button("Analyze UX", variant="primary")
            
    with gr.Row():
        with gr.Column():
            score_display = gr.Label(label="코호트 UX 혼란 지수")
            timeline_display = gr.HTML(label="코호트 대표 Think-Aloud")
            
        with gr.Column():
            gr.Markdown("### 🛠️ Vibe Coding Fix Prompts")
            fix_prompts = gr.Markdown("분석 후 프롬프트가 여기에 표시됩니다.")
            copy_btn = gr.Button("Copy All Fix Prompts")

demo.launch()
```
