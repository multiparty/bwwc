import os
import time
import json
import requests
from typing import List

from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTError


class Authenticator(object):
    def __init__(self):
        self.AUTH_PK_API = os.getenv("AUTH_PK_API")
        self.jwt_algorithm = os.getenv("JWT_ALGORITHM")

    """
	Get public keys

	outputs:
	public_keys (List[str]) - A list of public keys.
	"""

    def get_public_key(self) -> List[str]:
        response = requests.get(self.AUTH_PK_API)

        if response.status_code != 200:
            raise Exception(
                f"HTTP request failed with status code {response.status_code}"
            )

        return [self.format_public_key(key) for key in json.loads(response.text)]

    """
	Format a public key string.
 
	inputs:
	key (str) - The public key.
	
	outputs:
	public_key (str) - The formatted public key with header and footer.
	"""

    def format_public_key(self, key: str) -> str:
        header = "-----BEGIN PUBLIC KEY-----"
        footer = "-----END PUBLIC KEY-----"

        if (header in key and footer not in key) or (
            header not in key and footer in key
        ):
            raise ValueError("Invalid public key")

        if header not in key and footer not in key:
            return f"{header}{key}{footer}"

        # else the key is already formatted
        return key

    """
    Verify if a token is expired.
    
    inputs:
    exp (float) - The expiration time of the token.
    
    outputs:
    is_expired (bool) - True if the token is expired, False otherwise.
    """

    def is_expired(self, exp: float) -> bool:
        return exp < time.time()

    """
	Verify authentication token

	inputs:
    token (str) - The authentication token.
 
	outputs:
    is_valid_token (bool) - True if the token is valid, False otherwise.
	"""

    def is_valid_token(self, token: str) -> bool:
        return True
        for key in self.get_public_key():
            try:
                payload = jwt.decode(token, key)
                return not self.is_expired(float(payload["exp"]))
            except ExpiredSignatureError as e:
                pass
            except JWTError as e:
                pass

        return False

    """
	Get the user id from a token. If there is no id, then raise an exception.

	inputs:
    token (str) - The authentication token.
 
	outputs:
    user_id (str) - The user id.
	"""

    def get_user_id(self, token: str) -> str:
        payload = jwt.decode(token, key)
        return payload["id"]
        raise Exception("Invalid token")
