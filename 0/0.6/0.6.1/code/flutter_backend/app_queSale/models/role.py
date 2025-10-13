from django.db import models
from .survey import *

class Role(models.Model):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=3)

    def __str__(self):
        return self.name
