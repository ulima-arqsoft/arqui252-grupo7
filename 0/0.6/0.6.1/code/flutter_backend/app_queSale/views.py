import base64
from decimal import Decimal
import mimetypes
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from datetime import datetime
from django.shortcuts import render
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from PIL import Image
from django.contrib.auth.hashers import check_password, make_password
import io
import string
import random
from .messageFormatter import return_message
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
from .credentials import *
import base64
# Create your views here.

from django.conf import settings
from . import *
from .authentication.auth import *

DOMINIO = 'https://appquesalebackend-production.up.railway.app'
# DOMINIO = 'http://127.0.0.1:8000'
# DOMINIO = 'http://192.168.18.192:8000'
# DOMINIO = 'http://10.142.208.127:8000'

def mostrar_imagen(request, tipo, nombre):
    if tipo == 'event':
        ruta_imagen = os.path.join(settings.STATIC_ROOT, 'event', nombre)
    elif tipo == 'user':
        ruta_imagen = os.path.join(settings.STATIC_ROOT, 'user', nombre)
    else:
        return HttpResponse("Tipo de imagen no válido", status=400)

    try:
        with open(ruta_imagen, 'rb') as imagen:
            contenido_imagen = imagen.read()
            # Obtener el tipo de contenido basado en la extensión de archivo
            tipo_contenido, _ = mimetypes.guess_type(nombre)
            if tipo_contenido:
                return HttpResponse(contenido_imagen, content_type=tipo_contenido)
            else:
                return HttpResponse(contenido_imagen, content_type='application/octet-stream')
    except FileNotFoundError:
        return HttpResponse("Imagen no encontrada", status=404)
