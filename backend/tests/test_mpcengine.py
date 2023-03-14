import sys
sys.path.append('../secretshare')

from mpc_engine import MPCEngine

def test_engine_init():
    engine = MPCEngine()