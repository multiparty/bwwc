import os
import jwt
from jwt.algorithms import get_default_algorithms
jwt.api_jws._algorithms.update(get_default_algorithms())


class Authenticator(object):
	def __init__(self):
		self.AUTH_PK_API = os.getenv("AUTH_PK_API")
		self.jwt_algorithm = os.getenv("JWT_ALGORITHM")
  
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
	def verify_token(self, token: str, public_key: str) -> bool:
		public_key = self.format_public_key(public_key)
		payload = jwt.decode(token, public_key, algorithms=[self.jwt_algorithm])
		return True