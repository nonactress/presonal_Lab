import io
import json
import os
import zipfile
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import httpx
from src.core.logic import run_pipeline

load_dotenv()
app = FastAPI(title="PersonaLab API")

def _groq_client():
    return OpenAI(
        api_key=os.getenv("GROQ_API_KEY"),
        base_url="https://api.groq.com/openai/v1"
    )

_FEATURE_SYSTEM = """사용자 설명 텍스트에서 외형 특징을 추출하라.
추론 가능한 특징은 적극적으로 유추하라 (예: "MZ세대" → age=young, "경력 10년 개발자" → style=worker).
반드시 아래 JSON만 반환하라. 설명 없이.

{
  "gender": "female | male | neutral",
  "hair": "long | short | bald | default",
  "age": "teen | young | adult | senior",
  "build": "tall | short_build | heavy | default",
  "style": "student | worker | busy | lowliteracy | default"
}"""

class PersonaDescRequest(BaseModel):
    persona_desc: str

class GenerateCastRequest(BaseModel):
    persona_hint: str
    source_desc: str = ""

_CAST_SYSTEM = """사용자 설명을 기반으로 다양한 테스터 페르소나 4명을 생성하라.
첫 번째는 힌트와 가장 유사하게, 나머지 3명은 다양성 극대화 (나이, 성별, 디지털 리터러시).
반드시 아래 JSON만 반환하라. 설명 없이.

{
  "personas": [
    {"name": "한국 이름", "age": 숫자, "role": "직업", "traits": ["특성1", "특성2", "특성3"], "goal": "목표 한 줄"},
    {"name": "한국 이름", "age": 숫자, "role": "직업", "traits": ["특성1", "특성2", "특성3"], "goal": "목표 한 줄"},
    {"name": "한국 이름", "age": 숫자, "role": "직업", "traits": ["특성1", "특성2", "특성3"], "goal": "목표 한 줄"},
    {"name": "한국 이름", "age": 숫자, "role": "직업", "traits": ["특성1", "특성2", "특성3"], "goal": "목표 한 줄"}
  ]
}"""

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/persona-features")
async def extract_persona_features(req: PersonaDescRequest):
    try:
        client = _groq_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": _FEATURE_SYSTEM},
                {"role": "user", "content": req.persona_desc},
            ],
            response_format={"type": "json_object"},
            max_tokens=128,
        )
        features = json.loads(response.choices[0].message.content)
        allowed = {
            "gender": {"female", "male", "neutral"},
            "hair": {"long", "short", "bald", "default"},
            "age": {"teen", "young", "adult", "senior"},
            "build": {"tall", "short_build", "heavy", "default"},
            "style": {"student", "worker", "busy", "lowliteracy", "default"},
        }
        sanitized = {k: v if v in allowed[k] else "default" for k, v in features.items() if k in allowed}
        return sanitized
    except Exception as e:
        print(f"persona-features error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-cast")
async def generate_cast(req: GenerateCastRequest):
    try:
        client = _groq_client()
        prompt = req.persona_hint
        if req.source_desc:
            prompt += f"\n소스: {req.source_desc}"
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": _CAST_SYSTEM},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            max_tokens=600,
        )
        data = json.loads(response.choices[0].message.content)
        return data
    except Exception as e:
        print(f"generate-cast error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze")
async def analyze_code(
    files: Optional[List[UploadFile]] = File(default=None),
    persona_desc: str = Form(...),
    task: str = Form(default="서비스 탐색하기"),
    target_url: Optional[str] = Form(default=None)
):
    try:
        codebase = []

        if target_url:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(target_url)
                codebase.append({"name": target_url, "content": resp.text})
        elif files:
            for file in files:
                content = await file.read()
                if file.filename.endswith(".zip"):
                    with zipfile.ZipFile(io.BytesIO(content)) as z:
                        for name in z.namelist():
                            if not name.endswith("/") and "__MACOSX" not in name:
                                with z.open(name) as f:
                                    try:
                                        codebase.append({
                                            "name": name,
                                            "content": f.read().decode("utf-8")
                                        })
                                    except Exception:
                                        continue
                else:
                    try:
                        codebase.append({
                            "name": file.filename,
                            "content": content.decode("utf-8")
                        })
                    except Exception:
                        continue

        if not codebase:
            raise HTTPException(status_code=400, detail="분석 가능한 소스가 없습니다.")

        result = run_pipeline(codebase, persona_desc, task)
        return result

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

app.mount("/", StaticFiles(directory="src/frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
