import os
import sys
import uuid
import numbers
import logging
from typing import Any, Dict, List, Optional, Tuple, Union, Callable
from itertools import groupby
from operator import itemgetter
from collections import defaultdict
import gridfs

sys.path.append("../cryptography")

import json
from datetime import datetime

from pymongo import MongoClient, errors
from dotenv import load_dotenv
from mpc.shamir import SecretShare
from utils.primality import is_prime_miller_rabin


class MPCEngine(object):
    """
    This class handles the operations related to the Multi-Party Computation Engine,
    including session management and configuration.

    Attributes:
    protocol (str): the protocol used for the MPC, default is "shamirs"
    prime (int): the prime number used for the secret sharing, default is 180252380737439
    """

    def __init__(self, protocol: str = "shamirs", prime: int = 180252380737439):
        self.logger = logging.getLogger("django")

        self.mongo_host = os.environ.get("MONGO_HOST")
        self.mongo_port = os.environ.get("MONGO_PORT")
        self.mongo_client = MongoClient(
            os.environ.get(
                "MONGO_HOST", f"mongodb://{self.mongo_host}:{self.mongo_port}/"
            )
        )
        self.mongo_db = self.mongo_client["bwwc"]
        self.session_collection = self.mongo_db["wage_gap"]
        self.participant_collection = self.mongo_db["participant"]
        self.fs = gridfs.GridFS(self.mongo_db)
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

    """
    Test if MongoDB is running

    inputs:
    host (str, optional) - the host of the MongoDB instance
    port (int, optional) - the port of the MongoDB instance

    outputs:
    bool - True if MongoDB is running, False otherwise
    """

    def is_mongodb_running(self) -> bool:
        try:
            # The 'isMaster' command is cheap and does not require auth.
            self.mongo_client.admin.command("ismaster")
            return True
        except errors.ServerSelectionTimeoutError:
            return False

    """
    Make an backup of the session data in MongoDB

    inputs:
    session_id (str) - the unique identifier of the session to be saved
    session_data (Dict[str, Any]) - a dictionary containing the session data

    outputs:
    None - this function has no return value but saves the session data to the data store
    """

    def save_session(self, session_id: str, session_data: Dict[str, Any]) -> None:
        query = {"session_id": session_id}
        update = {"$set": session_data}
        result = self.session_collection.update_one(query, update, upsert=True)

        if result.matched_count > 0:
            self.logger.info(f"Successfully updated: {session_id} in MongoDB")
        elif result.upserted_id is not None:
            self.logger.info(f"Successfully inserted: {session_id} in MongoDB")
        else:
            self.logger.error(f"Failed to save: {session_id} in MongoDB")

    """
    Saves Participant Data to MongoDB

    inputs:
    session_id (str) - the unique identifier of the session to be saved
    participant_code (str) - the unique identifier of the participant
    session_data (Dict[str, Any]) - a dictionary containing the session data

    outputs:
    None - this function has no return value but saves the session data to the data store
    """

    def save_participant_data(self, session_id: str, participant_code: str, session_data: Dict[str, Any]) -> None:
        query = {"session_id": session_id, "participant_code": participant_code}
        update = {"$set": session_data}
        result = self.participant_collection.update_one(query, update, upsert=True)

        if result.matched_count > 0:
            self.logger.info(f"Successfully updated: {session_id} in MongoDB")
        elif result.upserted_id is not None:
            self.logger.info(f"Successfully inserted: {session_id} in MongoDB")
        else:
            self.logger.error(f"Failed to save: {session_id} in MongoDB")

    """
    Create a new session with the given authentication token and public key

    inputs:
    user_id (str) - id of the user initiating the session
    public_key (str) - the public key associated with the session

    outputs:
    session_id (str) - the unique identifier of the created session
    """

    def create_session(self, user_id: str, public_key: str) -> str:
        session_id = str(uuid.uuid4())[:26]
        session_data = {
            "user_id": user_id,
            "num_cells": 0,
            "prime": self.prime,
            "protocol": self.protocol,
            "public_key": public_key,
            "session_id": session_id,
            "state": "open",
        }

        self.logger.info(
            f"""
        Created session: {session_id}
        Public key: {public_key}
        Prime: {self.prime}
        Mongo status: {self.is_mongodb_running()}
        """
        )

        self.save_session(session_id, session_data)
        return session_id

    """
    Determine if a user is the initiator of a session based on their user_id

    inputs:
    session_id (str) - the unique identifier of the session to be checked
    user_id (str) - id of the user attempting to verify if they are the initiator

    outputs:
    bool - True if the user is the initiator of the session, False otherwise
    """

    def is_initiator(self, session_id: str, user_id: str) -> bool:
        session_data = self.get_session(session_id)
        return session_data["user_id"] == user_id

    """
    Check if a session exists in the data store

    inputs:
    key (str) - the unique key used to identify the session

    outputs:
    bool - True if the session exists, False otherwise
    """

    def session_exists(self, session_id: str) -> bool:
        query = {"session_id": session_id}
        result = self.session_collection.find_one(query)
        return result is not None

    """
    Merge two tables by applying a custom function to their matching elements.

    inputs:
    table1 (Dict[str, Union[List, int]]) - the first table to be merged, where keys are strings and values can be lists or integers
    table2 (Dict[str, Union[List, int]]) - the second table to be merged, where keys are strings and values can be lists or integers
    func (Callable[[Any, Any], Any]) - a custom function to apply to the matching elements of table1 and table2

    outputs:
    result_table (Dict[str, Union[List[Tuple[int, int]], Tuple[int, int]]]) - the merged table, where keys are strings
    and values can be lists of tuples with integers or tuples with integers
    """

    def merge_tables(
        self,
        table1: Dict[str, Union[List, int]],
        table2: Dict[str, Union[List, int]],
        func: Callable[[Any, Any], Any],
    ) -> Dict[str, Union[List[Tuple[int, int]], Tuple[int, int]]]:
        def dfs_helper(
            key: str, dict1: Dict[str, Any], dict2: Dict[str, Any]
        ) -> Union[List[Tuple[int, int]], Tuple[int, int]]:
            if isinstance(dict1[key], numbers.Number) and isinstance(
                dict2[key], numbers.Number
            ):
                return func(dict1[key], dict2[key])
            elif isinstance(dict1[key], str) and isinstance(dict2[key], str):
                return func(dict1[key], dict2[key])
            elif isinstance(dict1[key], list) and isinstance(dict2[key], list):
                merged = []

                combined_list = dict1[key] + dict2[key]
                combined_list.sort(key=itemgetter(0))

                for x_axis, group in groupby(combined_list, key=itemgetter(0)):
                    group_list = list(group)
                    share_type = group_list[0][2]

                    if share_type == "enc-share":
                        merged.extend(group_list)
                    elif share_type == "share":
                        summed = sum(int(item[1]) for item in group_list) % self.prime
                        merged.append([x_axis, summed, "share"])
                    else:
                        raise ValueError("Incompatible cell types.")

                return merged
            elif isinstance(dict1[key], dict) and isinstance(dict2[key], dict):
                if set(dict1[key].keys()) == set(dict2[key].keys()):
                    return {
                        k: dfs_helper(k, dict1[key], dict2[key])
                        for k in dict1[key].keys()
                    }
                else:
                    raise ValueError(
                        "The given dictionaries do not have the same shape."
                    )
            else:
                raise ValueError("The given dictionaries do not have the same shape.")

        if not set(table1.keys()) == set(table2.keys()):
            raise ValueError("The given dictionaries do not have the same shape.")

        result_table: Dict[str, Union[List[Tuple[int, int]], Tuple[int, int]]] = {}

        for key in table1:
            result_table[key] = dfs_helper(key, table1, table2)
        return result_table

    """
    Count the number of cells in a table.

    inputs:
    table (Dict[str, Union[List, int]]) - the table to be counted, cells can be lists, strings or integers.

    outputs:
    count (int) - the number of cells in the table.
    """

    def count_cells(self, table: Dict[str, Union[List, int]]) -> int:
        count = 0

        def dfs_helper(key: str, table: Dict[str, Any]):
            nonlocal count
            if (
                isinstance(table[key], numbers.Number)
                or isinstance(table[key], str)
                or isinstance(table[key], list)
            ):
                count += 1
            elif isinstance(table[key], dict):
                for k in table[key].keys():
                    dfs_helper(k, table[key])
            else:
                raise Exception("Invalid table")

        for key in table:
            dfs_helper(key, table)

        return count

    """
    Get the number of cells in the final merged table.

    inputs:
    session_id (str) - the unique identifier of the session.

    outputs:
    count (int) - the number of cells in the final merged table.
    """

    def get_cell_count(self, session_id: str):
        session_data = self.get_session(session_id)

        if session_data["state"] != "closed":
            raise ValueError("Session is still open")

        if not session_data:
            raise ValueError("Invalid session ID")

        return session_data["num_cells"]

    """
    Update session data with new data submitted by a participant

    inputs:
    session_id (str) - the unique identifier of the session to be updated
    participant_id (str) - the identifier of the participant submitting the new data
    data (dict | str) - the data submitted by the participant, either as a dictionary or a JSON string

    outputs:
    None - this function has no return value but updates the session data with the new participant submission
    and saves the updated session data to the data store
    """

    def update_session_data(
        self, session_id: str, participant_id: str, data: dict | str
    ) -> None:
        session_data = self.get_session(session_id)

        print(f"session data: {session_data}")
        print(f"trying to insert: {data}")

        if session_data["state"] == "closed":
            raise ValueError("Session is closed")

        if not session_data:
            raise ValueError("Invalid session ID")

        if type(data) == str:
            data = json.loads(data)

        participant_data = self.get_participant_data(session_id, participant_id)

        if participant_data is not None:
            data['_id'] = participant_data['_id']

        data["timestamp"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        self.save_participant_data(session_id, participant_id, data)

    """
    Get the current session data

    inputs:
    session_id (str) - the unique identifier of the session for which submissions should be closed

    outputs:
    participant_submissions (dict) - the current session data history
    """

    def get_submission_history(self, session_id: str) -> dict:
        session_data = self.get_session(session_id)
        participant_data = self.get_all_participant_data(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        return [
            {
                "participantCode": participant["participantCode"],
                "industry": participant["industry"],
                "companySize": participant["companySize"],
                "timestamp": participant["timestamp"]
            }
            for participant in participant_data
        ]

    """
    Close submissions for a session

    inputs:
    session_id (str) - the unique identifier of the session for which submissions should be closed

    outputs:
    None - this function has no return value but updates the session state to "closed" and saves
    the updated session data to the data store
    """

    def close_submissions(self, session_id: str) -> None:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        session_data["state"] = "closed"

        self.save_session(session_id, session_data)

    """
    Get a session object

    inputs:
    session_id (str) - the unique identifier of the session to be retrieved

    outputs:
    session_data (dict) - the session data as a dictionary
    """

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        query = {"session_id": session_id}
        result = self.session_collection.find_one(query)

        if result is None:
            return None

        return result

    """
    Get a all participant submission objects

    inputs:
    session_id (str) - the unique identifier of the session to be retrieved

    outputs:
    session_data (dict) - the participant data as a array
    """

    def get_all_participant_data(self, session_id: str) -> Optional[Dict[str, Any]]:
        query = {"session_id": session_id}
        result = self.participant_collection.find(query)

        return result

    def get_participant_data(self, session_id: str, participant_code: str) -> Optional[Dict[str, Any]]:
        query = {"session_id": session_id, "participant_code": participant_code}
        result = self.participant_collection.find_one(query)

        return result
    """
    Generate urls for session participants

    inputs:
    session_id (str) - the unique identifier of the session for which participant urls should be generated
    participant_count (int) - the number of participants for which urls should be generated

    outputs:
    participant_urls (dict) - a dictionary of participant urls, with the keys being generic participant identifiers
    """

    def generate_participant_urls(
        self, session_id: str, participant_count: int
    ) -> Dict[str, str]:
        participant_urls = {}

        for i in range(participant_count):
            participant_token = str(uuid.uuid4())[:26]
            participant_url = f"{self.base_url}?session_id={session_id}&participant_code={participant_token}"
            participant_urls[f"participant_{i + 1}"] = participant_url

        return participant_urls

    """
    Get the public key for a session

    inputs:
    session_id (str) - the unique identifier of the session for which the public key should be retrieved

    outputs:
    public_key (str) - the public key for the session
    """

    def get_public_key(self, session_id: str) -> str:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        return session_data["public_key"]

    """
    Get prime number for a session

    inputs:
    session_id (str) - the unique identifier of the session for which the prime number should be retrieved

    outputs:
    prime (str) - the prime number for the session as a string
    """

    def get_prime(self, session_id: str) -> str:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        return str(session_data["prime"])

    """
    Get the merged data for a session

    inputs:
    session_id (str) - the unique identifier of the session for which the merged data should be retrieved

    outputs:
    merged_data (dict) - the merged data for the session
    """

    def get_submitted_data(self, session_id: str) -> dict:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        file = self.fs.find_one({ "filename" : f"{session_id}_merged.json"})
        if file is None:
            return None
        return json.loads(file.read())

    """
    Get the state of a session

    inputs:
    session_id (str) - the unique identifier of the session for which the state should be retrieved

    outputs:
    state (str) - the state of the session
    """

    def get_session_state(self, session_id: str) -> str:
        session_data = self.get_session(session_id)

        if not session_data:
            raise ValueError("Invalid session ID")

        return session_data["state"]

    """
    Reduce the unencrypted data for a session

    inputs:
    session_id (str) - the unique identifier of the session for which the data should be reduced
    reduce (function) - the function to be used to reduce the data

    outputs:
    None - this function has no return value but updates the session data with the reduced data and saves
    """

    def reduce_unencrypted(self, session_id: str, reduce: Callable) -> None:
        session_data = self.get_session(session_id)

        if session_data["state"] != "closed":
            raise ValueError("Session is not closed")

        def reduce_tables(elements: List[Dict], key: str) -> Dict:
            data = elements[0][key]

            for i in range(1, len(elements)):
                data = self.merge_tables(data, elements[i][key], reduce)

            return data

        submissions = list(self.get_all_participant_data(session_id))
        company_size_tables = defaultdict(list)
        industry_tables = defaultdict(list)

        # extract tables by categories
        for data in submissions:
            company_size_tables[data["companySize"]].append(data)
            industry_tables[data["industry"]].append(data)

        # reduce tables by categories
        for key, value in company_size_tables.items():
            company_size_tables[key] = reduce_tables(value, "table")

        for key, value in industry_tables.items():
            industry_tables[key] = reduce_tables(value, "table")

        merged_tables = reduce_tables(submissions, "table")
        metadata = self.compute_metadata(submissions)
        metadata["companySize"] = company_size_tables
        metadata["industry"] = industry_tables

        self.fs.put(json.dumps(merged_tables).encode("utf-8"), filename=f"{session_id}_merged.json")
        self.fs.put(json.dumps(metadata).encode("utf-8"), filename=f"{session_id}_metadata.json")
        session_data["num_cells"] = self.count_cells(merged_tables)

        self.save_session(session_id, session_data)

    """
    Compute summary of metadata

    inputs:
    data (list) - the list of submission dictionaries

    outputs:
    metadata (dict) - the metadata for the session
    """

    def compute_metadata(self, data: List[dict]) -> dict:
        metadata = {"companySize": defaultdict(int), "industry": defaultdict(int)}

        for i in range(len(data)):
            companySizeType = data[i]["companySize"]
            industryType = data[i]["industry"]
            metadata["companySize"][companySizeType] += 1
            metadata["industry"][industryType] += 1

        return metadata

    """
    Get metadata for a session

    inputs:
    session_id (str) - the unique identifier of the session for which the metadata should be retrieved

    outputs:
    metadata (dict) - the metadata for the session
    """

    def get_metadata(self, session_id: str) -> dict:
        session_data = self.get_session(session_id)

        if session_data["state"] != "closed":
            raise ValueError("Session is not closed")

        if not session_data:
            raise ValueError("Invalid session ID")
        file = self.fs.find_one({ "filename" : f"{session_id}_metadata.json"})
        if file is None:
            return None
        return json.loads(file.read())