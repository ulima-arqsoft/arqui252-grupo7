from django.db import models
from .event import *
class Survey(models.Model):
    question = models.CharField(max_length=60)
    multiple_option = models.BooleanField(default=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.question