#AUTH
class AuthView(APIView):  
    def post(self, request):
        if request.path.endswith('/register'):
            return self.register(request)
        #HIDKEI
        elif 'passwordReset' in request.path:
            return self.changePassword(request)
        elif 'sendVerification' in request.path:
            return self.sendVerificationEmail(request)
        else:
            return self.login(request)
        
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            user.is_superuser = True
            token, created = Token.objects.get_or_create(user=user)
            if created:
                print("Token created for user:", user.email)
            else:
                print("Token retrieved for user:", user.email)
            data = {
                "success": True,
                "data":  {
                    'token': token.key
                }
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'data': {'error': 'Invalid Credentials'}}, status=400)

    def register(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        imagen =  request.data.get("thumbnail")
        thumbnail_path = create_or_edit_image(imagen, 'create')
        try:
            success, msg = createUser(username=username, email=email, password= password, thumbnail = thumbnail_path)
            return Response({'success': success, 'data':{
                "message": msg
            }}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'success': False, 'data': {"error": e.messages}}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'success': False, 'data':  {"error":str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
   
        
    def changePassword(self, request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            token = data.get('token')
            old_password = data.get('old_password')
            new_password = data.get('new_password')
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

        # Check if all required fields are provided
        if not email or not old_password or not new_password:
            return JsonResponse({"error": "Email, old password, and new password are required."}, status=400)

        # Find the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"error": "User with this email does not exist."}, status=404)

        if(user.verification_token != token):
            return JsonResponse({"error": "Invalid token."}, status=400)

        # Verify the old password
        if not check_password(old_password, user.password):
            return JsonResponse({"error": "Incorrect old password."}, status=400)

        # Update the password
        user.password = make_password(new_password)
        user.save()

        return JsonResponse({"detail": "Password changed successfully."}, status=200)


    def sendVerificationEmail(self, request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

        # Find the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"error": "User with this email does not exist."}, status=404)

        nombre = user.username
        

        # Generate a random verification token
        verification_token = ''.join(random.choices(string.digits, k=6))
        user.verification_token = verification_token
        user.save()

        mensaje = return_message(nombre, user.verification_token)

        msg = MIMEMultipart('alternative')
        msg['From'] = "ADMINISTRADOR"
        msg['To'] = email
        msg['Subject'] = "Account Verification"
        msg.attach(MIMEText(mensaje, 'html'))

        try:
             with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(USER_MAIL, PASSWORD )
                server.sendmail(USER_MAIL, email, msg.as_string())
                return JsonResponse({"detail": "Token assigned succesfully and email sent"}, status=200)
        except Exception as e:
            respuesta = {
                "msg" : "Error en el login"
            }
            return HttpResponse(json.dumps(respuesta))


#USER DATA   
class UserDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.path.endswith('/info'):
            return self.userData(request)
        elif request.path.endswith('/events'):
            return self.userEvents(request)
        
    def userData(self, request):
        try:
            user = request.user
            user_thumbnail = f'{DOMINIO}/{user.thumbnail}'
            data = {
                "success": True,
                "data": {'username': user.username, 'email': user.email, "thumbnail": user_thumbnail, "identifier": user.identifier}
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            data = {
                "success": False,
                "data": {"error":e}
            }
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
    def userEvents(self, request):
        try:
            user = request.user
            relations = [relation for relation in UserEvent.objects.filter(user=user)]
            # Filtrar eventos donde el usuario está confirmado (confirmation_type.code != 0)
            events = [relation.event for relation in relations if relation.confirmation_type.code != 0]
            # Obtener eventos favoritos
            favourites = [relation.event for relation in relations if relation.isFavourite]
            # Obtener relaciones donde el usuario es admin
            admin_relations = [relation for relation in relations if relation.role.code == "ADM"]
            admin_events = [relation.event for relation in admin_relations]

            events = [{
                "id": event.pk,
                "title": event.title,
                "description": event.description,
                "thumbnail": f'{DOMINIO}/{event.thumbnail}',
                "dateTime": event.datetime.isoformat(),
                "wsp_link": event.wsp_link,
                "music_link": event.music_link,
                "isPublic": event.isPublic,
                "isFavourite": event in favourites,
                "isAdmin": event in admin_events,  # Añadimos este campo
                "location": {
                    "placeId": event.location.placeId,
                    "formattedAddress": event.location.formattedAddress,
                    "displayName": event.location.displayName,
                    "latitude": event.location.latitude,
                    "longitude": event.location.longitude,
                }
            } for event in events]
            
            data = {
                "success": True,
                "data": events
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            data = {
                "success": False,
                "data": {"error": str(e)}
            }
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

#EVENTS
class EventView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if '/detail/' in request.path and 'id' in request.GET:
            return self.detail(request)
        elif 'categories' in request.path:
            return self.eventCategories()
        elif request.path.endswith('itemTypes'):
            return self.getItemTypes()
        elif 'setUserItem/' in request.path and 'id' in request.GET and 'amount' in request.GET:
            return self.setUserItem(request)
        #LUIS => ELIMINAR USUARIO DEL EVENTO --- RECIBE EL event_id como "id"
        elif 'deleteUserEvent/' in request.path:
            return self.deleteUserEvent(request)
        
        #WALER => USER EVENT STATUS ---- RECIBE EL event_id como "id" de param
        elif 'setUserEventStatus/' in request.path and 'id' in request.GET and 'status_id' in request.GET:
            return self.setUserEventStatus(request)
        
        #HIDEKI => ELIMINAR EVENTO  ---- RECIBE EL event_id como "id" de param
        elif 'deleteEvent/' in request.path and 'id' in request.GET:
            return self.deleteEvent(request)
        
        elif 'deleteEventItem/' in request.path and 'item_id' in request.GET:
            return self.deleteEventItem(request)
        elif 'addEventUser/' in request.path and 'id' in request.GET:
            return self.addEventUser(request)
        elif '/favourite/' in request.path and 'event_id' in request.GET:
            return self.setFavourite(request)
        elif request.path.endswith('/public'):
            return self.publicEvents(request)

    def post(self, request):
        if request.path.endswith('/edit_or_create'):
            return self.createOrEdit(request)
        elif request.path.endswith('/setEventItem'):
            return self.setEventItem(request)
    def eventCategories(self):
        categories = ItemType.objects.all()
        mapped = [{
            "id": cat.pk,
            "type": cat.name,
            "floatable": cat.floatable 
        } for cat in categories]
        data = {
            "success": True,
            "data": mapped
        }
        return Response(data, status=status.HTTP_200_OK)
    def detail(self, request):
        try:
            current_user = request.user
            id = request.GET['id']
            event = Event.objects.get(id = id)
            usersDB = [user for user in UserEvent.objects.filter(event = event)]
            users = [{
                "id": user.user.pk,
                "username": user.user.username + (' (Tú)' if current_user.pk == user.user.pk else ''),
                "email": user.user.email,
                "thumbnail": f'{DOMINIO}/{user.user.thumbnail}',
                "role": user.role.name,
                "confirmation": user.confirmation_type.name
            } for user in usersDB]
            location = {
                    "placeId": event.location.placeId,
                    "formattedAddress": event.location.formattedAddress,
                    "displayName": event.location.displayName,
                    "latitude": event.location.latitude,
                    "longitude": event.location.longitude,
            }
            admins = [user.user.pk for user in usersDB if user.role.code == "ADM"]
            print(admins, current_user.pk)
            la_lista_item_type = [category for category in ItemType.objects.all()]

            la_lista_user_items = [userItem for userItem in UserItem.objects.all()]

            la_lista_event_items = [userItem for userItem in Item.objects.filter(event = event)]
      
            lista = [{
                "id": type.pk,
                "type": type.name,
                "floatable": type.floatable,
                "items": [{
                    "id": item.pk,
                    "name": item.name,
                    "total_amount": item.total_amount,
                    "items": [
                        {
                            "id": row.pk,
                            "userName": row.user.username + (' (Tú)' if current_user.pk == row.user.pk else ''),
                            "userThumbnail": f'{DOMINIO}/{row.user.thumbnail}',
                            "amount": row.amount,
                            "status": row.confirmed
                        } for row in la_lista_user_items if row.item == item
                    ] 
                } for item in la_lista_event_items if item.type == type]
            } for type in la_lista_item_type if len([item for item in la_lista_event_items if item.type == type]) > 0]

            event = {
                "id": event.pk,
                "title": event.title,
                "isAdmin": current_user.pk in admins,
                "description": event.description,
                "thumbnail": f'{DOMINIO}/{event.thumbnail}',
                "dateTime": event.datetime.isoformat(),
                "wsp_link": event.wsp_link,
                "music_link": event.music_link,
                "location": location,
                "members": users,
                "list": lista
            }
            data = {
                "success": True,
                "data": event
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            data = {
                "success": False,
                "data": {"error":e}
            }
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def getItemTypes(self):
        try:
            types = ItemType.objects.all().values()
            data = {
            "success": True,
            "data": types
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"success": False, "data": {"error": str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def addEventUser(self, request):
        try:
            user = request.user
            event_id = request.GET.get('id')
            identifier = request.GET.get('identifier')  # Nuevo parámetro
            
            # Buscar el usuario por identificador
            target_user = User.objects.get(identifier=identifier)
            event_db = Event.objects.get(pk=event_id)
            
            # Verificar que el usuario no esté ya en el evento
            if UserEvent.objects.filter(user=target_user, event=event_db).exists():
                raise Exception("El usuario ya está en el evento")
            
            role = Role.objects.get(code="GUE")
            confirmation = ConfirmationType.objects.get(name="Por Confirmar")
            
            event_user = UserEvent(
                user=target_user,  # Usar el usuario encontrado
                event=event_db,
                role=role,
                confirmation_type=confirmation
            )
            event_user.save()
            
            data = {
                "message": "Se añadió el usuario al evento correctamente"
            }
            return Response({"success": True, "data": data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {"success": False, "data": {"error": "Usuario no encontrado"}}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"success": False, "data": {"error": str(e)}}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

    def deleteEvent(self, request):
        try:
            event_id = request.GET.get('id')

            event = Event.objects.get(pk=event_id)

            event.delete()

            message = f"Evento eliminado correctamente."
            return Response({"success": True, "data": {"message": message}}, status=status.HTTP_200_OK)

        except Event.DoesNotExist:
            return Response({"success": False, "data": {"error": "Evento no encontrado"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({"success": False, "data": {"error": str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def setUserEventStatus(self, request):
        try:
            user = request.user
            event_id = request.GET['id']
            status_id = request.GET['status_id']
            user_event = UserEvent.objects.get(user=user, event_id=event_id)
            new_confirmation_type = ConfirmationType.objects.get(pk=status_id)
            user_event.confirmation_type = new_confirmation_type
            user_event.save()

            data = {
                "success": True,
                "data": {
                    "message": f"Estado de confirmación actualizado a: {new_confirmation_type.name}"
                }
            }
            return Response(data, status=status.HTTP_200_OK)

        except UserEvent.DoesNotExist:
            return Response(
                {"success": False, "data": {"error": "No se encontró la relación usuario-evento"}}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except ConfirmationType.DoesNotExist:
            return Response(
                {"success": False, "data": {"error": "Tipo de confirmación inválido"}}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"success": False, "data": {"error": str(e)}}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    def deleteUserEvent(self, request):
        try:
            event_id = request.GET.get('event_id')
            user_id = request.GET.get('user_id')

            print(event_id, user_id)
            eventDB = Event.objects.get(pk = event_id)
            print(eventDB.title)
            userDB = User.objects.get(pk = user_id)
            print(userDB.username)
            user_event = UserEvent.objects.get(event=eventDB, user = userDB)
            print("ECNONTRE")
            user_event.delete()

            message = f"Usuario {userDB.username} eliminado."
            return Response({"success": True, "data": {"message": message}}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "data": {"error": str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def deleteEventItem(self, request):
        try:
            item_id = request.GET.get('item_id')
            itemDB = Item.objects.get(pk = item_id)
            itemDB.delete()
            
            message = f"Item {itemDB.name} eliminado."
            return Response({"success": True, "data": {"message": message}}, status=status.HTTP_200_OK)
        except Exception as e:
            error = f"Error al eliminar del evento."
            return Response({"success": False, "data": {"error": error}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def setUserItem(self, request):
        try:    
            user = request.user
            id = request.GET['id']
            amount = request.GET['amount']
            print(user, id, amount)
            eventItem = Item.objects.get(pk = id)
            #VALIDAR
            print("EVENTITEM", eventItem.name)
            userItems = UserItem.objects.filter(item = eventItem)
            currentAmount = sum(useritem.amount for useritem in userItems)
            totalAmount = eventItem.total_amount
            amount = Decimal(amount)
            if totalAmount >= (currentAmount + amount):
                print("Xdddd=============")
                try:
                    userItem = UserItem.objects.get(user=user, item=eventItem)
                    print("ANDAADADAADW") 
                    userItem.amount += amount
                    print("XFKANKNAKWDNKAJW")
                    userItem.save()
                except Exception as e:
                    print("DDAJDNA")
                    userItem = UserItem(
                        user = user,
                        item = eventItem,
                        amount = amount
                    )
                    userItem.save()
                
                data = {
                    "success": True,
                    "data": {
                        "message": f"Se anadio correctamente {amount} - {eventItem.name}",
                    }
                }
                return Response(data, status=status.HTTP_200_OK)
            else:
                print("NO PASE XD")
                return Response({"success": False, "data": {"error": "Ya se superó la cantidad máxima"}}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"success": False, "data": {"error": str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
    def setEventItem(self, request):
        try:
            body = json.loads(request.body)
            print('=============================',body)
            item_name = body.get('item_name')
            item_requirement = body.get('total_amount')
            item_type = body.get('item_type_id')
            type_db = ItemType.objects.get(pk = item_type)
            data = {}
            if (item_id := body.get('item_id')) is not None:
                print("XXXXXXXXX", item_id)
                old_item = Item.objects.get(pk = item_id)
                print(old_item, "=DOFNSEFNISEJNFIJANEFIJN")
                old_item.name = item_name
                old_item.total_amount = item_requirement
                old_item.type = type_db
                old_item.save()
                data = {
                    "success": True,
                    "data": {
                        "message": f"Se editó correctamente {old_item.name}",
                }
            }
            else:
                event_id = body.get('event_id')
                event_db = Event.objects.get(pk = event_id)
                newItem = Item(
                    name         = item_name,
                    total_amount = item_requirement,
                    event        = event_db,
                    type         = type_db
                )
                newItem.save()
                data = {
                    "success": True,
                    "data": {
                        "message": f"Se creó correctamente {newItem.name} en {event_db.title}",
                    }
                }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "data": {"error": str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def createOrEdit(self, request):
        try:
            event_data = json.loads(request.body)
            print("EVENTO: ", event_data)
            user = request.user
            data = {}

            if 'datetime' in event_data:
                dt = datetime.strptime(event_data["datetime"].replace('.000', ''), "%Y-%m-%dT%H:%M:%S%z")
                event_data['datetime'] = dt

            location_data = ["placeId", "displayName", "formattedAddress", "latitude", "longitude"]
            new_location = None
            if all(field in event_data for field in location_data):
                new_location = Location(
                    placeId=event_data.get("placeId"),
                    displayName=event_data.get("displayName"),
                    formattedAddress=event_data.get("formattedAddress"),
                    latitude=event_data.get("latitude"),
                    longitude=event_data.get("longitude")
                )
                new_location.save()
                
            if (event_id := event_data.get('id')):
                # Obtenemos el evento existente
                event = Event.objects.get(pk=event_id)
                
                # Actualizamos la ubicación si hay una nueva
                if new_location:
                    if event.location:
                        old_location = event.location
                        event.location = new_location
                        event.save()
                        old_location.delete()
                
                # Actualizamos los campos básicos del evento
                if 'title' in event_data:
                    event.title = event_data['title']
                if 'description' in event_data:
                    event.description = event_data['description']
                if 'wsp_link' in event_data:
                    event.wsp_link = event_data['wsp_link']
                if 'music_link' in event_data:
                    event.music_link = event_data['music_link']
                if 'isPublic' in event_data:
                    event.isPublic = event_data['isPublic']
                if 'datetime' in event_data:
                    event.datetime = event_data['datetime']
                if 'thumbnail' in event_data and event_data['thumbnail']:
                    thumbnail_url = create_or_edit_image(event_data['thumbnail'], 'edit', event.thumbnail)
                    event.thumbnail = thumbnail_url
                
                # Guardamos los cambios
                event.save()

                data = {
                    "success": True,
                    "data": {
                        "message": "Evento Editado Correctamente"
                    }
                }
            else:
                # Removemos las comas que crean tuplas no deseadas
                newEvent = Event(
                    title=event_data.get("title"),
                    description=event_data.get("description", ""),
                    thumbnail=create_or_edit_image(event_data.get("thumbnail")),
                    wsp_link=event_data.get("wsp_link", ""),
                    music_link=event_data.get("music_link", ""),
                    datetime=dt,
                    location=new_location,
                    isPublic=event_data.get("isPublic")
                )
                newEvent.save()

                role = Role.objects.get(name="Admin")
                confirmationType = ConfirmationType.objects.get(name="Confirmado")

                newUserEvent = UserEvent(
                    user=user,
                    event=newEvent,
                    role=role,
                    confirmation_type=confirmationType
                )
                newUserEvent.save()

                data = {
                    "success": True,
                    "data": {
                        "message": "Evento Grabado Correctamente"
                    }
                }
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error en createOrEdit: {str(e)}")  # Agregamos print para debug
            return Response({"success": False, "data": {"error": str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def setFavourite(self, request):
        try:
            event_id = request.GET['event_id']
            new_state = request.GET['new_state']
            new_state = True if new_state.lower() == 'true' else False
            if not event_id:
                return Response({"success": False, "data":{"message": "event_id es requerido"}}, status=status.HTTP_400_BAD_REQUEST)
            user = request.user
            userEvent = UserEvent.objects.get(event_id = event_id,user = user)
            userEvent.isFavourite = new_state
            userEvent.save()
            data = {
                "success": True,
                "data": {
                    "message": f"Evento marcado como {'favorito' if new_state else 'no favorito'} correctamente",
                }
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            data = {
                "success": False,
                "data": {"error": str(e)}
            }
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def publicEvents(self, request):
        try:
            user = request.user
            
            events = [event for event in Event.objects.filter(isPublic = True)]

            favourites = [ relation.event for relation in UserEvent.objects.filter(user = user) if relation.isFavourite]
            events = [{
                "id": event.pk,
                "title": event.title,
                "description": event.description,
                "dateTime": event.datetime.isoformat(),
                "thumbnail":f'{DOMINIO}/{event.thumbnail}',
                "wsp_link": event.wsp_link,
                "music_link": event.music_link,
                "isPublic": event.isPublic,
                "isFavourite": event in favourites,
                "location": {
                    "placeId": event.location.placeId,
                    "formattedAddress": event.location.formattedAddress,
                    "displayName": event.location.displayName,
                    "latitude": event.location.latitude,
                    "longitude": event.location.longitude,
                }
            }for event in events]
            data = {
                "success": True,
                "data": events
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            data = {
                "success": False,
                "data": {"error":e}
            }
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
        

def create_or_edit_image(imagen, type = 'create', old_url = ''):
    image_base64 = imagen
    if imagen.startswith('data:image'):
        _, image_base64 = imagen.split(',', 1)
    image_data = base64.b64decode(image_base64)
    image = Image.open(io.BytesIO(image_data))
    output_image = io.BytesIO()
    image.save(output_image, format='JPEG', quality=80) 
    output_image.seek(0)

    static_path = 'static'
    server_path = 'que_sale/images'

    if type == 'create':
        current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
        image_name = f"{current_time}.jpg" 
        thumbnail_path = f"event/{image_name}"

        default_storage.save(f'{static_path}/{thumbnail_path}', output_image)
        thumbnail_url = f'{server_path}/{thumbnail_path}'
        return thumbnail_url
    elif type == 'edit':
        thumbnail_path = old_url.replace(server_path, '')
        old_image_path = f'{static_path}{thumbnail_path}'
        if default_storage.exists(old_image_path):
            default_storage.delete(old_image_path)
        default_storage.save(old_image_path, output_image)
        return old_url
