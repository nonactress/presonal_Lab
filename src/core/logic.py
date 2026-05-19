import asyncio
import json
from pathlib import Path

from src.core.m1_analyzer import analyze_code
from src.core.m3_simulation import run_simulation_for_persona
from src.core.m4_scorer import build_scorer_output_v2

_STRATA_PATH = Path("data/nemotron_strata.json")


def _load_strata() -> dict:
    with open(_STRATA_PATH, encoding="utf-8") as f:
        return json.load(f)


def _match_strata(strata_data: dict, strata_keys: list[str]) -> list[tuple[str, dict]]:
    return [
        (key, strata_data["strata"][key])
        for key in strata_keys
        if key in strata_data["strata"]
    ]


async def _simulate_one(
    persona: dict, ui_map: dict, task: str, sem: asyncio.Semaphore
) -> dict:
    async with sem:
        return await run_simulation_for_persona(persona, ui_map, task)


async def run_pipeline(
    codebase: list,
    strata_keys: list[str],
    task: str = "서비스 탐색하기",
) -> dict:
    main_file = codebase[0]
    ui_map = analyze_code(main_file["content"], task)

    strata_data = _load_strata()
    matched = _match_strata(strata_data, strata_keys)

    if not matched:
        raise ValueError(f"매칭된 strata 없음: {strata_keys}")

    sem = asyncio.Semaphore(25)
    sim_tasks = []
    weights = []

    for _key, stratum in matched:
        personas = stratum["personas"]
        if not personas:
            continue
        weight = stratum["count"] / len(personas)
        for persona in personas:
            weights.append(weight)
            sim_tasks.append(_simulate_one(persona, ui_map, task, sem))

    results = await asyncio.gather(*sim_tasks)

    return build_scorer_output_v2(
        list(results),
        weights,
        main_file["content"],
        preview_html=ui_map.get("preview_html", ""),
    )
