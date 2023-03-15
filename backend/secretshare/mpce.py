import sys
import uuid
from typing import Any, Dict, List, Optional
sys.path.append('../cryptography')

import json
import configparser
import redis
import pymongo

from utils.primality import is_prime_miller_rabin

class MPCEngine(object):
    def __init__(self, protocol: str = 'shamirs', prime: int = 180252380737439):
        parser = configparser.ConfigParser()
        parser.read('../config/dev.ini')

        self.protocol = protocol

        self.prime = prime
        config_prime = parser.getint('DEFAULT', 'PRIME')
        if config_prime and is_prime_miller_rabin(config_prime):
            self.prime = config_prime

        # Connect to Redis and MongoDB
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        self.mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
        self.mongo_db = self.mongo_client["mpc_database"]
        self.mongo_collection = self.mongo_db["completed_sessions"]
        
    
    def save_session(self, session_id: str, session_data: Dict[str, Any]) -> None:
        self.redis_client.set(session_id, json.dumps(session_data))


    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        session_data = {
            'session_id': session_id,
            'participants': [],
            'shares': {},
            'protocol': self.protocol,
            'prime': self.prime,
        }
        
        self.save_session(session_id, session_data)
        return session_id


    def add_participant(self, session_id: str, participant: str) -> None:
        session_data = self.get_session(session_id)
        if not session_data:
            raise ValueError("Invalid session ID")

        session_data['participants'].append(participant)
        self.save_session(session_id, session_data)


    def update_session_data(self, session_id: str, data: Dict[str, Any]) -> None:
        session_data = self.get_session(session_id)
        if not session_data:
            raise ValueError("Invalid session ID")

        session_data['shares'].update(data)
        self.save_session(session_id, session_data)


    def end_session(self, session_id: str) -> None:
        session_data = self.get_session(session_id)
        if not session_data:
            raise ValueError("Invalid session ID")

        self.mongo_collection.insert_one(session_data)
        self.redis_client.delete(session_id)


    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        session_data = self.redis_client.get(session_id)

        if session_data is None:
            return None

        return json.loads(session_data)


    def get_all_sessions(self) -> List[Dict[str, Any]]:
        return [self.get_session(id) for id in self.redis_client.keys()]
