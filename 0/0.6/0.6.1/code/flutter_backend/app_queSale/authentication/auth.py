from django.core.exceptions import ValidationError
from ..models import *

def authenticate(email, password):
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):  # Verifica la contraseña
            return user
        else:
            return None
    except User.DoesNotExist:
        return None

def createUser(username, email, password, thumbnail):
    try:
        if User.objects.filter(email=email).exists():
            return False, 'El usuario ya existe.'
        
        # Usar create_user del UserManager en lugar de crear el User directamente
        user = User.objects.create_user(
            email=email,
            password=password,
            username=username,
            thumbnail=thumbnail
        )
        
        return True, f'Usuario registrado correctamente. Su identificador es: {user.identifier}'
    except ValidationError as e:
        return False, f'Validation error: {e.messages}'
    except Exception as e:
        return False, f'An error occurred: {str(e)}'