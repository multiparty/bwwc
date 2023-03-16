import sys
sys.path.append('../secretshare')

import re
import pytest
import redis

from mpce import MPCEngine


@pytest.fixture(autouse=True)
def clear_redis():
    # Connect to your Redis server
    r = redis.Redis(host='localhost', port=6379, db=0)

    # Flush the currently selected Redis database (db=0 in this case)
    r.flushdb()

    
def test_create_session():
    engine = MPCEngine()
    session_id = engine.create_session()
    assert len(session_id) == 36


def test_add_participant():
    engine = MPCEngine()
    session_id = engine.create_session()
    engine.add_participant(session_id, 'Alice')
    session_data = engine.get_session(session_id)
    assert 'Alice' in session_data['participants']


def test_update_session_data():
    engine = MPCEngine()
    session_id = engine.create_session()
    participant_id = 'Alice'
    shares = {
        'shares': {
            'industry1': {
                'profession1': {
                    'ethnicity1': {
                        'gender1':  123
                    }
                }
            },
            'industry2': {
                'profession2': {
                    'ethnicity2': {
                        'gender2':  456
                    }
                }
            }
        }
    }

    engine.update_session_data(session_id, participant_id, shares)
    
    session_data = engine.get_session(session_id)
    assert session_data['shares'][participant_id] == shares


def test_end_session():
    engine = MPCEngine()
    session_id = engine.create_session()
    engine.update_session_data(session_id, 'Alice', {'result': 42})
    engine.end_session(session_id)
    session_data = engine.get_session(session_id)
    assert session_data is None


def test_get_session():
    engine = MPCEngine()
    session_id = engine.create_session()
    session_data = engine.get_session(session_id)
    assert session_data is not None


def test_get_all_sessions():
    engine = MPCEngine()
    session_id1 = engine.create_session()
    session_id2 = engine.create_session()
    sessions = engine.get_all_sessions()
    assert len(sessions) >= 2


def test_generate_urls():
    engine = MPCEngine()
    base_url = engine.base_url
    session_id = "example-session-id"
    participant_count = 5

    participant_urls = engine.generate_participant_urls(session_id, participant_count)

    assert len(participant_urls) == participant_count

    url_pattern = re.compile(rf"{re.escape(base_url)}\?session_id={re.escape(session_id)}&participant_token=[0-9a-f-]+")

    for i in range(participant_count):
        participant_key = f"participant_{i + 1}"
        assert participant_key in participant_urls
        assert url_pattern.match(participant_urls[participant_key])