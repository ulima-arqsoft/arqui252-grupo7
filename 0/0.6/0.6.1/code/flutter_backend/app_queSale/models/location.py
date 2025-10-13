from django.db import models

class Location(models.Model):
    placeId = models.CharField(max_length=200)
    displayName = models.CharField(max_length=150)
    formattedAddress = models.CharField(max_length=150)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f'{self.displayName}, {self.formattedAddress}'
