# Generated by Django 5.1.5 on 2025-05-25 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_alter_material_topic'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='json',
            field=models.JSONField(default={}),
            preserve_default=False,
        ),
    ]
