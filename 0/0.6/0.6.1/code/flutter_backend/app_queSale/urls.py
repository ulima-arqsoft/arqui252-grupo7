from django.urls import path

from .views import *

urlpatterns = []
#IMAGENES
systemPatterns = [
    path('images/<str:tipo>/<str:nombre>/', mostrar_imagen, name='mostrar_imagen'),
]
urlpatterns += systemPatterns
#AUTH
authPatterns = [
    path('auth/login', AuthView.as_view(), name='login'),
    path('auth/register', AuthView.as_view(), name='register'),


    path('auth/passwordReset', AuthView.as_view(), name = 'change-password'),
    path('auth/sendVerification', AuthView.as_view(), name = 'send-verification'),
]
urlpatterns += authPatterns 



#USER
userPatterns = [
    path('user/info', UserDetailView.as_view(), name='userdata'),
    path('user/events', UserDetailView.as_view(), name='events'),
]
urlpatterns += userPatterns

#EVENTS
eventsPatterns = [
    path('event/edit_or_create', EventView.as_view()),
    path('event/categories', EventView.as_view()),
    path('event/itemTypes', EventView.as_view()),
    path('event/setEventItem', EventView.as_view()),
    path('event/public', EventView.as_view(), name='event-public'),
    path('event/favourite/', EventView.as_view(), name='event-favourite'),
    path('event/detail/', EventView.as_view(), name='event-detail'),
    path('event/setEventItem', EventView.as_view()),
    path('event/deleteEventItem/', EventView.as_view()),
    path('event/setUserItem/', EventView.as_view()),
    path('event/deleteUserItem/', EventView.as_view()),
    path('event/addEventUser/', EventView.as_view()),

    #LUIS => ELIMINAR USUARIO DEL EVENTO --- RECIBE EL event_id como "id"
    path('event/deleteUserEvent/', EventView.as_view()),

    #WALER => USER EVENT STATUS ---- RECIBE EL event_id como "id" de param
    path('event/setUserEventStatus/', EventView.as_view()),
    
    #ALVARO => ELIMINAR EVENTO  ---- RECIBE EL event_id como "id" de param
    path('event/deleteEvent/', EventView.as_view()),
]
urlpatterns += eventsPatterns



