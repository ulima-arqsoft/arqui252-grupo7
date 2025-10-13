from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Location)
admin.site.register(Event)

admin.site.register(UserEvent)
admin.site.register(ConfirmationType)
admin.site.register(Role)
admin.site.register(User)

admin.site.register(ItemType)
admin.site.register(Item)
admin.site.register(UserItem)