import os
import sys
import uuid
import numbers
from typing import Any, Dict, List, Optional, Tuple, Union, Callable
from itertools import groupby
from operator import itemgetter

sys.path.append("../cryptography")

import json
from collections import defaultdict
from datetime import datetime

import pymongo
import redis
from dotenv import load_dotenv
from mpc.shamir import SecretShare
from utils.primality import is_prime_miller_rabin
from pprint import pprint


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

        self.redis_host = os.environ.get("REDIS_HOST", "redis")
        self.redis_client = redis.Redis(host=self.redis_host, port=6379, db=0)
        # self.redis_client.config_set('replica-read-only', 'no')

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
            "participant_submissions": {},
            "protocol": self.protocol,
            "prime": self.prime,
            "public_key": public_key,
            "auth_token": auth_token,
            "state": "open",
            "merged": {},
        }

        self.save_session(session_id, session_data)
        return session_id

    def is_initiator(self, session_id: str, auth_token: str) -> bool:
        session_data = self.get_session(session_id)
        return session_data["auth_token"] == auth_token

    def session_exists(self, key):
        return self.redis_client.exists(key) == 1

    def add_participant(self, session_id: str, participant: str) -> None:
        session_data = self.get_session(session_id)

        if session_data["state"] == "closed":
            raise ValueError("Session is closed")

        if not session_data:
            raise ValueError("Invalid session ID")

        if participant not in session_data["participants"]:
            metadata = {
                "timestamp": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            }
            session_data["participants"][participant] = metadata
            self.save_session(session_id, session_data)

    def merge_tables(table1: Dict[str, Union[List, int]], table2: Dict[str, Union[List, int]], func: Callable[[Any, Any], Any]) -> Dict[str, Union[List[Tuple[int, int]], Tuple[int, int]]]:
        def dfs_helper(key: str, dict1: Dict[str, Any], dict2: Dict[str, Any]) -> Union[List[Tuple[int, int]], Tuple[int, int]]:
            if isinstance(dict1[key], numbers.Number) and isinstance(dict2[key], numbers.Number):
                return func(dict1[key], dict2[key])
            elif isinstance(dict1[key], str) and isinstance(dict2[key], str):
                return func(dict1[key], dict2[key])
            elif isinstance(dict1[key], list) and isinstance(dict2[key], list):
                merged, summed = [], 0

                combined_list = dict1[key] + dict2[key]
                combined_list.sort(key=itemgetter(2))

                for share_type, group in groupby(combined_list, key=itemgetter(2)):
                    group_list = list(group)
                    if share_type == 'enc-share':
                        merged.extend(group_list)
                    elif share_type == 'share':
                        summed += sum(int(item[1]) for item in group_list)
                    else:
                        raise ValueError("Incompatible cell types.")

                merged.append(['sum-share', str(summed), 'share'])
                return merged
            elif isinstance(dict1[key], dict) and isinstance(dict2[key], dict):
                if set(dict1[key].keys()) == set(dict2[key].keys()):
                    return {k: dfs_helper(k, dict1[key], dict2[key]) for k in dict1[key].keys()}
                else:
                    raise ValueError("The given dictionaries do not have the same shape.")
            else:
                raise ValueError("The given dictionaries do not have the same shape.")

        if not set(table1.keys()) == set(table2.keys()):
            raise ValueError("The given dictionaries do not have the same shape.")

        result_table: Dict[str, Union[List[Tuple[int, int]], Tuple[int, int]]] = {}

        for key in table1:
            result_table[key] = dfs_helper(key, table1, table2)
        return result_table


    def update_session_data(
        self, session_id: str, participant_id: str, data: dict | str
    ) -> None:
        session_data = self.get_session(session_id)

        if session_data["state"] == "closed":
            raise ValueError("Session is closed")

        if not session_data:
            raise ValueError("Invalid session ID")

        if not session_data["participant_submissions"]:
            session_data["participant_submissions"] = {}

        if type(data) == str:
            data = json.loads(data)

        session_data["participant_submissions"][participant_id] = data
        self.save_session(session_id, session_data)

    def close_submissions(self, session_id: str) -> None:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        session_data["state"] = "closed"

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

        return session_data["merged"]

    def get_session_state(self, session_id: str) -> str:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        return session_data["state"]

    def sum_unencrypted(self, session_id: str):
        session_data = self.get_session(session_id)

        if session_data["state"] != "closed":
            raise ValueError("Session is not closed")

        submissions = session_data["participant_submissions"].values()
        data = submissions[0]

        for i in range(1, len(session_data["participant_submissions"])):
            data = self.merge_tables(data, submissions[i], lambda x,y: float(x)+float(y))

        if "merged" not in session_data:
            session_data["merged"] = {}

        session_data["merged"] = data
        self.save_session(session_id, session_data)
