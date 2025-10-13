from django.db import models
from .itemType import *
from .event import *

class Item(models.Model):
    name = models.CharField(max_length=20)
    type = models.ForeignKey(ItemType, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
