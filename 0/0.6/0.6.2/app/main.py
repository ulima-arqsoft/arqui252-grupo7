from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from pydantic import BaseModel
import jwt
import redis.asyncio as redis
from datetime import datetime, timedelta

app = FastAPI(title="User Profile API", version="1.0")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
SECRET_KEY = "mi_clave_secreta"
ALGORITHM = "HS256"

# Base de datos simulada
users_db = {
    "ryuichi": {
        "password": "password123",
        "nombre": "Ryuichi Oshiro Ugamoto",
        "email": "ryuichi@example.com",
        "telefono": "+51 999 123 456",
        "pais": "Perú",
        "rol": "Administrador"
    }
}

# Modelo para login
class LoginRequest(BaseModel):
    username: str
    password: str

# Modelo para el perfil del usuario
class UserProfile(BaseModel):
    username: str
    nombre: str
    email: str
    telefono: str
    pais: str
    rol: str

# Inicializar Redis para el rate limiter
@app.on_event("startup")
async def startup():
    redis_client = redis.from_url("redis://redis:6379", encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(redis_client)

# Endpoint de login (devuelve token JWT)
@app.post("/auth/login")
def login(request: LoginRequest):
    user = users_db.get(request.username)

    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    exp = datetime.utcnow() + timedelta(minutes=30)
    token = jwt.encode({"sub": request.username, "exp": exp}, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}

# Dependencia para obtener el usuario actual
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username not in users_db:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# Endpoint protegido: perfil del usuario
@app.get("/user/profile", response_model=UserProfile, dependencies=[Depends(RateLimiter(times=10, seconds=60))])
def get_profile(username: str = Depends(get_current_user)):
    user_data = users_db[username].copy()
    user_data.pop("password")  # Nunca exponer contraseñas
    user_data["username"] = username
    return user_data