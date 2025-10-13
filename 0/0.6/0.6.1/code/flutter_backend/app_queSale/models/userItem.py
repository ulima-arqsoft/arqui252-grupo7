from django.db import models
from .user import *
from .item import *
class UserItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} - {self.item.name} - {self.item.event.title}'
