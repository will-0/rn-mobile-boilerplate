
    
def get_insecure_jwk_client():
    """
    LOCAL DEV ONLY: Returns a JWK client with certification verification disabled (needed for local https authentication).
    """
    import jwt
    import os
    import warnings
    import ssl

    warnings.warn("Insecure mode enabled. DO NOT use outside of local development environment.")
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False  # Disable hostname checking
    ssl_context.verify_mode = ssl.CERT_NONE  # Disable certificate verification
    return jwt.PyJWKClient(os.environ.get("OAUTH2_JWKS_URI"))