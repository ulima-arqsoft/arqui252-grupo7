from django.db import models
from .user import *
from .event import *
from .role import *
from .confirmationType import *

class UserEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    confirmation_type = models.ForeignKey(ConfirmationType, on_delete=models.CASCADE)
    isFavourite = models.BooleanField(default=False)
    def __str__(self):
        return f'{self.user.username} - {self.event.title}'
