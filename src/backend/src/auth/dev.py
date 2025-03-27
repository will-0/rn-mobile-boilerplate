from jwt.api_jwk import PyJWK
class InsecureJWKSClient:
    def __init__(self, jwks_uri):
        import requests
        import warnings
        warnings.warn("Insecure mode enabled. DO NOT use outside of local development environment.")
        self.jwks_uri = jwks_uri
        try:
            self.jwks = requests.get(jwks_uri).json()
        except:
            print(jwks_uri)
            raise Exception("Failed to fetch JWKS")


    def get_signing_key_from_jwt(self, token: str) -> PyJWK:
        import jwt
        from jwt.algorithms import RSAAlgorithm

        # Manually search for the key by 'kid'
        unverified_header = jwt.get_unverified_header(token)
        key = next((k for k in self.jwks["keys"] if k["kid"] == unverified_header["kid"]), None)

        if key is None:
            raise Exception("Matching key not found")

        # # Construct the public key and decode
        # public_key = RSAAlgorithm.from_jwk(key)

        return PyJWK(
            {
                "kty": key["kty"],
                "alg": key["alg"],
                "use": key["use"],
                "kid": key["kid"],
                "n": key["n"],
                "e": key["e"]
            },
            algorithm="RS256"
        )