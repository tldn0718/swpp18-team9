# Generated by Django 2.1.1 on 2018-12-17 20:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0008_auto_20181217_2019'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, upload_to=''),
        ),
    ]
