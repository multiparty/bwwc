import sys
sys.path.append('../secretshare')

from mpce import MPCEngine

    
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
    engine.update_session_data(session_id, {'result': 42})
    session_data = engine.get_session(session_id)
    assert session_data['shares']['result'] == 42


def test_end_session():
    engine = MPCEngine()
    session_id = engine.create_session()
    engine.add_participant(session_id, 'Alice')
    engine.update_session_data(session_id, {'result': 42})
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
