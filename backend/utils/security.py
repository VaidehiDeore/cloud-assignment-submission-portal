from fastapi import Header
from cloud.auth_service import get_user_from_token
from utils.errors import AppError


async def get_current_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise AppError("UNAUTHORIZED", "A valid Bearer token is required.", 401)

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise AppError("UNAUTHORIZED", "Authentication token is missing.", 401)

    return get_user_from_token(token)


def require_role(user: dict, *roles: str):
    if user.get("role") not in roles:
        raise AppError(
            "FORBIDDEN",
            f"This operation requires one of these roles: {', '.join(roles)}.",
            403,
        )
