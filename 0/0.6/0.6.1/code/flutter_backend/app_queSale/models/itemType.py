from django.db import models

class ItemType(models.Model):
    name = models.CharField(max_length=50)
    floatable = models.BooleanField(default=False)

    def __str__(self):
        return self.name
