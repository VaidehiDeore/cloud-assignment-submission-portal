from supabase import create_client, Client
from utils.config import settings
from utils.errors import AppError

_auth_client: Client | None = None
_admin_client: Client | None = None


def auth_client():
    global _auth_client
    if _auth_client is None:
        _auth_client = create_client(settings.supabase_url, settings.supabase_anon_key)
    return _auth_client


def admin_client():
    global _admin_client
    if _admin_client is None:
        _admin_client = create_client(
            settings.supabase_url, settings.supabase_service_role_key
        )
    return _admin_client


def register_user(name: str, email: str, password: str):
    try:
        response = auth_client().auth.sign_up(
            {"email": email, "password": password, "options": {"data": {"name": name}}}
        )
        if not response.user:
            raise AppError(
                "REGISTRATION_REQUIRES_VERIFICATION",
                "Registration started. Check your email if email confirmation is enabled.",
                201,
            )

        user_id = response.user.id
        # Role is deliberately fixed to student for self-registration.
        admin_client().table("profiles").insert(
            {"id": user_id, "name": name, "email": email, "role": "student"}
        ).execute()

        return response
    except AppError:
        raise
    except Exception as exc:
        message = str(exc).lower()
        if "already registered" in message or "already exists" in message:
            raise AppError("EMAIL_EXISTS", "An account with this email already exists.", 409)
        raise AppError("REGISTRATION_FAILED", "Registration could not be completed.", 400)


def login_user(email: str, password: str):
    try:
        return auth_client().auth.sign_in_with_password(
            {"email": email, "password": password}
        )
    except Exception:
        raise AppError("INVALID_CREDENTIALS", "Invalid email or password.", 401)


def logout_user(token: str):
    # Sign-out can be handled by the client by discarding the token.
    # Supabase's server-side signout is not required for this JWT-based flow.
    return True


def get_user_from_token(token: str):
    try:
        response = auth_client().auth.get_user(token)
        if not response.user:
            raise AppError("UNAUTHORIZED", "Invalid or expired token.", 401)

        profile = (
            admin_client()
            .table("profiles")
            .select("id,name,email,role")
            .eq("id", response.user.id)
            .single()
            .execute()
        )

        if not profile.data:
            raise AppError("PROFILE_NOT_FOUND", "User profile was not found.", 401)

        return profile.data
    except AppError:
        raise
    except Exception:
        raise AppError("UNAUTHORIZED", "Invalid or expired token.", 401)
