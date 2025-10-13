from django.db import models
from .location import *


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=500, blank=True)  
    thumbnail = models.CharField(max_length=200, blank=True)  
    wsp_link = models.CharField(max_length=200, blank=True)  
    music_link = models.CharField(max_length=200, blank=True) 
    datetime = models.DateTimeField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    isPublic = models.BooleanField(default=False)
    def __str__(self):
        return self.title
