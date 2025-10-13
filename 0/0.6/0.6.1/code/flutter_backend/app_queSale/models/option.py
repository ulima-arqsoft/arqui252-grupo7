from django.db import models
from .survey import *

class Option(models.Model):
    description = models.CharField(max_length=60)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)

    def __str__(self):
        return self.description
