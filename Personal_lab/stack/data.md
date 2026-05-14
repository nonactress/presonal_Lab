# 데이터 파이프라인 기술 스택

## 목적

M2 Persona Engine이 정확한 PersonaParams를 만들려면
신뢰할 수 있는 행동 데이터가 RAG에 들어가 있어야 한다.
이 파일은 그 데이터를 어디서, 어떻게 가져와서 저장하는지를 정의한다.

---

## 1. 공공 데이터 (1순위)

### 핵심 소스

| 데이터셋 | 발행처 | 갱신 | 접근 | PersonaParams 연결 feature |
|---------|------|------|------|--------------------------|
| 디지털정보격차 실태조사 | 과학기술정보통신부 | 매년 | data.go.kr 무료 | `digital_literacy`, `ui_pattern_familiarity` |
| 한국미디어패널조사 | KISDI | 매년 | kisdi.re.kr 무료 | `bballi_bballi`, `time_scarcity` |
| 인터넷이용실태조사 | KISA | 매년 | kisa.or.kr 무료 | 집단별 디지털 경험 수준 |
| KOSIS 인구통계 | 통계청 | 수시 | kosis.kr 무료 | 타겟 집단 규모 파악 |

### 파싱 파이프라인

```python
# 공공 데이터 → feature 값 추출 흐름
def parse_digital_divide_survey(filepath: str) -> dict:
    df = pd.read_excel(filepath)

    return {
        "60대": {
            "digital_literacy": df.loc[df["연령"] == "60대", "디지털역량지수"].mean() / 100,
            "source": "디지털정보격차 실태조사 2024",
            "source_year": 2024,
        },
        "20대": { ... },
        ...
    }
```

```bash
pip install pandas openpyxl requests
```

---

## 2. UX 연구 논문 RAG

### 수집 대상 논문 유형

```
우선순위:
  1. 노인 디지털 기기 사용 연구 (한국 포함)
  2. 연령별 인지 부하 패턴
  3. OCEAN-기술수용 상관 연구
  4. 한국 사용자 UX 특성 연구

소스:
  arXiv, ACM DL, RISS (한국 논문)
```

### 청킹 전략

```python
from llama_index.core.node_parser import SentenceSplitter

splitter = SentenceSplitter(
    chunk_size=512,       # 문장 단위로 분할
    chunk_overlap=64,     # 앞뒤 문맥 보존
)

# 메타데이터 필수 포함 (C7 인용 강제 원칙)
node.metadata = {
    "source": "논문 제목",
    "authors": "저자명",
    "year": 2024,
    "venue": "CHI 2024",
}
```

---

## 3. 커뮤니티 데이터 (2순위)

### 수집 채널

| 채널 | 타겟 집단 | 수집 방법 |
|------|---------|---------|
| 네이트판 | 중장년층 앱 불만 | Python requests + BeautifulSoup |
| 유튜브 댓글 | 앱 튜토리얼 영상 | YouTube Data API v3 |
| 에브리타임 | 20대 대학생 | 크롤링 (정책 확인 필요) |

```bash
pip install beautifulsoup4 google-api-python-client
```

### 전처리

```python
# 커뮤니티 텍스트 → 행동 신호 추출
BEHAVIOR_KEYWORDS = {
    "외부_도움_요청": ["전화했어", "물어봤어", "AS 맡겼어"],
    "이탈":          ["삭제했어", "안 써", "못 쓰겠어"],
    "혼란":          ["모르겠어", "어떻게 하는 거야", "왜 이래"],
}
```

---

## 4. 벡터 DB: ChromaDB

```python
import chromadb

client = chromadb.PersistentClient(path="./chroma_db")  # 로컬 영속 저장

collection = client.get_or_create_collection(
    name="persona_knowledge",
    metadata={"hnsw:space": "cosine"}
)

# 문서 추가
collection.add(
    documents=["문서 내용"],
    metadatas=[{"source": "디지털정보격차 실태조사", "year": 2024}],
    ids=["doc_001"]
)
```

---

## 5. FAILURE_PATTERNS 카탈로그 구축

M3에서 참조하는 카탈로그의 데이터 출처:

| UI 패턴 | 데이터 소스 |
|---------|-----------|
| `scroll_to_find_button` | NNG 공개 연구, 노인 UX 논문 |
| `hamburger_menu` | Nielsen 2014 모바일 UX 연구 |
| `email_verification` | 앱스토어 리뷰 + 커뮤니티 |
| `popup_with_close_button` | 노인 대상 usability 연구 |

초기 버전은 수동 구축 (논문에서 수치 추출).
베타 테스터 Think-Aloud로 수치 보정.

---

## 데이터 구축 순서 (데모까지)

```
Week 0 (지금)
  → 디지털정보격차 실태조사 2024 다운로드 + 파싱 스크립트 작성
  → UX 논문 10편 ChromaDB 적재

Week 1
  → 공공 데이터 파싱 완성 → 집단별 feature 기본값 테이블 완성
  → FAILURE_PATTERNS 초기 버전 수동 구축

Week 2 (베타 이후)
  → 커뮤니티 크롤링 추가
  → Think-Aloud 데이터 수집 + ChromaDB 적재
```

---

## 미결 질문

- [ ] 디지털정보격차 실태조사의 "디지털역량지수" 수치를 0~1 범위 PersonaParams에 어떻게 정규화하는가?
- [ ] 유튜브 Data API 쿼터 제한 — 크롤링 규모 제한이 있는가?
- [ ] ChromaDB 로컬 vs 클라우드 (Chroma Cloud) — 데모 단계는 로컬로 충분한가?
