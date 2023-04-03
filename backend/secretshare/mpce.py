import os
import sys
import uuid
from typing import Any, Dict, List, Optional, Tuple

sys.path.append("../cryptography")

import json
from collections import defaultdict
from datetime import datetime

import pymongo
import redis
from dotenv import load_dotenv
from mpc.shamir import SecretShare
from utils.primality import is_prime_miller_rabin


class MPCEngine(object):
    def __init__(self, protocol: str = "shamirs", prime: int = 180252380737439):
        # Default to 'dev' if not specified
        DJANGO_ENV = os.environ.get("DJANGO_ENV", "dev")

        current_directory_path = os.path.dirname(os.path.abspath(__file__))

        if DJANGO_ENV == "prod":
            load_dotenv(os.path.join(current_directory_path, "../env/.env.prod"))
        else:
            load_dotenv(os.path.join(current_directory_path, "../env/.env.dev"))

        self.base_url = os.environ.get("BASE_URL")
        self.threshold = os.environ.get("THRESHOLD")
        self.protocol = protocol
        self.secret_share = SecretShare(self.threshold, prime)

        self.prime = prime
        config_prime = int(os.environ.get("PRIME", prime))
        if config_prime and is_prime_miller_rabin(config_prime):
            self.prime = config_prime

        # Connect to Redis and MongoDB
        self.redis_host = os.environ.get("REDIS_HOST", "redis")
        self.redis_client = redis.Redis(host=self.redis_host, port=6379, db=0)
        self.mongo_host = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
        self.mongo_client = pymongo.MongoClient(self.mongo_host)
        self.mongo_db = self.mongo_client["mpc_database"]
        self.mongo_collection = self.mongo_db["completed_sessions"]

    def save_session(self, session_id: str, session_data: Dict[str, Any]) -> None:
        self.redis_client.set(session_id, json.dumps(session_data))

    def create_session(self, auth_token: str, public_key: str) -> str:
        session_id = str(uuid.uuid4())[:26]
        session_data = {
            "session_id": session_id,
            "participants": {},
            "participant_submissions": None,
            "shares": {},
            "protocol": self.protocol,
            "prime": self.prime,
            "public_key": public_key,
            "auth_token": auth_token,
        }

        self.save_session(session_id, session_data)
        return session_id

    def session_exists(self, key):
        return self.redis_client.exists(key) == 1

    def add_participant(self, session_id: str, participant: str) -> None:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        if participant not in session_data["participants"]:
            metadata = {
                "timestamp": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            }
            session_data["participants"][participant] = metadata
            self.save_session(session_id, session_data)

    """
    Recursively updates the nested dictionary d1 with the contents of the nested dictionary d2.
    If a key exists in both dictionaries and the values are dictionaries, the function is called recursively.
    If a key exists in both dictionaries and the values are lists, the lists in d1 are extended with the elements of the lists in d2.
    Otherwise, the value in d1 is replaced with the value in d2.
    """

    def merge_nested_dict(self, d1: dict, d2: dict) -> dict:
        for key, value in d2.items():
            if key in d1 and isinstance(value, dict) and isinstance(d1[key], dict):
                self.merge_nested_dict(d1[key], value)
            elif key in d1 and isinstance(value, list) and isinstance(d1[key], list):
                d1[key].extend(value)
            else:
                d1[key] = value
        return d1

    def update_session_data(
        self, session_id: str, participant_id: str, data: dict
    ) -> None:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        session_data["participant_submissions"][participant_id] = data

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

    def generate_participant_urls(
        self, session_id: str, participant_count: int
    ) -> Dict[str, str]:
        participant_urls = {}
        
        for i in range(participant_count):
            participant_token = str(uuid.uuid4())[:26]
            participant_url = f"{self.base_url}?session_id={session_id}&participant_code={participant_token}"
            participant_urls[f"participant_{i + 1}"] = participant_url

        return participant_urls

    def get_encrypted_shares(self, session_id: str) -> dict:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        return session_data["shares"]
    
    def get_public_key(self, session_id: str) -> str:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        return session_data["public_key"]
    
    def get_submitted_data(self, session_id: str) -> dict:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        return session_data["participant_submissions"]
