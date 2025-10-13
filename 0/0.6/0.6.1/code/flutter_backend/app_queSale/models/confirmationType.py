from django.db import models
from .user import *
from .event import *
from .role import *


class ConfirmationType(models.Model):
    code = models.IntegerField()
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name




