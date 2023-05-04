import os
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
			raise Exception(f"HTTP request failed with status code {response.status_code}")
		
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

		if (header in key and footer not in key) or (header not in key and footer in key):
			raise ValueError("Invalid public key")

		if header not in key and footer not in key:
			return f"{header}{key}{footer}"

		# else the key is already formatted
		return key

	"""
	Verify authentication token

	inputs:
 
	outputs:
	"""
	def verify_token(self, token: str) -> bool:
		for key in self.get_public_key():
			try :
				payload = jwt.decode(token, key, algorithms=[self.jwt_algorithm])
				print(payload)
			except ExpiredSignatureError as e:
				print(e)
				pass
				# Check if valid payload
			except JWTError as e:
				print(e)
				pass
		return True