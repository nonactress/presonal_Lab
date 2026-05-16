import pytest
from data.chunk_registry import load_persona_params, get_relevant_chunks, CHUNK_REGISTRY, PATTERN_TO_CHUNKS

def test_persona_params_loads_all_features():
    params = load_persona_params("20대_대학생")
    features = params["features"]
    required = [
        "digital_literacy", "patience_threshold_sec",
        "cognitive_load_headroom", "mental_model_anchors",
        "self_efficacy", "trust_disposition",
        "bballi_bballi", "error_recovery_capacity"
    ]
    for key in required:
        assert key in features, f"Missing feature: {key}"

def test_persona_params_has_evidence():
    params = load_persona_params("20대_대학생")
    for key, feat in params["features"].items():
        if isinstance(feat, dict):
            assert "evidence" in feat, f"{key} missing evidence citation"

def test_chunk_registry_not_empty():
    assert len(CHUNK_REGISTRY) >= 10, "CHUNK_REGISTRY too sparse"

def test_pattern_mapping_returns_chunks():
    chunks = get_relevant_chunks(["small_button", "multi_step_form"])
    assert len(chunks) > 100, "Expected substantial chunk content"

def test_unknown_pattern_returns_empty():
    chunks = get_relevant_chunks(["nonexistent_pattern_xyz"])
    assert chunks == ""

def test_chunk_deduplication():
    chunks1 = get_relevant_chunks(["small_button"])
    chunks2 = get_relevant_chunks(["small_button", "small_button"])
    assert chunks1 == chunks2
