# AI 모델 기술 스택

## 모델 구성 전체 그림

```
M1 Vision 분석    →  Qwen-VL  (또는 GPT-4o Vision fallback)
M2 Feature 추론   →  Qwen2.5  (RAG + 파인튜닝 목표)
M3 Think-Aloud    →  Qwen2.5  (동일 모델 재사용)
M4 Confusion 스코어 →  Qwen2.5  (동일 모델 재사용)
```

LLM은 Qwen2.5 하나로 통일 — 모델 로딩 비용 최소화.

---

## 1. 메인 LLM: Qwen2.5

| 항목 | 내용 |
|------|------|
| 모델 | `Qwen/Qwen2.5-7B-Instruct` (로컬) |
| 선택 이유 | 팀이 파인튜닝 경험 보유, 한국어 성능 우수, 오픈소스 |
| 추론 방식 | `transformers` + `torch` 로컬 실행 |
| VRAM 요구 | 7B 기준 약 16GB (4bit 양자화 시 8GB) |
| 양자화 | `bitsandbytes` 4bit — GPU 메모리 부족 시 적용 |
| API fallback | OpenAI GPT-4o — 로컬 환경 안 될 때 |

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B-Instruct",
    torch_dtype="auto",
    device_map="auto"
)
```

### 파인튜닝 계획 (2단계)

```
학습 데이터:
  - 공공 데이터 수치 → PersonaParams JSON 변환 쌍
  - Think-Aloud 텍스트 → 혼란 지수 레이블 쌍
  - 베타 테스터 수집 데이터

방법:
  - LoRA / QLoRA (전체 파인튜닝 대신 경량화)
  - `peft` + `trl` 라이브러리

시점: 베타 테스터 데이터 30건 이상 확보 후
```

---

## 2. Vision 모델: Qwen-VL

M1 화면 분석 (스크린샷 → UI 구조 + service_type 분류)

| 항목 | 내용 |
|------|------|
| 모델 | `Qwen/Qwen2-VL-7B-Instruct` |
| 입력 | 스크린샷 이미지 + 텍스트 프롬프트 |
| 출력 | service_type, detected_ui_patterns, potential_confusion |
| fallback | GPT-4o Vision API |

```python
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor

model = Qwen2VLForConditionalGeneration.from_pretrained(
    "Qwen/Qwen2-VL-7B-Instruct", torch_dtype="auto", device_map="auto"
)
```

---

## 3. RAG 파이프라인: LlamaIndex + ChromaDB

M2 feature 기본값 추출에 사용.

```
[공공 데이터 + UX 논문] → 청킹 → 임베딩 → ChromaDB 저장
          ↓
[타겟 설명 쿼리] → 유사도 검색 → 관련 스니펫 → Qwen에게 전달
```

| 라이브러리 | 용도 |
|-----------|------|
| `llama-index` | RAG 파이프라인 오케스트레이션 |
| `chromadb` | 벡터 DB (로컬 실행, 영속 저장) |
| `sentence-transformers` | 임베딩 모델 (`all-MiniLM-L6-v2` 또는 한국어 모델) |

```bash
pip install llama-index chromadb sentence-transformers
```

임베딩 모델 후보:
- `jhgan/ko-sroberta-multitask` — 한국어 특화
- `BAAI/bge-m3` — 다국어, 한국어 성능 우수

---

## 4. 프롬프트 관리: LangChain

M3 멀티턴 Think-Aloud 생성 시 화면 간 컨텍스트 유지.

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain

# 화면 탐색 중 이전 화면 상태를 기억하게 함
memory = ConversationBufferMemory()
```

단순한 단일 호출은 LangChain 없이 직접 구현.
멀티턴이 필요한 시뮬레이션에만 사용.

---

## 전체 설치

```bash
pip install transformers torch torchvision
pip install bitsandbytes peft trl          # 양자화 + 파인튜닝
pip install llama-index chromadb
pip install sentence-transformers
pip install langchain langchain-community
pip install openai                          # fallback
```

---

## GPU 요구사항

| 시나리오 | 최소 VRAM | 권장 |
|---------|---------|------|
| Qwen2.5-7B 풀 정밀도 | 16GB | A100 40GB |
| Qwen2.5-7B 4bit 양자화 | 8GB | RTX 3090 |
| Qwen-VL-7B 추가 | +8GB | |
| 데모 (API fallback) | GPU 불필요 | — |

데모 단계에서는 GPT-4o API로 대체해서 GPU 없이도 동작하도록 설계.

---

## 미결 질문

- [ ] 로컬 Qwen vs GPT-4o API — 데모에서 어떤 걸 기본으로 쓸 것인가?
- [ ] 한국어 임베딩 모델: `ko-sroberta` vs `bge-m3` 성능 비교 필요
- [ ] 파인튜닝 학습 데이터를 어떻게 구성할 것인가? (공공 데이터 → JSON 변환 자동화)
