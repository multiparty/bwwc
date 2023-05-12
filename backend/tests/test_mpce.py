import os
import re

import dotenv
import pytest
from secretshare.mpce import MPCEngine

engine = MPCEngine()
sample_public_key = "sample_public_key"
sample_auth_token = "sample_auth_token"

current_directory_path = os.path.dirname(os.path.abspath(__file__))

dotenv.load_dotenv(os.path.join(current_directory_path, "../env/", ".env.dev"))


def test_create_session():
    session_id = engine.create_session(sample_public_key, sample_auth_token)
    assert len(session_id) == 36


def test_add_participant():
    session_id = engine.create_session(sample_public_key, sample_auth_token)
    engine.add_participant(session_id, "Alice")
    session_data = engine.get_session(session_id)
    assert "Alice" in session_data["participants"]


def test_update_session_data():
    session_id = engine.create_session(sample_public_key, sample_auth_token)
    participant_id = "Alice"
    shares = {
        "shares": {
            "industry1": {"profession1": {"ethnicity1": {"gender1": 123}}},
            "industry2": {"profession2": {"ethnicity2": {"gender2": 456}}},
        }
    }

    engine.update_session_data(session_id, participant_id, shares)

    session_data = engine.get_session(session_id)
    assert session_data["shares"][participant_id] == shares


def test_end_session():
    session_id = engine.create_session(sample_public_key, sample_auth_token)
    engine.update_session_data(session_id, "Alice", {"result": 42})
    engine.end_session(session_id)
    session_data = engine.get_session(session_id)
    assert session_data is None


def test_get_session():
    session_id = engine.create_session(sample_public_key, sample_auth_token)
    session_data = engine.get_session(session_id)
    assert session_data is not None


def test_query_all_sessions():
    _ = engine.create_session(sample_public_key, sample_auth_token)
    _ = engine.create_session(sample_public_key, sample_auth_token)

    query = {}
    sessions = engine.mongo_collection.find(query)
    assert sessions.count() >= 2


def test_generate_urls():
    engine = MPCEngine()
    base_url = engine.base_url
    session_id = "example-session-id"
    participant_count = 5

    participant_urls = engine.generate_participant_urls(session_id, participant_count)

    assert len(participant_urls) == participant_count

    url_pattern = re.compile(
        rf"{re.escape(base_url)}\?session_id={re.escape(session_id)}&participant_token=[0-9a-f-]+"
    )

    for i in range(participant_count):
        participant_key = f"participant_{i + 1}"
        assert participant_key in participant_urls
        assert url_pattern.match(participant_urls[participant_key])


def test_same_shape():
    table1 = {"A": [1, 2], "B": [3, 4]}
    table2 = {"A": [5, 6], "B": [7, 8]}
    expected = {"A": [(1, 5), (2, 6)], "B": [(3, 7), (4, 8)]}
    assert engine.merge_tables(table1, table2) == expected


def test_different_keys():
    table1 = {"A": [1, 2], "B": [3, 4]}
    table2 = {"A": [5, 6], "C": [7, 8]}
    with pytest.raises(ValueError) as e_info:
        engine.merge_tables(table1, table2)
    assert str(e_info.value) == "The given dictionaries do not have the same shape."


def test_different_list_lengths():
    table1 = {"A": [1, 2], "B": [3, 4]}
    table2 = {"A": [5, 6], "B": [7, 8, 9]}
    with pytest.raises(ValueError) as e_info:
        engine.merge_tables(table1, table2)
    assert str(e_info.value) == "The given dictionaries do not have the same shape."


def test_nested_structure():
    table1 = {"A": [1, [2, 3]], "B": [4, 5]}
    table2 = {"A": [6, [7, 8]], "B": [9, 10]}
    expected = {"A": [(1, 6), [(2, 7), (3, 8)]], "B": [(4, 9), (5, 10)]}
    assert engine.merge_tables(table1, table2) == expected


def test_count_cells():
    table = {
        "a": 1,
        "b": {
            "c": "foo",
            "d": [1, 2, 3],
            "e": {"f": "bar", "g": [4, 5, 6], "h": {"i": "wow", "j": {"k": [7, 8, 9]}}},
        },
    }
    expected = 7
    assert engine.count_cells(table) == expected
