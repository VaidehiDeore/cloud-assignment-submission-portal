from fastapi import APIRouter, Depends
from models.auth import RegisterRequest, LoginRequest
from cloud.auth_service import (
    register_user,
    login_user,
    logout_user,
    admin_client,
)
from utils.security import get_current_user

router = APIRouter(tags=["Authentication"])


@router.post("/register", status_code=201)
def register(payload: RegisterRequest):
    response = register_user(
        payload.name,
        payload.email,
        payload.password
    )

    return {
        "message": "Registration successful.",
        "user_id": response.user.id if response.user else None,
        "role": "student",
    }


@router.post("/login")
def login(payload: LoginRequest):
    response = login_user(
        payload.email,
        payload.password
    )

    profile = (
        admin_client()
        .table("profiles")
        .select("id,name,email,role")
        .eq("id", response.user.id)
        .single()
        .execute()
    )

    return {
        "message": "Login successful.",
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user": {
            "id": response.user.id,
            "name": profile.data["name"],
            "email": profile.data["email"],
            "role": profile.data["role"],
        },
    }


@router.post("/logout")
def logout(user=Depends(get_current_user)):
    return {
        "message": "Logout successful."
    }