import requests
import jwt
class InsecureJWKClient:
    def __init__(self, jwks_uri):
        self.jwks_uri = jwks_uri
        try:
            self.jwks = requests.get(jwks_uri).json()
        except:
            print(jwks_uri)
            raise Exception("Failed to fetch JWKS")


    def get_signing_key_from_jwt(self, token: str):
        # Manually search for the key by 'kid'
        unverified_header = jwt.get_unverified_header(token)
        key = next((k for k in self.jwks["keys"] if k["kid"] == unverified_header["kid"]), None)

        if key is None:
            raise Exception("Matching key not found")

        # Construct the public key and decode
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)

        return public_key

def get_insecure_jwk_client():
    """
    LOCAL DEV ONLY: Returns a JWK client able to fetch keys from an insecure (http) enpoint.
    """
    import warnings
    import os

    warnings.warn("Insecure mode enabled. DO NOT use outside of local development environment.")
    return InsecureJWKClient(os.environ.get("OAUTH2_JWKS_URI"))