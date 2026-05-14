import time

def run_mock_pipeline(codebase, persona_desc):
    """
    전체 코드베이스와 페르소나 설명을 받아 시뮬레이션 결과 생성
    codebase: List[Dict] -> [{"name": "App.tsx", "content": "..."}, ...]
    """
    # 분석 중임을 시뮬레이션하기 위한 대기
    time.sleep(2)
    
    # 분석 결과 데이터 생성
    main_file = codebase[0]["name"] if codebase else "unknown_file.tsx"
    
    mock_result = {
        "score": 82,
        "summary": f"입력하신 '{persona_desc[:20]}...' 페르소나가 {len(codebase)}개의 파일을 분석한 결과입니다.",
        "timeline": [
            {"file": main_file, "line": 5, "thought": "이 버튼의 문구가 너무 전문적이라 이해하기 힘들어요.", "confusion": "High"},
            {"file": main_file, "line": 24, "thought": "다음 단계로 가는 버튼이 어디 있는지 한참 찾았네요.", "confusion": "Medium"}
        ],
        "fix_prompts": [
            f"[{main_file}] 5번 라인의 텍스트를 더 쉬운 단어로 변경해줘.",
            f"[{main_file}] 24번 라인 버튼에 'bg-blue-500'을 추가해서 더 눈에 띄게 해줘."
        ],
        "drop_off_point": "회원가입 완료 단계"
    }
    return mock_result
