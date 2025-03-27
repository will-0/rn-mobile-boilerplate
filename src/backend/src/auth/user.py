from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os

def get_jwk_client():
    """
    Returns a JWK client with certification verification enabled.
    """
    if os.environ.get("OAUTH_JWKS_URL_ALLOW_INSECURE") == "true":
        from .dev import get_insecure_jwk_client
        return get_insecure_jwk_client()
    else:
        return jwt.PyJWKClient(os.environ.get("OAUTH2_JWKS_URI"))

# Get security scheme and jwk_client
security = HTTPBearer()
jwk_client = get_jwk_client()

def auth_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Dependency that extracts and validates the JWT token.
    """
    token = credentials.credentials
    try:
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        options = {
            "verify_signature": True,
            "verify_aud": True,
            "verify_iss": True,
            "verify_exp": True,
            "verify_iat": True,
            "verify_nbf": True,
            "strict_aud": True,
        }

        payload = jwt.decode(
            jwt=token,
            key=signing_key.key,
            algorithms=["RS256"],
            options=options,
            audience=os.environ.get("OAUTH2_CLIENT_ID"),
            issuer=os.environ.get("OAUTH2_ISSUER")
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        ) from e

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject claim"
        )
    
    return user_id