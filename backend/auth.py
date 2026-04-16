from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

# Simple mock database for the demo
MOCK_USERS = {
    "admin": "admin",
    "demo": "demo",
    "bhagya": "bhagya123"
}

def verify_user(creds: LoginRequest) -> bool:
    """Verifies if the provided credentials exist in our mock database."""
    return MOCK_USERS.get(creds.username) == creds.password
