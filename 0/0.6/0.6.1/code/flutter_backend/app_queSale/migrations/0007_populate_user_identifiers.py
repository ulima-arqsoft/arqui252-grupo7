from django.db import migrations
import random

def generate_identifiers(apps, schema_editor):
    User = apps.get_model('app_queSale', 'User')
    used_identifiers = set()
    
    for user in User.objects.all():
        if not user.identifier:  # Solo si el identificador es None
            while True:
                identifier = str(random.randint(1000, 9999))
                if identifier not in used_identifiers:
                    used_identifiers.add(identifier)
                    user.identifier = identifier
                    user.save()
                    break

def reverse_generate_identifiers(apps, schema_editor):
    User = apps.get_model('app_queSale', 'User')
    User.objects.all().update(identifier=None)

class Migration(migrations.Migration):
    dependencies = [
        ('app_queSale', '0006_user_identifier'),  # Asegúrate que este sea el número de tu migración anterior
    ]

    operations = [
        migrations.RunPython(generate_identifiers, reverse_generate_identifiers),
    ]