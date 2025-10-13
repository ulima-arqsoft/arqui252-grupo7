from django.db import migrations
import random

def generate_unique_identifier(apps, schema_editor):
    User = apps.get_model('app_queSale', 'User')
    used_identifiers = set()
    
    for user in User.objects.all():
        while True:
            identifier = str(random.randint(1000, 9999))
            if identifier not in used_identifiers:
                used_identifiers.add(identifier)
                user.identifier = identifier
                user.save()
                break

class Migration(migrations.Migration):

    dependencies = [
        ('app_queSale', '0004_confirmationtype_code'),  
    ]

    operations = [
        migrations.RunPython(generate_unique_identifier),
    ]